app.get('/informations/:licence_num', async (req, res) => {
  const { licence_num } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
          ct_team_intervenant_id, 
          ct_intervenant_id,
          name,
          last_name,
          cin_number,
          passport_num,
          date_of_birth,
          place_of_birth,
          licence_num,
          ct_season_id
      FROM (
          SELECT 
              t.ct_team_intervenant_id, 
              i.ct_intervenant_id,
              i.name,
              i.last_name,
              i.cin_number,
              i.passport_num,
              i.date_of_birth,
              i.place_of_birth,
              i.licence_num,
              t.ct_season_id,
              ROW_NUMBER() OVER (PARTITION BY i.ct_intervenant_id ORDER BY t.ct_season_id DESC) AS row_num
          FROM 
              sss_competition_db.ct_intervenants i
          JOIN 
              sss_competition_db.ct_team_intervenants t
          ON 
              i.ct_intervenant_id = t.ct_intervenant_id
          WHERE 
              i.licence_num = $1
      ) AS subquery
      WHERE 
          row_num = 1`, 
      [licence_num]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});
