/*
    ***** BEGIN LICENSE BLOCK *****
	
	Copyright (c) 2009  Zotero
	                    Center for History and New Media
						George Mason University, Fairfax, Virginia, USA
						http://zotero.org
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    ***** END LICENSE BLOCK *****
*/

var EXPORTED_SYMBOLS = ["Installer"];
var Zotero = Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
var ZoteroPluginInstaller = Components.utils.import("resource://zotero/word-processor-plugin-installer.js").ZoteroPluginInstaller;
var Installer = function(failSilently, force) {
	return new ZoteroPluginInstaller(Plugin,
		failSilently !== undefined ? failSilently : Zotero.isStandalone,
		force);
}

var Plugin = new function() {
	this.EXTENSION_STRING = "Zotero Word for Windows Integration";
	this.EXTENSION_ID = "zoteroWinWordIntegration@zotero.org";
	this.EXTENSION_PREF_BRANCH = "extensions.zoteroWinWordIntegration.";
	this.EXTENSION_DIR = "zotero-winword-integration";
	this.APP = 'Microsoft Word';
	
	this.REQUIRED_ADDONS = [{
		name: "Zotero",
		url: "zotero.org",
		id: "zotero@chnm.gmu.edu",
		minVersion: "4.0.28.6.SOURCE",
		required: true
	}, {
		name: "Zotero LibreOffice Integration",
		url: "zotero.org/support/word_processor_plugin_installation",
		id: "zoteroOpenOfficeIntegration@zotero.org",
		minVersion: "3.5b2.SVN",
		required: false
	}];
	this.LAST_INSTALLED_FILE_UPDATE = "5.0.8pre";
	
	var zoteroPluginInstaller;
	
	this.verifyNotCorrupt = function(zpi) {}
	
	this.install = function(zpi) {
		// get Zotero.dot file
		var dotm = zpi.getAddonPath(this.EXTENSION_ID);
		dotm.append("install");
		dotm.append("Zotero.dotm");

		// find Word Startup folders (see http://support.microsoft.com/kb/210860)
		var appData = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("AppData", Components.interfaces.nsIFile);
		
		// first check the registry for a custom startup folder
		var startupFolders = [];
		var addDefaultStartupFolder = false;
		var wrk = Components.classes["@mozilla.org/windows-registry-key;1"]
			.createInstance(Components.interfaces.nsIWindowsRegKey);
		var installedVersions = [];
		Zotero.debug("WinWordIntegration[install]: Looking for Word in HKCU");
		for(var i=9; i<=20; i++) {
			var path = null;
			try {
				wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
					"Software\\Microsoft\\Office\\"+i+".0\\Word\\Options",
					Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
				installedVersions.push(i);
				try {
					path = wrk.readStringValue("STARTUP-PATH");
				} finally {
					wrk.close();
				}
			} catch(e) {}
			
			// create nsIFile from path in registry
			if(path) {
				try {
					startupFolders.push(Zotero.File.pathToFile(path));
				} catch(e) {
					addDefaultStartupFolder = true;
				}
			} else {
				try {
					wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
						"Software\\Microsoft\\Office\\"+i+".0\\Common\\General",
						Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
					try {
						var startup = wrk.readStringValue("Startup");
						var startupFolder = appData.clone().QueryInterface(Components.interfaces.nsIFile);
						startupFolder.appendRelativePath("Microsoft\\Word\\"+startup);
						startupFolders.push(startupFolder);
					} finally {
						wrk.close();
					}
				} catch(e) {
					addDefaultStartupFolder = true;
				}
			}
		}

		if(installedVersions.length == 0) {
			Zotero.debug("WinWordIntegration[install]: Word installations not found in HKCU. Searching in HKLM");
			for(var i=9; i<=20; i++) {
				try {
					wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,
						"Software\\Microsoft\\Office\\"+i+".0\\Word",
						Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
					installedVersions.push(i);
					wrk.close();
					addDefaultStartupFolder = true;
				} catch(e) {}
			}
		}
		
		if(startupFolders.length == 0 || addDefaultStartupFolder) {
			// if not in the registry, append Microsoft/Word/Startup to %AppData% (default location)
			var startupFolder = appData.clone().QueryInterface(Components.interfaces.nsIFile);
			startupFolder.appendRelativePath("Microsoft\\Word\\Startup");
			startupFolders.push(startupFolder);
		}
		
		// The OEM Word 365 sandboxed location, which we might not have the permissions to write to
		// but it is worth a shot
		var startupFolder = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("LocalAppData", Components.interfaces.nsIFile)
			.QueryInterface(Components.interfaces.nsIFile);
		startupFolder.appendRelativePath("Packages\\Microsoft.Office.Desktop_8wekyb3d8bbwe\\LocalCache\\Roaming\\Microsoft\\Word\\Startup");
		startupFolders.push(startupFolder);
		
		for (var startupFolder of startupFolders) {
			if (!startupFolder.clone().exists()) {
				Zotero.debug(`Potential Word startup location ${startupFolder.path} does not exist. Skipping`);
				continue;
			}
			var oldDot = startupFolder.clone().QueryInterface(Components.interfaces.nsIFile);
			var oldDotm = oldDot.clone();
			oldDot.append("Zotero.dot");
			oldDotm.append("Zotero.dotm");

			for(var template of [oldDot, oldDotm]) {
				if(template.exists()) {
					try {
						template.remove(false);
					} catch(e) {
						Zotero.debug(e);
						throw new Error("Could not remove "+template.path);
					}
				}
			}

			// copy Zotero.dotm file to Word Startup folder
			try {
				dotm.copyTo(startupFolder, "Zotero.dotm");
			} catch (e) {
				Zotero.debug(e);
				throw new Error(`Could not copy Zotero.dotm to ${startupFolder.path}`)
			}
		}
		
		zpi.success();
	}
}
