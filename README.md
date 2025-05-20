# 📸 Album Photo API – Node.js + Express + MongoDB

Cette API permet de gérer des albums et les photos associées. Chaque album peut contenir plusieurs photos, et chaque photo est liée à un seul album.

---

## 📦 Technologies utilisées

- Node.js
- Express.js
- MongoDB + Mongoose
- Postman pour les tests API

---

## 🗂️ Structure du projet

/src
├── models/
│ ├── album.mjs # Schéma Album (Mongoose)
│ └── photo.mjs # Schéma Photo (Mongoose)
├── controllers/
│ ├── albums.mjs # Routes CRUD pour les albums
│ └── photos.mjs # Routes CRUD pour les photos
├── config.mjs # Configuration de la base MongoDB
├── server.mjs # Configuration du serveur Express
└── index.mjs # Point d'entrée principal

---

## 🚀 Lancer le projet en local

npm run dev

## Requetes

Disponible dans : TP API MONGO.postman_collection.json