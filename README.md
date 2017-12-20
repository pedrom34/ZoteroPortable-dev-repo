# ZoteroPortable
Zotero in PortableApps.com Format
  
With Mozilla switching to webextensions, Zotero had to adapt. The developpers dropped support of the legacy extension for Firefox, and focused their efforts on Zotero Standalone.  
Unfortunately, the portableapp created by <a href="https://portableapps.com/node/36565">orschiro</a> is out of date, as it's based on version 4, and not fully portable if you update it to 5, as it creates Zotero's profile and store user data in %APPDATA%\Zotero.  
  
With my version, Zotero 5 is portable.  
This version of Zotero is not officially endorsed by Zotero Team. <a href="https://forums.zotero.org/discussion/64050/5-0-portable-zotero">Do not expect official support for portable Zotero issues.</a>  
  
Notes:
-----
For official changelog of Zotero, please see: https://www.zotero.org/support/changelog  
Few modifications compared to official Zotero are included:  
In profile\locate:  
- CrossRef Favicon is present  
- engines.json is modified to handle this favicon  
- engines.json is modified to add <a href="https://github.com/Impactstory/oadoi/pull/1" target="_blank">oaDOI as a search engine</a>  
  
History:
-----
- 2017-12-20. Version 5.0.33 - Development Test 12: Update to Zotero 5.0.33.  
  
- 2017-12-18. Version 5.0.32 - Development Test 11: Update to Zotero 5.0.32.  
  
- 2017-12-15. Version 5.0.31 - Development Test 10: Update to Zotero 5.0.31.  
  
- 2017-12-04. Version 5.0.30 - Development Test 9: Update to Zotero 5.0.30.  
  
- 2017-11-28. Version 5.0.29 - Development Test 8: Update to Zotero 5.0.29.  
  
- 2017-11-22. Version 5.0.28 - Development Test 7: Update to Zotero 5.0.28 ; Update engines.json to change oaDOI Lookup icon to base64-encoded favicon ; Update readme.txt and ZoteroPortable.ini according to <a href=https://github.com/pedrom34/ZoteroPortable/issues/1 target="_blank">#1</a>  
  
- 2017-11-18. Version 5.0.27 - Development Test 6: Update to Zotero 5.0.27.  
  
- 2017-11-15. Version 5.0.25 - Development Test 5: Update to Zotero 5.0.25 ; SupportsUNC switched from "yes" to "warn" (to warn user that Zotero might not work when launched from a UNC path).  
  
- 2017-10-31. Version 5.0.24 - Development Test 4: Update to Zotero 5.0.24.  
  
- 2017-10-30. Version 5.0.23 - Development Test 3: %appdata% folder and %localappdata% are NOW handled correctly: the empty folders are deleted upon exit.  
  
- 2017-10-26. Version 5.0.23 - Development Test 2: %appdata% folder is now handled correctly : no traces are left behind. Traces of template are now deleted in installer.  
  
- 2017-10-23. Version 5.0.23 - Development Test 1: Initial release
