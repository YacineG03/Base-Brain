# FROM node:18
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# EXPOSE 3001
# CMD ["npm", "start"]

# Utiliser une image Node.js officielle comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du backend
COPY . .

# Exposer le port utilisé par ton backend (3001 d'après tes logs)
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["npm", "start"]