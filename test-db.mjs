import mongoose from 'mongoose';

const uri = 'mongodb+srv://slh912:TOTO@efrei.4ikfb.mongodb.net/api'; // Mets ici l’URI EXACTE de ton `config.mjs`

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion MongoDB OK'))
  .catch((err) => console.error('❌ Connexion MongoDB FAIL\n', err));
