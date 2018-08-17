# ZoteroPortable
Zotero au format PortableApps.com

Lire dans d'autres langues : [English 🇬🇧](README.md), [Français 🇫🇷](README.fr.md)  
  
Pourquoi ?
-----
Avec l'abandon des extensions classiques de Firefox, Zotero a dû s'adapter : les développeurs ont arrêté le support de l'extension, et se sont concentrés sur Zotero Standalone : là où il y avait deux programmes, Zotero propose désormais une expérience unifiée.  
Malheureusement, il n'existait pas de version portable de Zotero. La version créée par [orschiro] (https://portableapps.com/node/36565) n'est plus mise à jour, et n'est plus portable si on force la mise à jour vers la version 5, puisque le profil et les données utilisateur sont stockée dans %appdata%\Zotero  
  
Avec ma version, Zotero 5 est pleinement portable : il est possible de l'installer sans être administrateur, de l'utiliser depuis une clé usb ou autre, il n'y a pas d'inscription dans le registre et aucune trace n'est laissée sur l'ordinateur.  
Attention, cette version n'est pas officiellement supportée par l’équipe de Zotero. [N'espérez pas un support officiel](https://forums.zotero.org/discussion/64050/5-0-portable-zotero).  
  
Mise en place :
-----
- Téléchargez la [dernière version ici](https://github.com/pedrom34/ZoteroPortable/releases)
- Décompressez Zotero en lançant l'installeur, et sélectionnez un dossier cible (une clé USB par exemple)
- Installez [Zotero Connector](https://www.zotero.org/download/) sur votre navigateur (Personnellement, j'utilise [FirefoxPortable](https://portableapps.com/apps/internet/firefox_portable/localization))
- C'est bon !
  
Notes sur le programme :
-----
Pour l'historique de version officiel, c'est [ici](https://www.zotero.org/support/changelog).  
  
Toutes mes versions sont considérées comme des versions de test car Zotero Portable n'est pas - encore - supporté officiellement par PortableApps.com. J'espère qu'il le sera un jour. Dans l'attente, Zotero Portable est parfaitement opérationnel, je l'utilise tous les jours.
  
Mise à jour :
-----
Pour mettre à jour Zotero, je vous recommande de télécharger la dernière version proposée ici et de la décompresser sur la version actuellement installée. Vos données ne seront pas touchées, seul le programme sera mis à jour.  
  
Cette version de Zotero Portable contient toujours le module de mise à jour original : si vous cherchez des mises à jour, Zotero se mettra à jour, mais cela pourra poser quelques problèmes. Si vous souhaitez mettre à jour sans passer par ma version, voici ce qu'il faudra faire :  
- Cliquer sur Aide > Vérifier les mises à jour...  
>![screenshot1](https://i.imgur.com/kjEaErP.png)  
  
- Cliquer sur Update Zotero, patienter pendant le téléchargement.  
>![screenshot2](https://i.imgur.com/bih4XXl.png)
  
- Cliquer sur Restart.  
>![screenshot3](https://i.imgur.com/DBuC3vf.png)  
  
Zotero se mettra à jour, et un message d'erreur va apparaitre indiquant que le profil n'a pas pu être chargé. Cela est normal, Zotero essaye de démarrer, mais sans utiliser le Launcher de PortableApps.com (qui spécifie le chemin du dossier contenant les données utilisateur), et puisque le dossier des données n'est pas dans %appdata%, Zotero plante.  
>![screenshot4](https://user-images.githubusercontent.com/21216829/34518371-43e13f06-f07f-11e7-8911-f42aed9c7ded.png)  
  
(Note : si ce message ne s'affiche pas, Zotero n'est pas mis à jour. Insistez et recommencez la procédure, cela fonctionnera à la longue.)  
À cette étape, deux dossiers Zotero qu'il faudra supprimer sont créés dans %appdata% and %localappdata% (tapez simplement ces noms avec les signes pourcentage dans n'importe quelle fenêtre de l'explorateur Windows).  
  
- Lancez Zotero Portable à nouveau. La mise à jour est appliquée.  
  
Notez que si vous ne supprimez pas ces dossiers, tout fonctionnera normalement, simplement le programme ne sera plus considéré comme réellement portable, puisqu'il laisse deux dossiers vides sur l'ordinateur.  
Notez également que mettre à jour le programme de cette façon vous prive des modifications que je peux apporter (modifications des fichiers de configuration [.ini] de la portabilisation par exemple).  
  
Historique des versions :
----
[Voir ici](changelog.fr.md).