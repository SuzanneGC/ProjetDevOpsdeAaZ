# Projet : Générateur de notes partagées (type Pastebin simplifié)

## Objectif
Créer un service où l'utilisateur peut écrire un texte, obtenir un lien unique, et partager ce lien pour que d'autres puissent lire la note.

## Technologies utilisées

J'utilise ici Node.js, Express.js, EJS, Crypto, Docker, GitHub Actions, Method-Override, FS et NPM.

## Fonctionnalités

L'utilisateur peut écrire une note, la consulter et la modifier. Il peut choisir une temps d'expiration, mais le temps par défaut est 24 h.


## Installation
Prérequis : Node.js, Docker

Cloner le projet : 
```
git clone https://github.com/SuzanneGC/ProjetDevOpsdeAaZ.git
cd ProjetDevOpsdeAaZ
```
Construire l'image Docker :
```
docker build -t nom-de-l-image .
```

Lancer l'application avec Docker :
```
docker run -p 3000:3000 nom-de-l-image
```

Accéder à l'application une fois lancer :

Ouvrir dans un navigateur l'adresse `http://localhost:3000`


## Containers Docker utilisés

J'utilise une image Docker basée sur Node.js, 18-alpine. Le répertoire de travail défini est /node-app. Les dépendances sont décrites dans package.json. L'application écoute le port 3000.