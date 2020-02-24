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

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

var Zotero;
const API_VERSION = 3;
const SERVER_PORT = 23116;

var Comm = new function() {
	var _observersRegistered = false, _converter, _lastDataListener,
		mainThread;
	
	/**
	 * Observes browser startup to initialize ZoteroOpenOfficeIntegration HTTP server
	 */
	this.init = async function() {
		Zotero = Components.classes["@zotero.org/Zotero;1"]
			.getService(Components.interfaces.nsISupports)
			.wrappedJSObject;
		await Zotero.initializationPromise;
		mainThread = Zotero.mainThread;
		
		// Initialize the converter
		_converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
			.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		_converter.charset = "UTF-8";
		
		// Start listening on socket
		var serv = Components.classes["@mozilla.org/network/server-socket;1"]
					.createInstance(Components.interfaces.nsIServerSocket),
			servCompat = Components.classes["@mozilla.org/network/server-socket;1"]
					.createInstance(Components.interfaces.nsIServerSocket);
		try {
			// Start main socket listener
			serv.init(SERVER_PORT, true, -1);
			serv.asyncListen({
				"onSocketAccepted":function(socket, transport) {
					Zotero.debug("LibreOfficePlugin: Connection received");
			
					// Close old data listener
					if(_lastDataListener) {
						try {
							_lastDataListener.onStopRequest();
						} catch(e) {}
					}
			
					new DataListener(transport);
				},
				"onStopListening":function() {
					Zotero.debug("LibreOfficePlugin: Communication server going offline");
				}
			});
			Zotero.debug("LibreOfficePlugin: Communication server listening on 127.0.0.1:"+serv.port);
			
			// Start listener for socket to let user know their LO extension is out of date
			servCompat.init(19876, true, -1);
			servCompat.asyncListen({
				"onSocketAccepted":function(socket, transport) {
					Comm.incompatibleVersion();
					transport.close();
				},
				"onStopListening":function() {}
			});
		} catch(e) {
			Zotero.logError(e);
			Zotero.debug("LibreOfficePlugin: Not initializing communication server");
		}
		
		if (Zotero.addShutdownListener) {
			Zotero.debug("LibreOfficePlugin: Registering shutdown listener");
			Zotero.addShutdownListener(function() {
				Zotero.debug("LibreOfficePlugin: Shutting down communication server");
				
				// Close sockets
				if(serv) serv.close();
				if(servCompat) serv.close();
				// Close data listener
				if(_lastDataListener) {
					try {
						_lastDataListener.onStopRequest();
					} catch(e) {}
				}
			});
		}
	}
		
	/**
	 * Handles the actual acquisition of data
	 */
	var DataListener = function(transport) {
		this.iStream = transport.openInputStream(0, 0, 0);
		this.oStream = transport.openOutputStream(Components.interfaces.nsITransport.OPEN_BLOCKING, 0, 0);
		
		this.bStream = Components.classes["@mozilla.org/binaryinputstream;1"].
				createInstance(Components.interfaces.nsIBinaryInputStream);
		this.bStream.setInputStream(this.iStream);
		
		this.boStream = Components.classes["@mozilla.org/binaryoutputstream;1"].
				createInstance(Components.interfaces.nsIBinaryOutputStream);
		this.boStream.setOutputStream(this.oStream);
	
		this.pump = Components.classes["@mozilla.org/network/input-stream-pump;1"]
							 .createInstance(Components.interfaces.nsIInputStreamPump);
		try {
			this.pump.init(this.iStream, -1, -1, 0, 0, false);
		} catch (e) {
			// Fx60
			this.pump.init(this.iStream, 0, 0, false);
		}
		this.pump.asyncRead(this, null);
	}
	
	DataListener.prototype = {
		"_transactionCallbacks":{
			0:[
				function(payload) {
					Zotero.Integration.execCommand("OpenOffice", payload, null)
				},
				function(errString) {
					Zotero.logError(e);
				}
			]
		},
		"_nextTransactionID":1,
		"_frameHeader":"",
		"_frameTransactionID":null,
		"_frameRemaining":null,
		"_frameContent":"",
		
		/**
		 * Called when a request begins (although the request should have begun before
		 * the DataListener was generated)
		 */
		"onStartRequest":function(request, context) {
		},
		
		/**
		 * Called when a request stops
		 */
		"onStopRequest":function(request, context, status) {
			this.iStream.close();
			this.oStream.close();
		},
		
		/**
		 * Called when new data is available
		 */
		"onDataAvailable":function(request, context, inputStream, offset, count) {
			// Zotero.debug("LibreOfficePlugin: "+count+" bytes available");
			
			// Keep track of the last connection we read on
			_lastDataListener = this;
			
			while(count) {
				if(this._frameRemaining !== null) {
					if(count >= this._frameRemaining) {
						this._frameContent += this.bStream.readBytes(this._frameRemaining);
						count -= this._frameRemaining;
						this._frameRemaining = 0;
						this._processFrame();
					} else {
						this._frameContent += this.bStream.readBytes(count);
						this._frameRemaining -= count;
						return;
					}
				} else {
					var readBytes = Math.min(8-this._frameHeader.length, count);
					this._frameHeader += this.bStream.readBytes(readBytes);
					if(this._frameHeader.length !== 8) return;
					this._frameTransactionID = this._readUint32(this._frameHeader, 0);
					this._frameRemaining = this._readUint32(this._frameHeader, 4);
					count -= readBytes;
				}
			}
		},
		
		/**
		 * Converts 4 characters of a string to a uint32 (big endian)
		 */
		"_readUint32":function(string, offset) {
			return (string.charCodeAt(offset) << 24)
				+ (string.charCodeAt(offset+1) << 16)
				+ (string.charCodeAt(offset+2) << 8)
				+ string.charCodeAt(offset+3);
		},
		
		/**
		 * Processes a completed frame
		 */
		"_processFrame":function() {
			this._frameHeader = "";
			this._frameRemaining = null;
			var input = _converter.ConvertToUnicode(this._frameContent);
			this._frameContent = "";
			
			Zotero.debug("LibreOfficePlugin: Read "+this._frameTransactionID+" "+input);
			
			var callbacks;
			if((callbacks = this._transactionCallbacks[this._frameTransactionID])) {
				// Remove callback from list
				if(this._frameTransactionID !== 0) {
					delete this._transactionCallbacks[this._frameTransactionID];
				}
	
				// Parse JSON
				var err, payload;
				if(input.substr(0, 4) == "ERR:") {
					err = input.substr(4);
				} else {
					try {
						payload = JSON.parse(input);
					} catch(e) {
						err = e;
					}
				}
				
				// Transmit to callback
				Zotero.setTimeout(function() {
					if(err) {
						callbacks[1](err);
					} else {
						callbacks[0](payload);
					}
				}, 0);
			}
		},
		
		/**
		 * Get a transaction ID and register a callback for it
		 */
		"beginTransaction":function(successCallback, errorCallback) {
			var transactionID = this._nextTransactionID++;
			// Don't exceed MAX_INT
			if(this._nextTransactionID === 2147483647) {
				this._nextTransactionID = 1;
			}
			this._transactionCallbacks[transactionID] = [successCallback, errorCallback];
			return transactionID;
		},
	}
	
	/**
	 * Sends a command. This differs from _writeCommand in that it serializes its
	 * arguments and queues them if necessary.
	 */
	this.sendCommand = function(cmd, args) {
		var receivedData, error;
		this.sendCommandAsync(cmd, args,
			function(response) {
				receivedData = response;
			},
			function(err) {
				receivedData = true;
				error = err;
			}
		);
		
		while(receivedData === undefined) {
			mainThread.processNextEvent(true);
		}
		if(error) throw error;
		
		return receivedData;
	}
	
	/**
	 * Writes to the communication channel, waiting asynchronously for a response.
	 */
	this.sendCommandAsync = function(cmd, args, successCallback, errorCallback) {
		var payload = JSON.stringify([cmd, args]);
		payload = _converter.ConvertFromUnicode(payload);
		
		var receivedData;
		var transactionID = _lastDataListener.beginTransaction(successCallback, errorCallback);
		
		// Write to stream
		Zotero.debug("LibreOfficePlugin: Sending "+transactionID+" "+payload);
		_lastDataListener.boStream.write32(transactionID);
		_lastDataListener.boStream.write32(payload.length);
		_lastDataListener.boStream.writeBytes(payload, payload.length);
		_lastDataListener.boStream.flush();
	}
	
	/**
	 * Displays a message warning the user that the LibreOffice extension is incompatible.
	 */
	this.incompatibleVersion = function() {
		var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
			.getService(Components.interfaces.nsIPromptService);
		var shouldReinstall = ps.confirm(null, "Zotero LibreOffice Integration Error",
			'The version of the Zotero LibreOffice Integration component installed within '+
			'LibreOffice does not appear to match '+
			'this Zotero Standalone version. '+
			'Would you like to attempt to reinstall it?\n\n'+
			'Please ensure your LibreOffice installation is properly detected. If you '+
			'continue to experience this error, click the "Manual Installation" button '+
			'within the wizard to show the directory containing the LibreOffice component. '+
			'Double-click this component or add it from within LibreOffice '+
			'to complete the installation procedure.');
		
		if(shouldReinstall) {
			var ZoteroOpenOfficeInstaller = Components.utils.import("resource://zotero-openoffice-integration/installer.jsm").Installer;
			var zpi = new ZoteroOpenOfficeInstaller(false, true);
		}
		
		// We throw this error to avoid displaying another error dialog
		Zotero.logError("Zotero and LibreOffice extension versions are incompatible");
		throw Components.Exception("ExceptionAlreadyDisplayed");
	}
};

/**
 * A service to initialize the integration server on startup
 */
var Initializer = function() {
	Comm.init();
};
Initializer.prototype = {
	classDescription: "Zotero LibreOffice Integration Initializer",
	"classID":Components.ID("{f43193a1-7060-41a3-8e82-481d58b71e6f}"),
	"contractID":"@zotero.org/Zotero/integration/initializer?agent=OpenOffice;1",
	"QueryInterface":XPCOMUtils.generateQI([Components.interfaces.nsISupports]),
	"service":true
};

/**
 * See integrationTests.js
 */
var Application = function() {
	this.wrappedJSObject = this;
};
Application.prototype = {
	classDescription: "Zotero LibreOffice Integration Application",
	classID:		Components.ID("{8478cd98-5ba0-4848-925a-75adffff2dbf}"),
	contractID:		"@zotero.org/Zotero/integration/application?agent=OpenOffice;1",
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISupports]),
	_xpcom_categories: [{
		category: "profile-after-change",
		service: true
	}],
	service:		true,
	getActiveDocument: async function() {
		var retVal = Comm.sendCommand("Application_getActiveDocument", [API_VERSION]);
		if(typeof retVal !== "object" || retVal[0] !== API_VERSION) Comm.incompatibleVersion();
		return new Document(retVal[1]);
	},
	primaryFieldType: "ReferenceMark",
	secondaryFieldType: "Bookmark",
	supportedNotes: ["footnote", "endnote"],
	supportsImportExport: true,
	outputFormat: "rtf",
	processorName: "LibreOffice"
};

/**
 * See integrationTests.js
 */
var Document = function(documentID) {
	this._documentID = documentID;
};
Document.prototype = {};
for (let method of ["displayAlert", "activate", "canInsertField", "getDocumentData",
	"setDocumentData", "setBibliographyStyle", "complete", "exportDocument", "importDocument"]) {
	let methodStable = method;
	Document.prototype[method] = function() {
		return Comm.sendCommand("Document_"+methodStable,
			[this._documentID].concat(Array.prototype.slice.call(arguments)));
	};
}
Document.prototype.cleanup = function() {};
Document.prototype.cursorInField = function(fieldType) {
	var retVal = Comm.sendCommand("Document_cursorInField", [this._documentID, fieldType]);
	if(retVal === null) return null;
	return new Field(this._documentID, retVal[0], retVal[1], retVal[2]);
};
Document.prototype.insertField = function(fieldType, noteType) {
	var retVal = Comm.sendCommand("Document_insertField", [this._documentID, fieldType, parseInt(noteType) || 0]);
	return new Field(this._documentID, retVal[0], retVal[1], retVal[2]);
};
Document.prototype.getFields = function(fieldType) {
	var documentID = this._documentID;
	return new Zotero.Promise(function(resolve, reject) {
		Comm.sendCommandAsync("Document_getFields", [this._documentID, fieldType],
			function(result) {
				var fields = [];
				for (let i = 0; i < result[0].length; i++) {
					fields.push(new Field(documentID, result[0][i], result[1][i], result[2][i]));
				}
				resolve(fields);
			},
			reject
		);
	}.bind(this));
};
Document.prototype.convert = function(fields, fieldType, noteTypes) {
	var i = 0;
	for (let field of fields) {
		Comm.sendCommand("Field_convert", [this._documentID, field._index, fieldType, noteTypes[i]]);
		i++;
	}
};

/**
 * See integrationTests.js
 */
var Field = function(documentID, index, code, noteIndex) {
	this._documentID = documentID; 
	this._index = index;
	this._code = code;
	this._noteIndex = noteIndex;
};
Field.prototype = {};

for (let method of ["delete", "select", "removeCode", "setText", "getText"]) {
	let methodStable = method;
	Field.prototype[method] = function() {
		return Comm.sendCommand("Field_"+methodStable,
			[this._documentID, this._index].concat(Array.prototype.slice.call(arguments)));
	};
}
Field.prototype.setText = function(text, isRich) {
	return Comm.sendCommand("Field_setText",
		[this._documentID, this._index, text, isRich]);
}
Field.prototype.getCode = function() {
	Zotero.debug(`LibreOfficePlugin: Field(${this._index}).getCode: ${this._code}`);
	return this._code;
}
Field.prototype.setCode = function(code) {
	this._code = code;
	Comm.sendCommand("Field_setCode", [this._documentID, this._index, code]);
	// Setting field codes removes formatting, so we have to do reapply the text again
	// (Doing this within the LO plugin is not viable)
	let start = code.indexOf('{');
	if (start == -1) {
		return;
	}
	let json = JSON.parse(code.substring(start, code.lastIndexOf('}')+1));
	let text = json.properties && json.properties.formattedCitation;
	if (!text) {
		return;
	}
	let isRich = false;
	if (text.includes("\\")) {
		if (text.substr(0,5) != "{\\rtf") {
			text = "{\\rtf "+text+"}";
		}
		isRich = true;
	}
	if (isRich) {
		this.setText(text, isRich);
	}
}
Field.prototype.getNoteIndex = function() {
	Zotero.debug(`LibreOfficePlugin: Field(${this._index}).getNoteIndex: ${this._noteIndex}`);
	return this._noteIndex;
}
Field.prototype.equals = function(arg) {
	return this._index === arg._index;
}

for (let cls of [Document, Field]) {
	for (let method in cls.prototype) {
		if (typeof cls.prototype[method] == 'function') {
			let syncMethod = cls.prototype[method];
			cls.prototype[method] = async function() {
				return syncMethod.apply(this, arguments);
			}
		}
	}
}

var classes = [
	Initializer,
	Application,
];

var NSGetFactory = XPCOMUtils.generateNSGetFactory(classes);

