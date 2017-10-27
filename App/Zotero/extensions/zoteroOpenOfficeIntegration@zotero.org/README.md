# Zotero LibreOffice Integration

Zotero LibreOffice Integration comprises extensions for LibreOffice/OpenOffice.org/NeoOffice and Zotero that communicate using local web servers.

## Build Requirements

- [Eclipse](https://www.eclipse.org/downloads/?)
- [LibreOffice 5.3+](http://www.libreoffice.org/download/download/)
- [Oracle JDK](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html) (currently 1.8.0u121)

LibreOffice SDK is not required.

To build:

1.  Run `scripts/symlink_sdk`
1.  Open Eclipse and import this project into your workspace.
1.  Right-click the project in the Eclipse Package Explorer and select "Java Build Path." Click the libraries tab and ensure that all referenced files exist, or else correct the paths.
1.  Double-click Zotero.jardesc. Click "Finish" to build Zotero.jar.
1.  Run `buildoxt.sh` from within the `build` directory to build `install/Zotero_OpenOffice_Integration.oxt`
1.  Install `Zotero_OpenOffice_Integration.oxt` into LibreOffice, either by choosing "Reinstall Extension" from within the Zotero preferences, by installing it manually from within LibreOffice, or by using `unopkg` from the command line.

## Development Starter's Guide

This extension is fairly straightforward. It consists of a LibreOffice UNO based java extension for LibreOffice.
The [UNO runtime](https://wiki.openoffice.org/wiki/Documentation/DevGuide/OpenOffice.org_Developers_Guide) allows various
programming languages to interface with a running LibreOffice process. The extension code is initialized by LibreOffice
and starts execution in [ZoteroOpenOfficeIntegrationImpl.java](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/build/source/org/zotero/integration/ooo/comp/ZoteroOpenOfficeIntegrationImpl.java#L40-L40).

Communication between Zotero and LibreOffice is mediated in [zoteroOpenOfficeIntegration.js](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/components/zoteroOpenOfficeIntegration.js#L38)
where a TCP socket is initialized and used for both sending and receiving messages. The complimentary socket connection on the 
LibreOffice extension end is found in [CommServer.java](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/build/source/org/zotero/integration/ooo/comp/CommServer.java#L14).

The Java extension code can be debugged directly during runtime. Follow [these](https://help.libreoffice.org/Common/Start_Parameters#Java_Start_parameter)
instructions to enable debugging in LibreOffice. Attempt performing a Zotero action in LibreOffice, which will freeze the
process until a debugging client connects. Create a remote debugging configuration in Eclipse and run it. LibreOffice will
unfreeze. If you add breakpoints in Eclipse they will be triggered freezing the LibreOffice process and allowing you to
inspect the execution environment. This technique can be used to debug on remote or virtual machines too.
