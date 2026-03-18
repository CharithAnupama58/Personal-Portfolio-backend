const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects ORDER BY featured DESC, year DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

module.exports = router;