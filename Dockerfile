FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Définissez l'URL de votre API en tant que variable d'environnement
ENV API_URL=http://178.33.44.117

EXPOSE 3000

CMD [ "npm", "start" ]