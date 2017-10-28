# ZoteroPortable
Zotero in PortableApps.com Format
  
With Mozilla switching to webextensions, Zotero had to adapt. The developpers dropped support of the legacy extension for Firefox, and focused their efforts on Zotero Standalone.  
Unfortunately, the portableapp created by <a href="https://portableapps.com/node/36565">orschiro</a> is out of date, as it's based on version 4, and not fully portable if you update it to 5, as it creates Zotero's profile and store user data in %APPDATA%\Zotero.  
  
With my version, Zotero 5 is portable.  
This version of Zotero is not officially endorsed by Zotero Team. <a href="https://forums.zotero.org/discussion/64050/5-0-portable-zotero">Do not expect official support for portable Zotero issues.</a>  
  
Notes:
-----
Few modifications compared to official Zotero are included:  
In profile\locate:  
- CrossRef Favicon is present  
- engines.json is modified to handle this favicon  
- engines.json is modified to add <a href="https://github.com/Impactstory/oadoi/pull/1" target="_blank">oaDOI support</a>  
  
History:
-----
2017-10-23. Version 5.0.23 - Development Test 1: Initial release  
Zotero 5 Portable DevTest1 [47Mb Installer - 113 Installed]  
  
2017-10-26. Version 5.0.23 - Development Test 2: %appdata% folder is now handled correctly : no traces are left behind. Traces of template are now deleted in installer.  
Zotero 5 Portable DevTest2 [47Mb Installer - 113 Installed]  
