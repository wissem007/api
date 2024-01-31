const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'ftf_2022',
  password: 'root',
  port: 5432,
});

// Utiliser CORS middleware pour autoriser les requêtes provenant de tous les domaines
app.use(cors());

// Route pour récupérer des informations à partir de la base de données PostgreSQL
app.get('/informations/:licence_num', async (req, res) => {
  const { licence_num } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
    subquery.division,
    subquery.team_initial,
    subquery.team_name,
    subquery.type_interv,
    subquery.num_licence,
    subquery.name,
    subquery.last_name,
    subquery.date_naissance,
    subquery.nationalite,
    subquery.categorie,
    subquery.typelicence,
    subquery.saison,
    subquery.player_num,
    subquery.photo
FROM (
    SELECT 
        ROW_NUMBER() OVER (PARTITION BY interv.licence_num ORDER BY team_interv.ct_season_id DESC) AS row_num,
        div.name AS division,
        team.initials AS team_initial,
        team.name AS team_name,
        interv_type.libelle AS type_interv,
        interv.licence_num AS num_licence,
        interv.name AS name,
        interv.last_name AS last_name,
        interv.date_of_birth AS date_naissance,
        pays.libelle AS nationalite,
        player_categ.label AS categorie,
        tylicence.label AS typelicence,
        team_interv.tshirt_num AS player_num,
        team_interv.ct_season_id AS saison,
        interv_photo.photo_bdata AS photo
    FROM 
        sss_competition_db.ct_team_intervenants as team_interv
    LEFT OUTER JOIN 
        sss_competition_db.ct_intervenants as interv on interv.ct_intervenant_id = team_interv.ct_intervenant_id
    LEFT OUTER JOIN 
        sss_config_general_db.cr_pays as pays on pays.cr_pays_id = interv.cr_pays_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_teams as team on team.ct_team_id = team_interv.ct_team_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_player_categorys as player_categ on player_categ.ct_player_category_id = team_interv.ct_player_category_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_intervenant_types as interv_type on interv_type.ct_intervenant_type_id = team_interv.ct_intervenant_type_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_team_divisions as team_div on team_div.ct_season_id = team_interv.ct_season_id AND team_div.ct_team_id = team_interv.ct_team_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_divisions as div on div.ct_division_id = team_div.ct_division_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_type_licences as tylicence on tylicence.ct_type_licence_id = team_interv.ct_type_licence_id
    LEFT OUTER JOIN 
        sss_competition_db.ct_team_intervenant_photos as interv_photo  on interv_photo.ct_team_intervenant_photo_id = team_interv.ct_team_intervenant_photo_id
    WHERE 
        interv.licence_num = $1
) AS subquery
WHERE 
    subquery.row_num = 1`,
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
