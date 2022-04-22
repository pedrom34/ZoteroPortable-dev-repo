# ZoteroPortable
Zotero in PortableApps.com Format

Read in other langages: [Français 🇫🇷](README.fr.md), [English 🇬🇧](README.md)  
  
Why?
-----
With Mozilla switching to webextensions, Zotero had to adapt: the developers dropped support of the legacy extension for Firefox, and focused their efforts on Zotero Standalone: when there was two programs, Zotero is now unified (from version 5 onwards).  
Unfortunately, the portableapp created by [orschiro](https://portableapps.com/node/36565) is out of date, as it's based on version 4, and not fully portable if you update it to 5, as it creates Zotero's profile and store user data in %appdata%\Zotero.  
  
With my version, Zotero is portable: you can install it even if you don't have admin rights, you can launch it from a usb key, there's nothing writen in Windows registry, and no traces (folders, files...) are left behind.  
This version of Zotero is not officially endorsed by Zotero Team. [Do not expect official support for portable Zotero issues](https://forums.zotero.org/discussion/64050/5-0-portable-zotero).
  
Note that I also made a [Juris-M](https://juris-m.github.io/) Portable, available [here](https://github.com/pedrom34/JurisMPortable)!
  
How to use:
-----
- Download latest [release here](https://github.com/pedrom34/ZoteroPortable/releases/latest), or [from PortableApps](https://portableapps.com/apps/office/zotero-portable)
- Unpack Zotero by launching installer and selecting target folder (it can be an USB Key or a folder on your desktop...)
- Install [Zotero Connector](https://www.zotero.org/download/) in your browser (I personnaly use [FirefoxPortable](https://portableapps.com/apps/internet/firefox_portable/localization))

Or better: use [PortableApps platform](https://portableapps.com/download) and install Zotero from the app store!
  
Notes on release:
-----
For official changelog of Zotero, please see [here](https://www.zotero.org/support/changelog).  
  
Zotero Portable is now an [official](https://portableapps.com/news/2022-04-12--zotero-portable-6.0.4-released) PortableApps.com™ app !
  
Updating:
-----
To update Zotero, I recommend using the [PortableApps platform](https://portableapps.com/download). The updates are automatic, and your data won't be affected, only the program will be updated.
  
However this Zotero version still contains original Zotero Update module: if you check for updates, Zotero will update:  
- Click on Help > Check for updates in Zotero.  
>![screenshot1](https://user-images.githubusercontent.com/21216829/34518372-44033688-f07f-11e7-999d-d29413d21207.png)  
  
- Click on Update Zotero, wait for download.  
>![screenshot2](https://i.imgur.com/bih4XXl.png)
  
- Click on Restart.  
>![screenshot3](https://i.imgur.com/DBuC3vf.png)
  
Update is installed.  
  
Note that updating Zotero this way will prevent you to get the modifications I made to the portable app (modifications of ini files related to the portablization for instance).  
  
SmartScreen Filter:
-----
Windows 10 may have problems with installing or launching Zotero Portable. If this happens to you, it is often possible to tell Windows that you still want to run the program. To do this, you first need to trust me. Then click on Additional information:  
>![screenshot4](https://i.imgur.com/CY8S5Hb.png)  
  
And then on Run anyway:  
>![screenshot5](https://i.imgur.com/7kOC96A.png)  
  
However, some organizations block this workaround (see [#20](https://github.com/pedrom34/ZoteroPortable/issues/20) for more info).
If you still want to use ZoteroPortable, one solution is to check "unblock" option in the file properties: see [this comment from AndhikaWB](https://github.com/pedrom34/ZoteroPortable/issues/20#issuecomment-854317929).  
  
Another solution is to use the [official PortableApps.org platform](https://portableapps.com/download) and install Zotero from the app store.
  
Versions history:
----
[See here](changelog.md).
