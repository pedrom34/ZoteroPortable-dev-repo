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
  
(Note: if this message doesn't show, Zotero is not updated. Insist and do the procedure again, it will eventually works.)  
On this step, two Zotero folders that you will have to manually delete will be created in %appdata% and %localappdata% (just type this with the percent signs in any explorer window and delete the two folders called Zotero)  
  
- Launch Zotero Portable again. Update is installed.  
  
Note that if you do not delete those folders, everything will work as well, only the program cannot be considered as portable, as it leaves two empty folders on the computer it’s launched on.  
Note also that updating Zotero this way will prevent you to get the modifications I made to the portable app (modifications of ini files related to the portablization for instance).  
  
Versions history:
----
[See here](changelog.md).