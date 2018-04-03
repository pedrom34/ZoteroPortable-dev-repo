# ZoteroPortable
Zotero au format PortableApps.com

Lire dans d'autres langues : [English 🇬🇧](README.md), [Français 🇫🇷](README.fr.md)  
  
Avec l'abandon des extensions classiques de Firefox, Zotero a dû s'adapter : les développeurs ont arrêté le support de l'extension, et se sont concentrés sur Zotero Standalone : là où il y avait deux programmes, Zotero propose désormais une expérience unifiée.  
Malheureusement, il n'existait pas de version portable de Zotero. La version créée par [orschiro] (https://portableapps.com/node/36565) n'est plus mise à jour, et n'est plus portable si on force la mise à jour vers la version 5, puisque le profil et les données utilisateur sont stockée dans %appdata%\Zotero  
  
Avec ma version, Zotero 5 est pleinement portable  
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
  
Mise à jour :
-----
Pour mettre à jour Zotero, je vous recommande de télécharger la dernière version proposée ici et de la décompresser sur la version actuellement installée. Vos données ne seront pas touchées, seul le programme sera mis à jour.  
  
Cette version de Zotero Portable contient toujours le module de mise à jour original : si vous cherchez des mises à jour, Zotero se mettra à jour, mais cela pourra poser quelques problèmes. Si vous souhaitez mettre à jour sans passer par ma version, voici ce qu'il faudra faire :  
- Cliquer sur Aide > Vérifier les mises à jour...  
![screenshot1](https://i.imgur.com/kjEaErP.png)  
  
- Cliquer sur Update Zotero, patienter pendant le téléchargement.  
![screenshot2](https://i.imgur.com/bih4XXl.png)
  
- Cliquer sur Restart.  
![screenshot3](https://i.imgur.com/DBuC3vf.png)  
Zotero se mettra à jour, et un message d'erreur va apparaitre indiquant que le profil n'a pas pu être chargé. Cela est normal, Zotero essaye de démarrer, mais sans utiliser le Launcher de PortableApps.com (qui spécifie le chemin du dossier contenant les données utilisateur), et puisque le dossier des données n'est pas dans %appdata%, Zotero plante.  
![screenshot4](https://user-images.githubusercontent.com/21216829/34518371-43e13f06-f07f-11e7-8911-f42aed9c7ded.png)  
À cette étape, deux dossiers Zotero qu'il faudra supprimer sont créés dans %appdata% and %localappdata% (tapez simplement ces noms avec les signes pourcentage dans n'importe quelle fenêtre de l'explorateur Windows).  
  
- Lancez Zotero Portable à nouveau. La mise à jour est appliquée.  
Notez que si vous ne supprimez pas ces dossiers, tout fonctionnera normalement, simplement le programme ne sera plus considéré comme réellement portable, puisqu'il laisse deux dossiers vides sur l'ordinateur.  
Notez également que mettre à jour le programme de cette façon vous prive des modifications que je peux apporter (modifications des fichiers de configuration [.ini] de la portabilisation par exemple).
  
Historique :
-----
- 2018-04-03. Version 5.0.43 - Development Test 22: Mise à jour vers Zotero 5.0.43.  
  
- 2018-04-01. Version 5.0.42 - Development Test 21: Mise à jour vers Zotero 5.0.42.  
  
- 2018-03-28. Version 5.0.41 - Development Test 20: Mise à jour vers Zotero 5.0.41. L'équipe Zotero est allé plus vite que moi !  
  
- 2018-03-22. Version 5.0.38 - Development Test 19: Mise à jour vers Zotero 5.0.38.  
  
- 2018-03-12. Version 5.0.37 - Development Test 18: Mise à jour vers Zotero 5.0.37.  
  
- 2018-03-10. Version 5.0.36 - Development Test 17: Mise à jour vers Zotero 5.0.36.  
  
- 2018-02-12. Version 5.0.35.1 - Development Test 16: Mise à jour vers Zotero 5.0.35.1.  
  
- 2018-02-12. Version 5.0.35 - Development Test 15: Mise à jour vers Zotero 5.0.35.  
  
- 2018-02-05. Version 5.0.34.5 - Development Test 14: Mise à jour vers Zotero 5.0.34.5. - suppression de oaDOI puisqu'ils ont supprimé le service.  
  
- 2018-01-12. Version 5.0.34 - Development Test 13: Mise à jour vers Zotero 5.0.34.  
  
- 2017-12-20. Version 5.0.33 - Development Test 12: Mise à jour vers Zotero 5.0.33.  
  
- 2017-12-18. Version 5.0.32 - Development Test 11: Mise à jour vers Zotero 5.0.32.  
  
- 2017-12-15. Version 5.0.31 - Development Test 10: Mise à jour vers Zotero 5.0.31.  
  
- 2017-12-04. Version 5.0.30 - Development Test 9: Mise à jour vers Zotero 5.0.30.  
  
- 2017-11-28. Version 5.0.29 - Development Test 8: Mise à jour vers Zotero 5.0.29.  
  
- 2017-11-22. Version 5.0.28 - Development Test 7: Mise à jour vers Zotero 5.0.28 ; Mise à jour de engines.json pour passer le favicon de oaDOI en base64 ; Mise à jour de readme.txt et ZoteroPortable.ini conformément à [#1]( https://github.com/pedrom34/ZoteroPortable/issues/1)  
  
- 2017-11-18. Version 5.0.27 - Development Test 6: Mise à jour vers Zotero 5.0.27.  
  
- 2017-11-15. Version 5.0.25 - Development Test 5: Mise à jour vers 5.0.25 ; SupportsUNC passé de "yes" à "warn" (pour avertir l'utilisateur que Zotero ne fonctionnera pas si lancé depuis un chemin réseau).  
  
- 2017-10-31. Version 5.0.24 - Development Test 4: Mise à jour vers Zotero 5.0.24.  
  
- 2017-10-30. Version 5.0.23 - Development Test 3: %appdata% et %localappdata% sont MAINTENANT pris en charge correctement : les dossiers vides sont supprimés à la fermeture.  
  
- 2017-10-26. Version 5.0.23 - Development Test 2: le dossier %appdata% est maintenant géré correctement : il n'y a plus de traces sur la machine après l'utilisation. Les traces du template sont désormais supprimées de l'installeur.  
  
- 2017-10-23. Version 5.0.23 - Development Test 1: première version
