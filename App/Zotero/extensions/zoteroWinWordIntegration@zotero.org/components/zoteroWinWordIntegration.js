/*
    ***** BEGIN LICENSE BLOCK *****
	
	Copyright (c) 2012  Zotero
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

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/ctypes.jsm");

var Zotero = Components.classes["@zotero.org/Zotero;1"]
			.getService(Components.interfaces.nsISupports)
			.wrappedJSObject;
var field_t, document_t, fieldListNode_t, progressFunction_t, lib, libPath, f, fieldPtr;

/**
 * Loads libzoteroWinWordIntegration.dll and initializes js-ctypes functions
 */
function init() {
	if(lib) return;
	var ios = Components.classes["@mozilla.org/network/io-service;1"]  
		.getService(Components.interfaces.nsIIOService);
	var resHandler = ios.getProtocolHandler("resource")
		.QueryInterface(Components.interfaces.nsIResProtocolHandler);
	var fileURI = resHandler.getSubstitution("zotero-winword-integration")
		.QueryInterface(Components.interfaces.nsIFileURL);
	libPath = fileURI.file;
	if (Zotero.platform == "Win64") {
		libPath.append("libzoteroWinWordIntegration_x64.dll");
	} else {
		libPath.append("libzoteroWinWordIntegration.dll");
	}
	
	lib = ctypes.open(libPath.path);
	
	document_t = new ctypes.StructType("document_t");
	
	field_t = new ctypes.StructType("field_t", [
		{ code: ctypes.jschar.ptr },
		{ text: ctypes.jschar.ptr },
		{ noteType: ctypes.unsigned_short },
		{ bookmarkName: ctypes.jschar.ptr },
		{ textLocation: ctypes.long },
		{ noteLocation: ctypes.long }
		// There's more here, but we will never access it, and we do not create field_t objects
		// from JavaScript
	]);
	
	fieldListNode_t = new ctypes.StructType("fieldListNode_t");
	fieldListNode_t.define([
		{ field: field_t.ptr },
		{ next: fieldListNode_t.ptr }
	]);
	
	progressFunction_t = new ctypes.FunctionType(ctypes.stdcall_abi, ctypes.void_t,
		[ctypes.int]).ptr;
	
	var statusCode = ctypes.unsigned_short;
	f = {
		// void clearError(void);
		clearError: lib.declare("clearError", ctypes.stdcall_abi, ctypes.void_t),
		
		// jschar* getError(void);
		getError: lib.declare("getError", ctypes.stdcall_abi, ctypes.jschar.ptr),
		
		// statusCode getDocument(const jschar* documentName, Document** returnValue);
		getDocument: lib.declare("getDocument", ctypes.stdcall_abi, statusCode,
			ctypes.jschar.ptr, document_t.ptr.ptr),
		
		// void freeDocument(Document *doc);
		freeDocument: lib.declare("freeDocument", ctypes.stdcall_abi, statusCode, document_t.ptr),
		
		// statusCode displayAlert(jschar const dialogText[], unsigned short icon,
		//						   unsigned short buttons, unsigned short* returnValue);
		displayAlert: lib.declare("displayAlert", ctypes.stdcall_abi, ctypes.unsigned_short,
			document_t.ptr, ctypes.jschar.ptr, ctypes.unsigned_short, ctypes.unsigned_short,
			ctypes.unsigned_short.ptr),
		
		// statusCode canInsertField(Document *doc, const jschar fieldType[], bool* returnValue);
		canInsertField: lib.declare("canInsertField", ctypes.stdcall_abi, statusCode,
			document_t.ptr, ctypes.jschar.ptr, ctypes.bool.ptr),
		
		// statusCode cursorInField(Document *doc, const jschar fieldType[], Field** returnValue);
		cursorInField: lib.declare("cursorInField", ctypes.stdcall_abi, statusCode, document_t.ptr,
			ctypes.jschar.ptr, field_t.ptr.ptr),
		
		// statusCode getDocumentData(Document *doc, jschar **returnValue);
		getDocumentData: lib.declare("getDocumentData", ctypes.stdcall_abi, statusCode,
			document_t.ptr, ctypes.jschar.ptr.ptr),
		
		// statusCode setDocumentData(Document *doc, const jschar documentData[]);
		setDocumentData: lib.declare("setDocumentData", ctypes.stdcall_abi, statusCode,
			document_t.ptr, ctypes.jschar.ptr),
		
		// statusCode insertField(Document *doc, const jschar fieldType[],
		//					      unsigned short noteType, Field **returnValue)
		insertField: lib.declare("insertField", ctypes.stdcall_abi, statusCode, document_t.ptr,
			ctypes.jschar.ptr, ctypes.unsigned_short, field_t.ptr.ptr),
		
		// statusCode getFields(document_t *doc, const jschar fieldType[],
		//					    fieldListNode_t** returnNode);
		getFields: lib.declare("getFields", ctypes.stdcall_abi, statusCode, document_t.ptr,
			ctypes.jschar.ptr, fieldListNode_t.ptr.ptr),
		
		// statusCode setBibliographyStyle(Document *doc, long firstLineIndent, 
		//								   long bodyIndent, unsigned long lineSpacing,
		//								   unsigned long entrySpacing, long tabStops[],
		//								   unsigned long tabStopCount);
		setBibliographyStyle: lib.declare("setBibliographyStyle", ctypes.stdcall_abi,
			statusCode, document_t.ptr, ctypes.long, ctypes.long, ctypes.unsigned_long,
			ctypes.unsigned_long, ctypes.long.array(), ctypes.unsigned_long),

		// statusCode exportDocument(Document *doc, const jschar fieldType[], const jschar importInstructions[]);
		exportDocument: lib.declare("exportDocument", ctypes.stdcall_abi, statusCode, document_t.ptr,
			ctypes.jschar.ptr, ctypes.jschar.ptr),

		// statusCode importDocument(Document *doc, const jschar fieldType[], bool *returnValue);
		importDocument: lib.declare("importDocument", ctypes.stdcall_abi, statusCode, document_t.ptr,
			ctypes.jschar.ptr, ctypes.bool.ptr),
		
		// statusCode convert(document_t *doc, field_t* fields[], unsigned long nFields,
		//				      const jschar toFieldType[], unsigned short noteType[]);
		convert: lib.declare("convert", ctypes.stdcall_abi, statusCode, document_t.ptr,
			field_t.ptr.ptr, ctypes.unsigned_long, ctypes.jschar.ptr, ctypes.unsigned_short.ptr),
		
		// statusCode cleanup(Document *doc);
		cleanup: lib.declare("cleanup", ctypes.stdcall_abi, statusCode, document_t.ptr),

		// statusCode complete(Document *doc);
		complete: lib.declare("complete", ctypes.stdcall_abi, statusCode, document_t.ptr),
		
		// statusCode deleteField(Field* field);
		deleteField: lib.declare("deleteField", ctypes.stdcall_abi, statusCode, field_t.ptr),
			
		// statusCode removeCode(Field* field);
		removeCode: lib.declare("removeCode", ctypes.stdcall_abi, statusCode, field_t.ptr),
			
		// statusCode selectField(Field* field);
		selectField: lib.declare("selectField", ctypes.stdcall_abi, statusCode, field_t.ptr),
			
		// statusCode setText(Field* field, const jschar string[], bool isRich);
		setText: lib.declare("setText", ctypes.stdcall_abi, statusCode, field_t.ptr,
			ctypes.jschar.ptr, ctypes.bool),
			
		// statusCode getText(Field* field, jschar** returnValue);
		getText: lib.declare("getText", ctypes.stdcall_abi, statusCode, field_t.ptr,
			ctypes.jschar.ptr.ptr),
			
		// statusCode setCode(Field *field, const jschar code[]);
		setCode: lib.declare("setCode", ctypes.stdcall_abi, statusCode, field_t.ptr,
			ctypes.jschar.ptr),
		
		// statusCode getNoteIndex(Field* field, unsigned long *returnValue);
		getNoteIndex: lib.declare("getNoteIndex", ctypes.stdcall_abi, statusCode,
			field_t.ptr, ctypes.unsigned_long.ptr),
		
		// statusCode freeData(void* ptr);
		freeData: lib.declare("freeData", ctypes.stdcall_abi, statusCode, ctypes.void_t.ptr)
	};
	
	fieldPtr = new ctypes.PointerType(field_t);
}

/**
 * Gets the last error that took place in C code.
 */
function getLastError() {
	var errPtr = f.getError();
	if(errPtr.isNull()) {
		var err = "An unexpected error occurred.";
	} else {
		var err = errPtr.readString().replace("\u2019", "'", "g");
	}
	f.clearError();
	return err;
}

/**
 * Checks the return status of a function to verify that no error occurred.
 * @param {Integer} status The return status code of a C function
 */
function checkStatus(status) {
	if(!status) return;
	
	if(status === 1) {
		throw(getLastError());
	} else {
		throw "ExceptionAlreadyDisplayed";
	}
}

/**
 * Ensures that the document associated with this object has not been garbage collected
 */
function checkIfFreed(documentStatus) {
	if(!documentStatus.active) throw "complete() method already called on document";
}

var Application = function() {
	this.wrappedJSObject = this;
};
Application.prototype = {
	classDescription: "Zotero Word for Windows Integration Application",
	classID:		Components.ID("{c7a7eec5-f073-4db4-b383-f866f4b96b1c}"),
	contractID:		"@zotero.org/Zotero/integration/application?agent=WinWord;1",
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISupports]),
	service:		true,
	getDocument: async function(documentName) {
		init();
		var docPtr = new document_t.ptr();
		// For OneDrive stored documents we receive the in the form:
		// https://[username]-my.sharepoint.com/personal/[username_url_thing]/Documents\Document1.docx
		// But the document url is all stored with forward slashes in running-object table
		if (documentName.indexOf('https://') == 0) {
			documentName = documentName.replace(/\\/g, '/');
		}
		checkStatus(f.getDocument(documentName, docPtr.address()));
		return new Document(docPtr);
	},
	getActiveDocument: async function(path) {
		return this.getDocument(null);
	},
	primaryFieldType: "Field",
	secondaryFieldType: "Bookmark",
	supportedNotes: ["footnote", "endnote"],
	supportsImportExport: true,
	outputFormat: "rtf",
	processorName: "Word"
};

/**
 * See integrationTests.js
 */
var Document = function(cDoc) {
	this._document_t = cDoc;
	this._documentStatus = {"active":true};
};
Document.prototype = {
	displayAlert: function(dialogText, icon, buttons) {
		Zotero.debug("ZoteroWinWordIntegration: displayAlert", 4);
		var buttonPressed = new ctypes.unsigned_short();
		checkStatus(f.displayAlert(this._document_t, dialogText, icon, buttons,
			buttonPressed.address()));
		return buttonPressed.value;
	},
	
	activate: function() {},
	
	canInsertField: function(fieldType) {
		Zotero.debug("ZoteroWinWordIntegration: canInsertField", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new ctypes.bool();
		checkStatus(f.canInsertField(this._document_t, fieldType, returnValue.address()));
		return returnValue.value;
	},
	
	cursorInField: function(fieldType) {
		Zotero.debug("ZoteroWinWordIntegration: cursorInField", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new field_t.ptr();
		checkStatus(f.cursorInField(this._document_t, fieldType, returnValue.address()));
		return (returnValue.isNull() ? null : new Field(returnValue, this._documentStatus));
	},
	
	getDocumentData: function() {
		Zotero.debug("ZoteroWinWordIntegration: getDocumentData", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new ctypes.jschar.ptr();
		checkStatus(f.getDocumentData(this._document_t, returnValue.address()));
		var data = returnValue.readString();
		f.freeData(returnValue);
		return data;
	},
	
	setDocumentData: function(documentData) {
		Zotero.debug(`ZoteroWinWordIntegration: setDocumentData ${documentData}`, 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.setDocumentData(this._document_t, documentData));
	},
	
	insertField: function(fieldType, noteType) {
		Zotero.debug("ZoteroWinWordIntegration: insertField", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new field_t.ptr();
		checkStatus(f.insertField(this._document_t, fieldType, noteType, returnValue.address()));
		return new Field(returnValue, this._documentStatus);
	},
	
	getFields: async function(fieldType) {
		Zotero.debug("ZoteroWinWordIntegration: getFields", 4);
		checkIfFreed(this._documentStatus);
		var fieldListNode = new fieldListNode_t.ptr();
		checkStatus(f.getFields(this._document_t, fieldType, fieldListNode.address()));
		var fnum = new FieldEnumerator(fieldListNode, this._documentStatus);
		var fields = [];
		while (fnum.hasMoreElements()) {
			fields.push(fnum.getNext());
			await Zotero.Promise.delay();
		}
		return fields;
	},
	
	setBibliographyStyle: function(firstLineIndent, bodyIndent, lineSpacing, entrySpacing,
			tabStops) {
		Zotero.debug("ZoteroWinWordIntegration: setBibliographyStyle", 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.setBibliographyStyle(this._document_t, firstLineIndent, bodyIndent, lineSpacing,
			entrySpacing, ctypes.long.array(tabStops.length)(tabStops), tabStops.length));
	},

	importDocument: function(fieldType) {
		Zotero.debug(`ZoteroWinWordIntegration: importDocument`, 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new ctypes.bool();
		checkStatus(f.importDocument(this._document_t, fieldType, returnValue.address()));
		return returnValue.value;
	},

	exportDocument: function(fieldType, importInstructions) {
		Zotero.debug(`ZoteroWinWordIntegration: exportDocument`, 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.exportDocument(this._document_t, fieldType, importInstructions));
	},
	
	convert: function(fields, toFieldType, toNoteTypes, nFields) {
		Zotero.debug("ZoteroWinWordIntegration: convert", 4);
		checkIfFreed(this._documentStatus);
		fields = fields.map(field => field._field_t);
		checkStatus(f.convert(this._document_t, field_t.ptr.array()(fields),
			fields.length, ctypes.jschar.array()(toFieldType),
			ctypes.unsigned_short.array()(toNoteTypes)));
	},
	
	cleanup: function() {
		Zotero.debug("ZoteroWinWordIntegration: cleanup", 4);
		if(this._documentStatus.active) {
			checkStatus(f.cleanup(this._document_t));
		} else {
			Zotero.debug("complete() already called on document; ignoring");
		}
	},
	
	complete: function() {
		Zotero.debug("ZoteroWinWordIntegration: complete", 4);
		if(this._documentStatus.active) {
			checkStatus(f.complete(this._document_t));
			f.freeDocument(this._document_t);
			this._documentStatus.active = false;
		} else {
			Zotero.debug("complete() already called on document; ignoring");
		}
	}
};

/**
 * An enumerator implementation to handle passing off fields
 */
var FieldEnumerator = function(startNode, documentStatus) {
	this._currentNode = startNode;
	this._documentStatus = documentStatus;
};
FieldEnumerator.prototype = {
	hasMoreElements: function() {
		checkIfFreed(this._documentStatus);
		return !this._currentNode.isNull();
	},
	
	getNext: function() {
		checkIfFreed(this._documentStatus);
		var contents = this._currentNode.contents;
		var fieldPtr = contents.addressOfField("field").contents;
		this._currentNode = contents.addressOfField("next").contents;
		return new Field(fieldPtr, this._documentStatus);
	},
	
	"QueryInterface": XPCOMUtils.generateQI([Components.interfaces.nsISupports,
		Components.interfaces.nsISimpleEnumerator])
};

/**
 * See integrationTests.js
 */
var Field = function(field_t, documentStatus) {
	this._field_t = field_t;
	this._isBookmark = !field_t.contents.addressOfField("bookmarkName").contents.isNull();
	this._documentStatus = documentStatus;
};
Field.prototype = {
	delete: function() {
		Zotero.debug("ZoteroWinWordIntegration: delete", 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.deleteField(this._field_t));
	},
	
	removeCode: function() {
		Zotero.debug("ZoteroWinWordIntegration: removeCode", 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.removeCode(this._field_t));
	},
	
	select: function() {
		Zotero.debug("ZoteroWinWordIntegration: select", 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.selectField(this._field_t));
	},
	
	setText: function(text, isRich) {
		Zotero.debug("ZoteroWinWordIntegration: setText", 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.setText(this._field_t, text, isRich));
	},
	
	getText: function() {
		Zotero.debug("ZoteroWinWordIntegration: getText", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new ctypes.jschar.ptr();
		checkStatus(f.getText(this._field_t, returnValue.address()));
		return returnValue.readString();
	},
	
	setCode: function(code) {
		Zotero.debug("ZoteroWinWordIntegration: setCode "+code, 4);
		checkIfFreed(this._documentStatus);
		checkStatus(f.setCode(this._field_t, code));
	},
	
	getCode: function() {
		Zotero.debug("ZoteroWinWordIntegration: getCode", 4);
		checkIfFreed(this._documentStatus);
		var code = this._field_t.contents.addressOfField("code").contents.readString();
		Zotero.debug(code);
		return code;
	},
	
	equals: function(field) {
		Zotero.debug("ZoteroWinWordIntegration: equals", 4);
		checkIfFreed(this._documentStatus);
		// Obviously, a field cannot be equal to a bookmark
		if(this._isBookmark !== field._isBookmark) return false;
		
		if(this._isBookmark) {
			return this._field_t.contents.addressOfField("bookmarkName").contents.readString() ===
				field._field_t.contents.addressOfField("bookmarkName").contents.readString();
		} else {
			var a = this._field_t.contents,
				b = field._field_t.contents;
			// This is stupid.
			return a.addressOfField("noteType").contents.toString()
				=== b.addressOfField("noteType").contents.toString()
				&& a.addressOfField("noteLocation").contents.toString()
				=== b.addressOfField("noteLocation").contents.toString();
		}
	},
	
	getNoteIndex: function() {
		Zotero.debug("ZoteroWinWordIntegration: getNoteIndex", 4);
		checkIfFreed(this._documentStatus);
		var returnValue = new ctypes.unsigned_long();
		checkStatus(f.getNoteIndex(this._field_t, returnValue.address()));
		return parseInt(returnValue.value);
	}
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

const NSGetFactory = XPCOMUtils.generateNSGetFactory([
	Application
]);