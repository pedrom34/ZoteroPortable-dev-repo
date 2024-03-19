/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright (c) 2017  Zotero
						Center for History and New Media
						George Mason University, Fairfax, Virginia, USA
						http://zotero.org
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

var EXPORTED_SYMBOLS = ["Installer"];
var Zotero = Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
var ZoteroPluginInstaller = Components.utils.import("resource://zotero/word-processor-plugin-installer.js").ZoteroPluginInstaller;
var Installer = function(failSilently=true, force) {
	return new ZoteroPluginInstaller(Plugin, failSilently, force);
}

const UNOPKG_LOCATIONS = {
	Mac:[
		"/Applications/LibreOffice.app/Contents/MacOS/unopkg",
	],
	Win:[
		"C:\\Program Files\\LibreOffice\\program\\unopkg.exe",
		"C:\\Program Files (x86)\\LibreOffice\\program\\unopkg.exe",
		"C:\\Program Files\\LibreOffice 7\\program\\unopkg.exe",
		"C:\\Program Files (x86)\\LibreOffice 7\\program\\unopkg.exe",
		"C:\\Program Files\\LibreOffice 6\\program\\unopkg.exe",
		"C:\\Program Files (x86)\\LibreOffice 6\\program\\unopkg.exe",
		"C:\\Program Files\\LibreOffice 5\\program\\unopkg.exe",
		"C:\\Program Files (x86)\\LibreOffice 5\\program\\unopkg.exe",
	],
	Other:[
		"/usr/bin/unopkg",
		
		"/usr/lib/libreoffice/program/unopkg",
		"/usr/lib64/libreoffice/program/unopkg",
		
		"/usr/lib/libreoffice4/program/unopkg",
		"/usr/lib64/libreoffice4/program/unopkg",
		"/usr/lib/libreoffice3/program/unopkg",
		"/usr/lib64/libreoffice3/program/unopkg",
	]
};

const UNOPKG_RELPATHS = {
	Mac:[
		"Contents/MacOS/unopkg"
	],
	Win:[
		"program\\unopkg.exe"
	],
	Other:[
		"program/unopkg"
	]
};

var Plugin = new function() {
	this.UNOPKG_PATHS_PREF = "unopkgPaths";
	
	this.EXTENSION_STRING = "Zotero LibreOffice Integration";
	this.EXTENSION_ID = "zoteroOpenOfficeIntegration@zotero.org";
	this.EXTENSION_PREF_BRANCH = "extensions.zoteroOpenOfficeIntegration.";
	this.EXTENSION_DIR = "zotero-openoffice-integration";
	this.APP = 'LibreOffice';
	
	this.REQUIRED_ADDONS = [];
	
	// Bump if you want to trigger auto-update
	this.LAST_INSTALLED_FILE_UPDATE = "6.0.3pre";
	this.DISABLE_PROGRESS_WINDOW = true;
	
	var zoteroPluginInstaller, pathToAddon, installing, prefBranch, wizardWindow;
	
	this.verifyNotCorrupt = function() {}
	
	this.__defineGetter__("platform", function() {
		if(Zotero.isMac) {
			return "Mac";
		} if(Zotero.isWin) {
			return "Win";
		}
		return "Other";
	});
	
	this.install = async function(zpi) {
		if(wizardWindow && !wizardWindow.closed) {
			wizardWindow.focus();
			return;
		}
		if(installing) return;
		
		zoteroPluginInstaller = zpi;
		this.pathToAddon = zoteroPluginInstaller.getAddonPath(this.EXTENSION_ID);
		
		// look for installations
		var installations = await this.getInstallations(),
			haveSelectedPaths = false,
			havePaths = false;
		for(var i in installations) {
			haveSelectedPaths |= (installations[i] === true);
			havePaths = true;
		}

		if(haveSelectedPaths && !zpi.force) {
			// If there are installations already selected from a previous install and we are not
			// being forced to show wizard, do silent install

			// Automatically select new installations
			for(var i in installations) {
				if(installations[i] === null) installations[i] = true;
			}

			this.installComponents(installations, function(success) {
				if(success) {
					zpi.success();
				} else {
					openInstallationWizard();
				}
			});
		} else if(!zpi.failSilently || havePaths) {
			// Otherwise, if there are installations and we are not failing silently, open the
			// wizard
			openInstallationWizard();
		}
	}
	
	/**
	 * Creates a new nsIFile corresponding to a given path
	 */
	this.getFile = function(path) {
		var file = Components.classes["@mozilla.org/file/local;1"].
			createInstance(Components.interfaces.nsIFile);
		file.followLinks = true;
		file.initWithPath(path);
		return file;
	}
	
	/**
	 * Gets a list of potential LibreOffice installations by
	 * checking paths and checking the preferences.
	 *
	 * @return {Object} An object whose keys are paths and whose values
	 * are either true, false, or null, representing installations that
	 * the user has selected in the past, installations that the user
	 * has not selected in the past, and installations that were not
	 * previously known, respectively.
	 */
	this.getInstallations = async function() {
		// First try getting unopkg paths pref
		var previousPaths, paths = {};
		try {
			previousPaths = JSON.parse(zoteroPluginInstaller.prefBranch.getCharPref(this.UNOPKG_PATHS_PREF));
		} catch(e) {
			previousPaths = {};
		}

		if(previousPaths instanceof Array) {
			// Convert old-format unopkg path array to object
			var convertPaths = previousPaths;
			previousPaths = {};
			for(var i=0; i<convertPaths.length; i++) {
				previousPaths[convertPaths[i]] = true;
			}
		}
		
		// Add previousPaths that exist to paths array
		for(var path in previousPaths) {
			try {
				if(Plugin.getFile(path).exists()) {
					paths[path] = previousPaths[path];
				}
			} catch(e) {};
		}
		
		// Start looking for paths from the list above, in case new
		// copies/versions of LibreOffice/OpenOffice have been
		// installed
		var potentialLocations = UNOPKG_LOCATIONS[Plugin.platform];

		if(Zotero.isWin) {
			var wrk = Components.classes["@mozilla.org/windows-registry-key;1"]
				.createInstance(Components.interfaces.nsIWindowsRegKey), path;
			try {
				wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,
					"Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\unopkg.exe",
					Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
				try {
					path = wrk.readStringValue("");
				} finally {
					wrk.close();
				}
			} catch(e) {}
			if(path) {
				potentialLocations = potentialLocations.slice();
				potentialLocations.push(path);
			}
		}
		else if (Zotero.isLinux) {
			await Zotero.File.iterateDirectory('/opt', async (entry) => {
				if (entry.name.startsWith('libreoffice')) {
					potentialLocations.push(entry.path + '/program/unopkg');
				}
			});
		}

		for (let potentialLocation of potentialLocations) {
			try {
				var file = Plugin.getFile(potentialLocation);
			} catch(e) {
				continue;
			}
			
			if(!paths.hasOwnProperty(file.path) && file.exists()) {
				paths[file.path] = null;
			}
		}
		
		return paths;
	}
	
	/**
	 * Gets the path to the LibreOffice oxt file
	 * @return {nsIFile}
	 */
	this.getOxtPath = function() {
		var oxt = this.pathToAddon.clone();
		oxt.append("install");
		oxt.append("Zotero_OpenOffice_Integration.oxt");
		return oxt;
	}
	
	/**
	 * Installs LibreOffice components
	 * @param {String[]} unopkgPaths Paths to unopkg
	 * @param {Function} callback Function to call when installation is complete. Argument 
	 *		reflects whether installation was successful.
	 */
	this.installComponents = function(unopkgPaths, callback) {
		// set prefs in preferences
		zoteroPluginInstaller.prefBranch.setCharPref(this.UNOPKG_PATHS_PREF, JSON.stringify(unopkgPaths));
		
		// get path to oxt
		var oxt = this.getOxtPath();
		
		// start installing
		var usePaths = [];
		for(var i in unopkgPaths) {
			if(unopkgPaths[i]) usePaths.push(i);
		}
		installComponent(oxt, usePaths, callback);
	}
	
	/**
	 * Opens the installation wizard dialog
	 */
	function openInstallationWizard() {
		var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
				   .getService(Components.interfaces.nsIWindowWatcher);
		wizardWindow = ww.openWindow(null, "chrome://zotero-openoffice-integration/content/install.xul",
					"openoffice-install-wizard", "chrome,centerscreen", {"wrappedJSObject":{
						"ZoteroOpenOfficeIntegration":Plugin,
						"ZoteroPluginInstaller":zoteroPluginInstaller
					}});
	}
	
	/**
	 * Called recursively to install to different unopkgPaths
	 */
	function installComponent(oxt, unopkgPaths, callback) {
		installing = true;
		
		// if all unopkgPaths have been exhausted, we were successful
		if(!unopkgPaths.length) {
			installing = false;
			callback(true);
			return;
		}
		
		// otherwise, install to next unopkg path
		var proc = Components.classes["@mozilla.org/process/util;1"].
				createInstance(Components.interfaces.nsIProcess);
		var path = unopkgPaths.shift();
		Zotero.debug("ZoteroOpenOfficeIntegration: Installing with unopkg at "+path);
		proc.init(Plugin.getFile(path));
		
		proc.runAsync(["remove", "org.Zotero.integration.openoffice"], 2, {"observe":function() {
			proc.runAsync(["add", oxt.path], 2, {"observe":function(process, topic) {
				if(topic === "process-finished" && !process.exitValue) {
					// recursively continue installing until all unopkgPaths are exhausted
					installComponent(oxt, unopkgPaths, callback);
				} else {
					// abort on error
					installing = false;
					callback(false);
					throw "unopkg at "+path+" failed to install";
				}
			}});
		}});
	}
}
