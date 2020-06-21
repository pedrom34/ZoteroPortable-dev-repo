# Zotero Word for Windows Integration

This is a Firefox add-on that consists of a library written in C++ that communicates with Microsoft Word out of process using OLE Automation, a js-ctypes wrapper for said library, and a template that is installed into Microsoft Word to communicate with Zotero.

## C++ Library Build Requirements
- Visual Studio (currently 2017)
- Windows XP C++ libraries (install in VS by right-clicking the project and selecting "Install Missing Features")
- Microsoft Office (previously build with 2010, but newer versions should work)

## To Build the C++ Library
- Open `build/zoteroWinWordIntegration/zoteroWinWordIntegration.sln`
- Change `imports.h `to point to the appropriate files (may be in different places with newer Office)
- Set to Release configuration in the dropdown in the toolbar
- Set to Win32 target in dropdown to the right of Release dropdown
- Build->Build Solution
- Set to x64 target in dropdown
- Build->Build Solution

## Template Build Requirements
- Templates should be built with the oldest version of Word to be supported. Otherwise older versions of Word may fail to function properly. This is currently:
  - Word 2007 (for the ribbonized dotm template)
  - Word 2003 (for the old dot template)

## To Modify/Build the Templates
- Open the template from inside Microsoft Word
- Go to View->Macros->View Macros (Ribbonized Word) or Tools->Macros->View Macros (Word 2003) and click "Edit" for one of the Zotero macros
- Edit/replace code as desired
- Go to Debug->Compile Project to ensure there are no code errors
- Run `build/template/unpack_templates.sh`

## Development Starter's Guide

Start by opening the dotm/dot template in Word. Word templates have support for custom macros 
and adding UI elements to call the macros, which is how the extension is implemented on Word. 
RibbonUI can be edited by extracting the dotm file or using the [Custom UI editor](http://openxmldeveloper.org/blog/b/openxmldeveloper/archive/2009/08/06/7293.aspx). 
To edit the .dot template UI Word for Windows 2003 is needed. 
In VBA macro code you will find that [SendMessage](https://msdn.microsoft.com/en-us/library/windows/desktop/ms644950(v=vs.85).aspx)
protocol is used to issue commands to Zotero process from Word. These commands are received in [zotero-service.js](https://github.com/zotero/zotero/blob/eaf8d3696359dcea0edaa2fd9bc1e4cf5d985014/components/zotero-service.js#L516-L516)
where they are passed to integration.js.

Zotero talks to Word via [js-ctype bindings](https://github.com/zotero/zotero-word-for-windows-integration/blob/4f07be4bfaa3f37897a5af5371ea20353214f23e/components/zoteroWinWordIntegration.js#L52-L52)
to a C++ OLE Automation based [library](https://github.com/zotero/zotero-word-for-windows-integration/blob/8d1807584d02f3b10715dd9895413c04349d45e8/build/zoteroWinWordIntegration/zoteroWinWordIntegration.h).
To generate new interfaces for Word interop communications you should use the Add New Class wizard in
Visual Studio and select 'MFC Class from Typelib'. The interop API docs can be found in the [MSDN](https://docs.microsoft.com/en-us/dotnet/api/microsoft.office.interop.word._document?view=word-pia).
The plugin should technically work with Word versions starting with 2003, but we have stopped supporting everything below Word 2010
due to impossible to fix bugs cropping up as time goes on and Microsoft drops compatibility themselves.
Some API calls are on a deprecation path, so we may be inevitably be forced to move 
away or split the library into multiple DLLs.
