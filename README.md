# ZoteroPortable
Zotero in PortableApps.com Format
  
With Mozilla switching to webextensions, Zotero had to adapt. The developers dropped support of the legacy extension for Firefox, and focused their efforts on Zotero Standalone.  
Unfortunately, the portableapp created by [orschiro](https://portableapps.com/node/36565) is out of date, as it's based on version 4, and not fully portable if you update it to 5, as it creates Zotero's profile and store user data in %appdata%\Zotero.  
  
With my version, Zotero 5 is portable.  
This version of Zotero is not officially endorsed by Zotero Team. [Do not expect official support for portable Zotero issues](https://forums.zotero.org/discussion/64050/5-0-portable-zotero).  
  
Notes on release:
-----
For official changelog of Zotero, please see [here](https://www.zotero.org/support/changelog)  
Few modifications compared to official Zotero are included:  
In profile\locate:  
- CrossRef Favicon is present  
- engines.json is modified to handle this favicon  
- engines.json is modified to add [oaDOI as a search engine](https://github.com/Impactstory/oadoi/pull/1)  
  
Updating Zotero:
-----
This Zotero Portable still contains original Zotero Update module: if you check for updates, Zotero will update, but it might cause some minor issues.  
If you're afraid or don't really know what you are doing, I recommend to download the last portable release from here, and install the new version on top of the current one. Your data will be safe, only the program will be updated.  
  
If you want to update on your own, here's what to do:
- Click on Help > Check for updates in Zotero.  
![screenshot1](https://user-images.githubusercontent.com/21216829/34518372-44033688-f07f-11e7-999d-d29413d21207.png)  
- Click on Update Zotero, wait for download.  
- Click on Restart. Zotero will update, and an error message will appear saying your profile cannot be loaded. This is normal, Zotero tries to start, but not by the PortableApps Launcher (which specifies the path to user data), and since the user data is not in %appdata%, it just crashes.  
![screenshot2](https://user-images.githubusercontent.com/21216829/34518371-43e13f06-f07f-11e7-8911-f42aed9c7ded.png)  
On this step, two Zotero folders that you will have to manually delete will be created in %appdata% and %localappdata% (just type this with the percent signs in any explorer window and delete the two folders called Zotero)  
- Launch Zotero Portable again. Update is installed.  
Note that if you do not delete those folders, everything will work as well, only the program cannot be considered as portable, as it leaves two empty folders on the computer it’s launched on.  
  
History:
-----
- 2017-12-20. Version 5.0.33 - Development Test 12: Update to Zotero 5.0.33.  
- 2017-12-18. Version 5.0.32 - Development Test 11: Update to Zotero 5.0.32.  
- 2017-12-15. Version 5.0.31 - Development Test 10: Update to Zotero 5.0.31.  
- 2017-12-04. Version 5.0.30 - Development Test 9: Update to Zotero 5.0.30.  
- 2017-11-28. Version 5.0.29 - Development Test 8: Update to Zotero 5.0.29.  
- 2017-11-22. Version 5.0.28 - Development Test 7: Update to Zotero 5.0.28 ; Update engines.json to change oaDOI Lookup icon to base64-encoded favicon ; Update readme.txt and ZoteroPortable.ini according to [#1]( https://github.com/pedrom34/ZoteroPortable/issues/1)  
- 2017-11-18. Version 5.0.27 - Development Test 6: Update to Zotero 5.0.27.  
- 2017-11-15. Version 5.0.25 - Development Test 5: Update to Zotero 5.0.25 ; SupportsUNC switched from "yes" to "warn" (to warn user that Zotero might not work when launched from a UNC path).  
- 2017-10-31. Version 5.0.24 - Development Test 4: Update to Zotero 5.0.24.  
- 2017-10-30. Version 5.0.23 - Development Test 3: %appdata% folder and %localappdata% are NOW handled correctly: the empty folders are deleted upon exit.  
- 2017-10-26. Version 5.0.23 - Development Test 2: %appdata% folder is now handled correctly: no traces are left behind. Traces of template are now deleted in installer.  
- 2017-10-23. Version 5.0.23 - Development Test 1: Initial release
