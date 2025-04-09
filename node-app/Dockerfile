# Utilisez une image Node.js comme base
FROM node:18-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json (si vous l'avez)
COPY package*.json ./

# Installez les dépendances Node.js
RUN npm install

# Copiez le reste du code de l'application
COPY index.js .

# Exposez le port sur lequel l'application Node.js écoute
EXPOSE 3000

# Commande à exécuter lorsque le conteneur démarre
CMD ["node", "app.js"]