# Utilisez une image Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /node-app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Exposer le port 3000 pour pouvoir accéder à l'application
EXPOSE 3000

# Spécifier le fichier d'entrée pour l'application (index.js ici)
CMD ["node", "index.js"]
