# ZoteroPortable
Zotero in PortableApps.com Format

Read in other langages: [Français 🇫🇷](README.fr.md), [English 🇬🇧](README.md)  
  
Why?
-----
With Mozilla switching to webextensions, Zotero had to adapt: the developers dropped support of the legacy extension for Firefox, and focused their efforts on Zotero Standalone: when there was two programs, Zotero is now unified.  
Unfortunately, the portableapp created by [orschiro](https://portableapps.com/node/36565) is out of date, as it's based on version 4, and not fully portable if you update it to 5, as it creates Zotero's profile and store user data in %appdata%\Zotero.  
  
With my version, Zotero 5 is portable: you can install it even if you don't have admin rights, you can launch it from a usb key, there's nothing writen in Windows registry, and no traces (folders, files...) are left behind.  
This version of Zotero is not officially endorsed by Zotero Team. [Do not expect official support for portable Zotero issues](https://forums.zotero.org/discussion/64050/5-0-portable-zotero).  
  
How to use:
-----
- Download last [release here](https://github.com/pedrom34/ZoteroPortable/releases)
- Unpack Zotero by launching installer and selecting target folder (it could be an USB Key for example)
- Install [Zotero Connector](https://www.zotero.org/download/) on your browser (I personnaly use [FirefoxPortable](https://portableapps.com/apps/internet/firefox_portable/localization))
- You're all set.
  
Notes on release:
-----
For official changelog of Zotero, please see [here](https://www.zotero.org/support/changelog).  
  
All my releases are considered as 'Pre-release' and 'development tests', because Zotero Portable is not - yet - officially supported by PortableApps.com. I hope it will be someday. In the mean time, Zotero Portable is still fully operational, I use it everyday.  
  
Updating:
-----
I recommend to download the last portable release, and install the new version on top of the current one. Your data will be safe, only the program will be updated.  
  
This Zotero Portable still contains original Zotero Update module: if you check for updates, Zotero will update, but it might cause some minor issues. If you still want to update on your own, here's what to do:  
- Click on Help > Check for updates in Zotero.  
>![screenshot1](https://user-images.githubusercontent.com/21216829/34518372-44033688-f07f-11e7-999d-d29413d21207.png)  
  
- Click on Update Zotero, wait for download.  
>![screenshot2](https://i.imgur.com/bih4XXl.png)
  
- Click on Restart.  
>![screenshot3](https://i.imgur.com/DBuC3vf.png)
  
Zotero will update, and an error message will appear saying your profile cannot be loaded. This is normal, Zotero tries to start, but not by the PortableApps Launcher (which specifies the path to user data), and since the user data is not in %appdata%, it just crashes.  
>![screenshot4](https://user-images.githubusercontent.com/21216829/34518371-43e13f06-f07f-11e7-8911-f42aed9c7ded.png)
  
On this step, two Zotero folders that you will have to manually delete will be created in %appdata% and %localappdata% (just type this with the percent signs in any explorer window and delete the two folders called Zotero)  
  
- Launch Zotero Portable again. Update is installed.  
Note that if you do not delete those folders, everything will work as well, only the program cannot be considered as portable, as it leaves two empty folders on the computer it’s launched on.  
Note also that updating Zotero this way will prevent you to get the modifications I made to the portable app (modifications of ini files related to the portablization for instance).
  
History:
----
- 2018-06-21. Version 5.0.52 - Development Test 30: Update to Zotero 5.0.52. Updated ZoteroPortable.ini.  
  
- 2018-06-17. Version 5.0.51 - Development Test 29: Update to Zotero 5.0.51.  
  
- 2018-06-15. Version 5.0.50 - Development Test 28: Update to Zotero 5.0.50.  
  
- 2018-06-10. Version 5.0.48 - Development Test 27: Update to Zotero 5.0.48.  
  
- 2018-05-03. Version 5.0.47 - Development Test 26: Update to Zotero 5.0.47.  
  
- 2018-05-01. Version 5.0.46 - Development Test 25: Update to Zotero 5.0.46.  
  
- 2018-04-17. Version 5.0.45 - Development Test 24: Update to Zotero 5.0.45.  
  
- 2018-04-06. Version 5.0.44 - Development Test 23: Update to Zotero 5.0.44.  
  
- 2018-04-03. Version 5.0.43 - Development Test 22: Update to Zotero 5.0.43.  
  
- 2018-04-01. Version 5.0.42 - Development Test 21: Update to Zotero 5.0.42.  
  
- 2018-03-28. Version 5.0.41 - Development Test 20: Update to Zotero 5.0.41. Zotero team went way too fast for me!  
  
- 2018-03-22. Version 5.0.38 - Development Test 19: Update to Zotero 5.0.38.  
  
- 2018-03-12. Version 5.0.37 - Development Test 18: Update to Zotero 5.0.37.  
  
- 2018-03-10. Version 5.0.36 - Development Test 17: Update to Zotero 5.0.36.  
  
- 2018-02-12. Version 5.0.35.1 - Development Test 16: Update to Zotero 5.0.35.1.  
  
- 2018-02-12. Version 5.0.35 - Development Test 15: Update to Zotero 5.0.35.  
  
- 2018-02-05. Version 5.0.34.5 - Development Test 14: Update to Zotero 5.0.34.5. - Removed oaDOI since they deprecated the service.  
  
- 2018-01-12. Version 5.0.34 - Development Test 13: Update to Zotero 5.0.34.  
  
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
