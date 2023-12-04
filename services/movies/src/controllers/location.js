const db = require('../config/db')
async function get(req, res, next) {
    try {
        const result = await db.query('SELECT * FROM locations');
        res.json(result.rows);
    } catch (err) {
        console.error(`Errors`, err.message);
        next(err);
    }
  }



  module.exports = {
    get
  };