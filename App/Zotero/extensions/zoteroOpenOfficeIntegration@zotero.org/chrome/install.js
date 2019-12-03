/*
    ***** BEGIN LICENSE BLOCK *****
	
	Copyright (c) 2011  Zotero
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

Components.utils.import("resource://gre/modules/osfile.jsm");
var FilePicker = require('zotero/filePicker').default;

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

var javaCommonCheckComplete = false;
var wizard, platform, bashProc, neededPackages;
var breadcrumbs = [];

/*** ROUTINES RUN ON LOAD ***/

/**
 * Called on initial wizard load
 */
function onLoad() {
	wizard = document.documentElement;
	javaCommonCheckRun = false;
	
	for(var param in window.arguments[0].wrappedJSObject) window[param] = window.arguments[0].wrappedJSObject[param];
	
	if(Zotero.isWin) {
		checkJRE();
	} else if(!Zotero.isMac) {
		wizard.getPageById("intro").next = "java-common";
		
		checkJavaCommon(function(success) {
			// if openoffice.org-java-common check succeeds, we don't need to show the page for it
			javaCommonCheckComplete = true;
			
			if(success) {
				wizard.getPageById("intro").next = "openoffice-installations";
				wizard.getPageById("java-common").next = "openoffice-installations";
			} else {
				wizard.getPageById("intro").next = "java-common";
				wizard.getPageById("java-common").next = "java-common-install";
				document.getElementById("java-common-required").hidden = false;
				document.getElementById("java-common-progress").hidden = true;
				document.getElementById("java-common-packages").textContent = neededPackages.join("\n");
			}
			
			if(wizard.currentPage.pageid === "java-common") {
				wizard.canAdvance = true;
				if(success) wizard.advance();
			}
		});
	} else {
		checkMacJDK().then(function(success) {
			if (!success) {
				wizard.getPageById("intro").next = "jdk-required";
			}
		});
	}
}

/**
 * Check for openoffice.org-java-common and prompt user to install if necessary, or else hide
 * java-common-page
 */
function checkJavaCommon(callback) {
	neededPackages = [];
	
	// check for dpkg
	var dpkg = ZoteroOpenOfficeIntegration.getFile("/usr/bin/dpkg");
	if(!dpkg.exists()) {
		callback(true);
		return;
	}
	
	// check for bash
	var bash = ZoteroOpenOfficeIntegration.getFile("/bin/bash");
	if(!bash.exists()) {
		callback(true);
		return;
	}
	
	// check for java
	var java = ZoteroOpenOfficeIntegration.getFile("/usr/bin/java");
	var success1 = java.exists();
	if(!success1) neededPackages.push("default-jre");
	
	// init processes
	bashProc = Components.classes["@mozilla.org/process/util;1"].
			createInstance(Components.interfaces.nsIProcess);
	bashProc.init(bash);
	
	checkJavaCommonPkg("openoffice.org-writer", "openoffice.org-java-common", function(success2) {
		checkJavaCommonPkg("libreoffice-writer", "libreoffice-java-common", function(success3) {
			callback(success1 && success2 && success3);
		});
	});
}

var checkMacJDK = Zotero.Promise.coroutine(function* () {
	var success = false;
	try {
		success = yield Zotero.Utilities.Internal.exec('/bin/bash/', ['-c', '/usr/libexec/java_home | grep -e "jdk"']);
	} catch (e) {
		Zotero.logError(e);
	}
	return success;
});

function checkJavaCommonPkg(pkgMain, pkgRequired, callback) {
	// check for openoffice.org-writer with openoffice.org-java-common available but not installed
	bashProc.runAsync(["-c", "dpkg -l '"+pkgMain.replace(".", "\\.")+"' | grep '^ii '"], 2, {"observe":function(subject1, topic1) {
		if(topic1 === "process-finished" && !bashProc.exitValue) {
			Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgMain+" is installed");
			// only care if openoffice.org-writer is installed; otherwise, we are probably not using
			// default packages and probably have Java
			bashProc.runAsync(
					["-c", "[ `apt-cache search '"+pkgRequired.replace(".", "\\.")+"' | wc -l` != 0 ]"], 2,
					{"observe":function(subject2, topic2) {
				// only care if openoffice.org-java-common is available for install; otherwise, we
				// are probably using packages that include Java
				if(topic2 === "process-finished" && !bashProc.exitValue) {
					Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgRequired+" is available");
					bashProc.runAsync(["-c", "dpkg -l | grep '"+pkgRequired.replace(".", "\\.")+"'"], 2,
							{"observe":function(subject3, topic3) {
						wizard.canAdvance = true;
						if(topic3 === "process-failed" || bashProc.exitValue) {
							Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgRequired+" is not installed");
							neededPackages.push(pkgRequired);
							callback(false);
						} else {
							Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgRequired+" is installed");
							callback(true);
						}
					}});
				} else {
					Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgRequired+" is unavailable");
					callback(true);
				}
			}});
		} else {
			Zotero.debug("ZoteroOpenOfficeIntegration: "+pkgMain+" is not installed");
			callback(true);
		}
	}});
}

/**
 * Check if JRE is installed on Windows
 */
function checkJRE() {
	var isInstalled = false,
		keys = ['Java Runtime Environment', 'JRE'],
		wrk = Components.classes["@mozilla.org/windows-registry-key;1"]
			.createInstance(Components.interfaces.nsIWindowsRegKey);

  for (let key of keys) {
    try {
        wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,
          `Software\\JavaSoft\\${key}`,
          Components.interfaces.nsIWindowsRegKey.ACCESS_READ | Components.interfaces.nsIWindowsRegKey.WOW64_32);
        isInstalled = isInstalled || !!wrk.readStringValue("CurrentVersion");
    } catch (e) {
      Zotero.debug(`32-bit java not found under key ${key}.`);
    }
	}
  wrk.close();
	
	if (!isInstalled) {
    for (let key of keys) {
      try {
          wrk.open(Components.interfaces.nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,
            `Software\\JavaSoft\\${key}`,
            Components.interfaces.nsIWindowsRegKey.ACCESS_READ | Components.interfaces.nsIWindowsRegKey.WOW64_64);
          isInstalled = isInstalled || !!wrk.readStringValue("CurrentVersion");
      } catch (e) {
        Zotero.debug(`64-bit java not found under key ${key}.`);
      }
    }
    wrk.close();
	}
	
	if (isInstalled) {
		wizard.getPageById("intro").next = "openoffice-installations";
		
		if(wizard.currentPage.pageid === "jre-required") {
			wizard.canAdvance = true;
			wizard.advance();
		}
	} else {
		wizard.getPageById("intro").next = "jre-required";
	}
}

/*** intro-page ***/

/**
 * Called when java-common wizardpage is shown
 */
function introPageShown() {
	document.documentElement.canAdvance = true;
}

/*** java-common-page ***/

/**
 * Called when java-common wizardpage is shown
 */
function javaCommonPageShown() {
	wizard.canAdvance = javaCommonCheckComplete;
}

/*** java-common-install-page ***/

/**
 * Called when java-common-install wizardpage is shown
 */
function javaCommonInstallPageShown() {
	wizard.canAdvance = false;
	wizard.canRewind = false;
	document.getElementById("java-common-install-progress").hidden = false;
	document.getElementById("java-common-install-error").hidden = true;
	
	var proc = Components.classes["@mozilla.org/process/util;1"].
			createInstance(Components.interfaces.nsIProcess);
	
	// first try to install via apturl
	var apturl = ZoteroOpenOfficeIntegration.getFile("/usr/bin/apturl");
	if(apturl.exists()) {
		proc.init(apturl);
		proc.runAsync(["apt:"+neededPackages.join(",")], 1, {"observe":function(subject, topic) {
			checkJavaCommon(javaCommonVerifyInstallationCallback);
			wizard.canAdvance = true;
			wizard.canRewind = true;
		}});
	} else {
		// if no apturl, try to install via xterm
		var xterm = ZoteroOpenOfficeIntegration.getFile("/usr/bin/xterm");
		if(xterm.exists()) {
			proc.init(xterm);
			proc.runAsync(["-e", "sudo apt-get install "+neededPackages.join(" ")+"; sleep 2;"], 2,
					{"observe":function(subject, topic) {
				checkJavaCommon(javaCommonVerifyInstallationCallback);
				wizard.canAdvance = true;
				wizard.canRewind = true;
			}});
		} else {
			document.getElementById("java-common-install-progress").hidden = true;
			document.getElementById("java-common-install-error").hidden = false;
			wizard.canAdvance = true;
			wizard.canRewind = true;
		}
	}
}

function javaCommonVerifyInstallationCallback(success) {
	if(success) {
		// if install appears to have succeeded
		wizard.getPageById("intro").next = "openoffice-installations";
		wizard.advance();
	} else {
		// if install appears to have failed
		document.getElementById("java-common-install-progress").hidden = true;
		document.getElementById("java-common-install-error").hidden = false;
	}
}

/*** jre-required page ***/

/**
 * Called when jre-required wizardpage is shown
 */
function jreRequiredPageShown() {
	wizard.canAdvance = false;
}

/*** openoffice-installations-page ***/

/**
 * Called when openoffice-installations wizardpage is shown
 */
function openofficeInstallationsPageShown() {
	wizard.canAdvance = false;
	
	var installations = ZoteroOpenOfficeIntegration.getInstallations();
	
	// add installations to listbox
	var listbox = document.getElementById("installations-listbox");
	while(listbox.hasChildNodes()) listbox.removeChild(listbox.firstChild);
	for(var installation in installations) {
		var itemNode = document.createElement("listitem");
		itemNode.setAttribute("type", "checkbox");
		itemNode.setAttribute("label", installation);
		if(installations[installation] !== false) {
			itemNode.setAttribute("checked", "true");
			wizard.canAdvance = true;
		}
		listbox.appendChild(itemNode);
	}
}

/**
 * Called to add an LibreOffice installation directory
 */
async function openofficeInstallationsAddDirectory() {
	var fp = new FilePicker();
	
	// show dialog to select directory
	if(Zotero.isMac) {
		fp.init(window, "Select the LibreOffice application", fp.modeOpen);
		fp.appendFilter("Mac OS X Application Bundle", "*.app");
	} else {
		fp.init(window, "Select the LibreOffice installation directory", fp.modeGetFolder);
	}
	
	if (await fp.show() != fp.returnOK) {
		return;
	}
	
	// find unopkg executable
	var unopkg = OS.Path.join(fp.file, UNOPKG_RELPATHS[ZoteroOpenOfficeIntegration.platform]);
	
	if (!await OS.File.exists(unopkg)) {
		unopkg = OS.Path.join(fp.file, UNOPKG_RELPATHS[ZoteroOpenOfficeIntegration.platform]);
	}
	
	if (!await OS.File.exists(unopkg)) {
		Services.prompt.alert(
			window,
			"unopkg Not Found",
			"The unopkg executable could not be found in the selected LibreOffice installation "
				 + "directory. Please ensure that you have selected the correct directory and try again."
		 );
	}
	
	// ensure unopkg is not already in list
	var listbox = document.getElementById("installations-listbox");
	var nodes = listbox.childNodes;
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].label === unopkg) return;
	}
	
	// add unopkg to list
	var itemNode = document.createElement("listitem");
	itemNode.setAttribute("type", "checkbox");
	itemNode.setAttribute("label", unopkg);
	itemNode.setAttribute("checked", "true");
	listbox.appendChild(itemNode);
	
	wizard.canAdvance = true;
}

/**
 * Called to reveal LibreOffice extension for manual installation
 */
function openofficeInstallationsManualInstallation() {
	// clear saved unopkg paths so we force manual install on upgrade
	ZoteroPluginInstaller.prefBranch.setCharPref(
		ZoteroOpenOfficeIntegration.UNOPKG_PATHS_PREF, "{}");
	
	// get oxt path and set it in the dialog
	var oxtPath = ZoteroOpenOfficeIntegration.getOxtPath();
	document.getElementById("installation-manual-path").textContent = oxtPath.path;
	try {
		oxtPath.QueryInterface(Components.interfaces.nsIFile).reveal();
	} catch(e) {
		Zotero.logError(e);
	}
	
	// we were successful and installation was complete
	ZoteroPluginInstaller.success();
	showInstallationComplete("manual");
}

/**
 * Called when an LibreOffice installation is checked or unchecked
 */
function openofficeInstallationsListboxSelectionChanged() {
	var listbox = document.getElementById("installations-listbox");
	for (let node of listbox.childNodes) {
		if(node.checked) {
			wizard.canAdvance = true;
			return;
		}
	}
	wizard.canAdvance = false;
}

/**
 * Called to specify what should be shown on installation-complete-page
 * @param {String} vboxToShow Which vbox should be visible
 */
function showInstallationComplete(vboxToShow) {
	// show correct description
	for (let vbox of ["manual", "error", "successful"]) {
		var vboxElem = document.getElementById("installation-"+vbox);
		vboxElem.hidden = vbox != vboxToShow;
	}
	
	// show correct label
	const msgs = {
		"error":"Installation Failed",
		"manual":"Manual Installation",
		"successful":"Installation Successful"
	};
	wizard.getPageById("installation-complete").setAttribute("label", msgs[vboxToShow]);
	
	// go to installation complete page
	wizard.goTo("installation-complete");
	wizard.canAdvance = true;
	wizard.canRewind = true;
}

/*** installing-page ***/

/**
 * Called when installing-page wizardpage is shown
 */
function installingPageShown() {
	wizard.canAdvance = false;
	wizard.canRewind = false;
	
	var listbox = document.getElementById("installations-listbox");
	var paths = {};
	for (let node of listbox.childNodes) {
		paths[node.label] = !!node.checked;
	}
	ZoteroOpenOfficeIntegration.installComponents(paths,
			function(success) {
		showInstallationComplete(success ? "successful" : "error");
		ZoteroPluginInstaller[success ? "success" : "error"]();
	});
}

/*** installation-complete-page ***/

function reportErrors() {
	var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
			   .getService(Components.interfaces.nsIWindowWatcher);
	var data = {
		msg: Zotero.getString('errorReport.followingReportWillBeSubmitted'),
		errorData: Zotero.getErrors(true),
		askForSteps: true
	};
	var io = { wrappedJSObject: { Zotero: Zotero, data:  data } };
	var win = ww.openWindow(null, "chrome://zotero/content/errorReport.xul",
				"zotero-error-report", "chrome,centerscreen,modal", io);
}

/*** WIZARD BUTTON HANDLERS ***/

function wizardCancelled() {
	if(wizard.currentPage.pageid != "installation-complete") {
		var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
		var cancel = promptService.confirm(window, "Zotero LibreOffice Integration", "Are you sure you want "+
			"to cancel Zotero LibreOffice Integration installation? To "+
			"install later, visit the Cite pane of the Zotero preferences.");
		if(cancel) {
			ZoteroPluginInstaller.cancelled();
			return true;
		}
		return false;
	}
}

function wizardBack() {
	var pageid = wizard.currentPage.pageid;
	
	if(pageid === "java-common" || pageid === "jre-required") {
		wizard.goTo("intro");
	} else if(pageid === "java-common-install") {
		wizard.goTo("java-common");
	} else if(pageid === "openoffice-installations") {
		wizard.goTo(wizard.getPageById("intro").next === "openoffice-installations" ? "intro" : wizard.getPageById("intro").next);
	} else if(pageid === "installing" || pageid === "installation-complete") {
		wizard.goTo("openoffice-installations");
	} else {
		throw "Don't know how to go back from "+pageid;
	}
}

function activated() {
	var pageid = wizard.currentPage.pageid;
	
	if(pageid === "jre-required") {
		checkJRE();
	}
}

/*** EVENT LISTENERS ***/

window.addEventListener("load", onLoad, false);
window.addEventListener("activate", activated, false);