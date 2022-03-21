# ZoteroPortable
Zotero au format PortableApps.com

Lire dans d'autres langues : [English 🇬🇧](README.md), [Français 🇫🇷](README.fr.md)  
  
Pourquoi ?
-----
Avec l'abandon des extensions classiques de Firefox, Zotero a dû s'adapter : les développeurs ont arrêté le support de l'extension, et se sont concentrés sur Zotero Standalone : là où il y avait deux programmes, Zotero propose désormais une expérience unifiée (à partir de la version 5).  
Malheureusement, il n'existait pas de version portable de Zotero. La version créée par [orschiro](https://portableapps.com/node/36565) n'est plus mise à jour, et n'est plus portable si on force la mise à jour vers la version 5, puisque le profil et les données utilisateur sont stockés dans %appdata%\Zotero  
  
Avec ma version, Zotero est pleinement portable : il est possible de l'installer sans être administrateur, de l'utiliser depuis une clé USB ou autre, il n'y a pas d'inscription dans le registre et aucune trace n'est laissée sur l'ordinateur.  
Attention, cette version n'est pas officiellement supportée par l’équipe de Zotero. [N'espérez pas un support officiel](https://forums.zotero.org/discussion/64050/5-0-portable-zotero).  
  
A noter, j'ai également adapté une version de [Juris-M](https://juris-m.github.io/) Portable, disponible [ici](https://github.com/pedrom34/JurisMPortable) !
  
  
Mise en place :
-----
- Téléchargez la [dernière version ici](https://github.com/pedrom34/ZoteroPortable/releases)
- Décompressez Zotero en lançant l'installeur, et sélectionnez un dossier cible (une clé USB par exemple)
- Installez [Zotero Connector](https://www.zotero.org/download/) sur votre navigateur (Personnellement, j'utilise [FirefoxPortable](https://portableapps.com/apps/internet/firefox_portable/localization))
- C'est bon !
  
Notes sur le programme :
-----
Pour l'historique de version officiel, c'est [ici](https://www.zotero.org/support/changelog).  
  
Zotero Portable n'est pas - encore - supporté officiellement par PortableApps.com. J'espère qu'il le sera un jour. Dans l'attente, Zotero Portable est parfaitement opérationnel, je l'utilise tous les jours.
  
Mise à jour :
-----
Pour mettre à jour Zotero, je vous recommande de télécharger la dernière version proposée ici et de la décompresser sur la version actuellement installée. Vos données ne seront pas touchées, seul le programme sera mis à jour.  
  
Cette version de Zotero Portable contient toujours le module de mise à jour original : si vous cherchez des mises à jour, Zotero se mettra à jour.
- Cliquez sur Aide > Vérifier les mises à jour...  
>![screenshot1](https://i.imgur.com/kjEaErP.png)  
  
- Cliquez sur Update Zotero, patientez pendant le téléchargement.  
>![screenshot2](https://i.imgur.com/bih4XXl.png)
  
- Cliquez sur Restart.  
>![screenshot3](https://i.imgur.com/DBuC3vf.png)  
  
La mise à jour est appliquée.  
  
Notez que mettre à jour le programme de cette façon vous prive des modifications que je peux apporter (modifications des fichiers de configuration [.ini] de la portabilisation par exemple).  
  
Filtre SmartScreen :
-----
Windows 10 peut poser problème avec l'installation ou le lancement de Zotero Portable. Si cela vous arrive, il est souvent possible d'indiquer à Windows que l'on souhaite tout de même exécuter le programme. Pour cela, il est d'abord nécessaire de me faire confiance. Puis, cliquez sur Informations complémentaires :  
>![screenshot4](https://i.imgur.com/CY8S5Hb.png)  
  
Et ensuite sur Exécuter quand même :  
>![screenshot5](https://i.imgur.com/7kOC96A.png)  
  
Cependant, certaines organisations bloquent cette possibilité de contournement (voir [#20](https://github.com/pedrom34/ZoteroPortable/issues/20) pour plus d'infos).  
  
Si vous souhaitez tout de même utiliser ZoteroPortable, une solution est d'utiliser de cocher la case "Débloquer" dans les propriétés du fichier exécutable, voir [la réponse de AndhikaWB](https://github.com/pedrom34/ZoteroPortable/issues/20#issuecomment-854317929) pour les détails.  
  
Une autre est d'utiliser la [plateforme officielle de PortableApps.org](https://portableapps.com/download). Pour ce faire, téléchargez la plateforme, installez-la (cela ne devrait pas poser de problème car la plateforme possède une signature validée par Microsoft). Une fois installez, lancez la plateforme et cliquez sur Applications, puis Installez une application (paf.exe), et sélectionnez le fichier ZoteroPortable_XX_Development_Test_XX.paf.exe téléchargé sur ce repo.  

>![screenshot6](https://i.imgur.com/neAFjBi.png)  
  
ZoteroPortable apparaîtra dans le menu PortableApps, et vous pouvez désormais le lancer par ce raccourci.  
>![screenshot7](https://i.imgur.com/uWY70Dg.png)  
  
Historique des versions :
----
[Voir ici](changelog.fr.md).
