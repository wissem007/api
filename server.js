// server.js
const express = require('express');
const { Pool } = require('pg');

// Création de l'application Express
const app = express();
const port = 3000;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.120',
  database: 'ftf_2022',
  password: 'root',
  port: 5432,
});

// Route pour récupérer des informations à partir de la base de données
app.get('/informations/:licence_num', async (req, res) => {
  const { licence_num } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        ct_intervenant_id,
        name,
        last_name,
        cin_number,
        passport_num,
        date_of_birth,
        place_of_birth,
        licence_num
      FROM 
        sss_competition_db.ct_intervenants 
      WHERE 
        licence_num = $1`, 
      [licence_num]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur le port ${port}`);
});