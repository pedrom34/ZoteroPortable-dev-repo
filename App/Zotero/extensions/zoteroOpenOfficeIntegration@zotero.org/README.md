# Zotero LibreOffice Integration

Zotero LibreOffice Integration comprises extensions for LibreOffice/OpenOffice.org/NeoOffice and Zotero that communicate using local web servers.

## Build Requirements

- [Eclipse](https://www.eclipse.org/downloads/?)
- [LibreOffice 5.3+](http://www.libreoffice.org/download/download/)
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) (currently version 18) (NOTE: it won't work with OpenJDK) 

LibreOffice SDK is not required.

To build:

1.  Run `scripts/symlink_sdk`.
1.  Open Eclipse and import this project into your workspace.
1.  Right-click the project in the Eclipse Package Explorer, click "Properties", select "Java Build Path", then select the "Libraries" tab. Click on "Add JARs" and expand the "Zotero OpenOffice Integration" folder. Make sure there is no "lib" subfolder underneath it. If there is:
	1. Expand "Zotero OpenOffice Integration" -> "lib" -> "libreoffice-sdk" and select all the JARs underneath it.
	1. Click "Ok" and then "Apply and Close".
1.  Double-click Zotero.jardesc. Click "Finish" to build Zotero.jar.
1.  Run `buildoxt.sh` from within the `build` directory to build `install/Zotero_OpenOffice_Integration.oxt`.
1.  Install `Zotero_OpenOffice_Integration.oxt` into LibreOffice, either by choosing "Reinstall Extension" from within the Zotero preferences, by installing it manually from within LibreOffice, or by using `unopkg` from the command line.
	1. If, when you try to install the extension in LibreOffice, you get an error like "Could not create Java implementation loader", it means that LibreOffice is not configured to use Java. Follow [these](https://help.libreoffice.org/Common/Java) instructions to set up a Java VM in LibreOffice. 

## Development Starter's Guide

This extension is fairly straightforward. It consists of a LibreOffice UNO based java extension for LibreOffice.
The [UNO runtime](https://wiki.openoffice.org/wiki/Documentation/DevGuide/OpenOffice.org_Developers_Guide) allows various
programming languages to interface with a running LibreOffice process. The extension code is initialized by LibreOffice
and starts execution in [ZoteroOpenOfficeIntegrationImpl.java](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/build/source/org/zotero/integration/ooo/comp/ZoteroOpenOfficeIntegrationImpl.java#L40-L40).

Communication between Zotero and LibreOffice is mediated in [zoteroOpenOfficeIntegration.js](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/components/zoteroOpenOfficeIntegration.js#L38)
where a TCP socket is initialized and used for both sending and receiving messages. The complimentary socket connection on the 
LibreOffice extension end is found in [CommServer.java](https://github.com/zotero/zotero-libreoffice-integration/blob/2183efa/build/source/org/zotero/integration/ooo/comp/CommServer.java#L14).

The Java extension code can be debugged directly during runtime. 

Follow [these](https://help.libreoffice.org/Common/Start_Parameters#Java_Start_parameter) instructions to enable debugging in LibreOffice. 
After restarting, LibreOffice will freeze the until a debugging client connects. 
Create a remote debugging configuration in Eclipse and run it:

1. In Eclipse, click on "Run" -> "Debug Configurations...".
2. In the left list, select "Remote Java Application".
3. In the button bar, press the first button "New launch configuration".
4. Use the same port you configured LibreOffice with. The default is port 8000.
5. Press "Debug".

LibreOffice will unfreeze. If you add breakpoints in Eclipse they will be triggered freezing the LibreOffice process and allowing you to
inspect the execution environment. This technique can be used to debug on remote or virtual machines too.

