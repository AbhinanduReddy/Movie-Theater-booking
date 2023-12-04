const db = require('../config/db')
async function get(req, res, next) {
  try {
    const result = await db.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }
}

async function getWithId(req, res, next) {
  try {
    console.log('')
    const movie_id = req.params.movie_id;

    const query = {
      text: 'SELECT * FROM movies WHERE movie_id = $1',
      values: [movie_id],
    };
    console.log(query);
    const result = await db.query(query);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }
}

async function image(req, res, next) {
  try {
    const imageId = req.params.id;

    const query = {
      text: 'SELECT * FROM movies WHERE id = $1',
      values: [imageId],
    };
    console.log(query);
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function get_with_location(req, res, next) {
  try {
    const locationId = req.params.location_id;

    const query = {
      text: 'SELECT DISTINCT ON(m.movie_id) m.* FROM theater AS t JOIN movies AS m ON m.movie_id=ANY(t.movies) WHERE t.location_id= $1',
      values: [locationId],
    };
    console.log(query)
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function get_with_theater(req, res, next) {
  try {
    const tId = req.params.theater_id;

    const query = {
      text: 'SELECT DISTINCT ON(m.movie_id) m.* FROM theater AS t JOIN movies AS m ON m.movie_id=ANY(t.movies) WHERE t.theater_id= $1',
      values: [tId],
    };
    const result = await db.query(query);
    if(result.rows){
      res.json(result.rows);
    }
    else{
      res.json('Theater not present');
    }

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function upcoming(req, res, next) {
  try {

    const query = {
      text: 'SELECT * FROM movies WHERE booking_started = false'
    };
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function newMovie(req, res, next) {
  try {
    const { movie_name, release_date, booking_started, image_url, description} = req.body;
    const query = {
      text: 'INSERT INTO movies (movie_name,release_date,booking_started, image_url, description) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
      values: [movie_name, release_date, booking_started, image_url,description]
    };
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}


async function del(req, res, next) {
  try {
    const { movie_id} = req.query;
    const query = {
      text: 'DELETE FROM movies WHERE movie_id=$1 RETURNING * ',
      values: [movie_id]
    };
    const result = await db.query(query);
    console.log(result);
    if(result.rowCount){
      res.json("MOVIE CANCELED");

    }
    else{
      res.json("Unable to delete MOVIE may be you don't have access or movie not present");
    }

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}

async function updateMovie(req, res, next) {
  try {
    const { movie_name,image_url,release_date,description,booking_started, movie_id} = req.body;
    const query = {
      text: 'UPDATE movies SET movie_name=$1,image_url=$2,release_date=$3,description=$4,booking_started=$5 WHERE movie_id=$6',
      values: [movie_name,image_url,release_date,description,booking_started,movie_id]
    };
    const result = await db.query(query);
    res.json("movie updated");

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}
module.exports = {
  get,
  image,
  get_with_location,
  get_with_theater,
  upcoming,
  newMovie,
  del,
  getWithId,
  updateMovie
};