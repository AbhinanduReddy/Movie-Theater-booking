const { Pool } = require('pg');
const fs = require('fs');

// Replace these with your database connection details
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // default Postgres port
    database: process.env.DB_NAME
  });

// Function to insert an image into the database
async function insertImage(title, description, imageDataPath) {
  const imageBuffer = fs.readFileSync(imageDataPath);

  const query = {
    text: 'INSERT INTO images (title, description, image_data) VALUES ($1, $2, $3) RETURNING id',
    values: [title, description, imageBuffer],
  };

  const result = await pool.query(query);
  console.log(`Image inserted with ID: ${result.rows[0].id}`);
}

// Function to retrieve an image from the database
async function retrieveImage(imageId, outputPath) {
  const query = {
    text: 'SELECT image_data FROM images WHERE id = $1',
    values: [imageId],
  };

  const result = await pool.query(query);

  if (result.rows.length === 0) {
    console.error('Image not found');
    return;
  }

  fs.writeFileSync(outputPath, result.rows[0].image_data);
  console.log(`Image retrieved and saved to ${outputPath}`);
}
