# Étape 1 : Build de l'application
FROM node:18 AS build

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du frontend
COPY . .

# Construire l'application React pour la production
RUN npm run build

# Étape 2 : Servir l'application avec un serveur léger
FROM nginx:alpine

# Copier les fichiers buildés dans le dossier Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour Nginx
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]