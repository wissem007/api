# Utilisez une image Node.js comme base
FROM node:14-alpine

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Exposez le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour exécuter l'application
CMD [ "npm", "start" ]
