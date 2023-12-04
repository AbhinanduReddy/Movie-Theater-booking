const db = require('../config/db')
async function get(req, res, next) {
  try {
    const result = await db.query('SELECT t.*, t.location_id, l.city, ARRAY_AGG(s.screen_name) AS screen_name FROM theater t JOIN locations l ON t.location_id = l.location_id LEFT JOIN seats s ON t.theater_id = s.theater_id GROUP BY t.theater_id, t.location_id, l.city;');
    res.json(result.rows);
  } catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }
}

async function get_with_location(req, res, next) {
  try {
    const locationId = req.params.location_id;

    const query = {
      text: 'SELECT * FROM theater WHERE location_id= $1',
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

async function get_theaters_with_movie(req, res, next) {
  try {
    const movie_id = req.params.movie_id;

    const query = {
      text: 'SELECT * FROM theater WHERE $1=ANY(movies)',
      values: [movie_id],
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

async function get_show_time(req, res, next) {
  try {
    const movie_id = req.query.movie_id;
    const theater_id = req.query.theater_id;

    const query = {
      text: 'SELECT * FROM screen WHERE theater_id=$2 AND movie_id=$1',
      values: [movie_id,theater_id],
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

async function get_seats(req, res, next) {
  try {
    const theater_id = req.query.theater_id;

    const query = {
      text: 'SELECT * FROM seats WHERE theater_id=$1',
      values: [theater_id],
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

async function get_seats_screen(req, res, next) {
  try {
    const screen_id = req.query.screen_id;

    const query = {
      text: 'SELECT * FROM seats WHERE screen_id=$1',
      values: [screen_id],
    };
    console.log(query)
    const result = await db.query(query);
    console.log(result);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function get_booked_seats(req, res, next) {
  try {
    console.log(req);
    const movie_id = req.query.movie_id;
    const theater_id = req.query.theater_id;
    const screen_id = req.query.screen_id;
    const show_time = req.query.show_time;

    const query = {
      text: 'SELECT DISTINCT unnest(seats) AS BOOKED_SEATS FROM ticket WHERE ticket.movie_id=$1 AND ticket.theater_id=$2 AND ticket.screen_id=$3 AND ticket.show_time=$4 ORDER BY BOOKED_SEATS',
      values: [movie_id, theater_id, screen_id, show_time],
    };
    console.log(query)
    const result = await db.query(query);
    console.log(result);
    result.rows =  result.rows.map((seat)=>seat.booked_seats);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }

}

async function newTheater(req, res, next) {
  try {
    const { theater_name,location_id,movies} = req.body;
    const query = {
      text: 'INSERT INTO theater (theater_name,location_id,movies) VALUES ($1,$2,$3) RETURNING *;',
      values: [theater_name,location_id,movies]
    };
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}

async function newScreen(req, res, next) {
  try {
    const { theater_id, movie_id, screen_name, show_times, cost,screen_id} = req.body;
    result=[];
    show_times.forEach(async (res)=>{
      const query = {
        text: 'INSERT INTO screen (theater_id, movie_id, screen_name, show_time, cost,screen_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;',
        values: [theater_id, movie_id, screen_name, res, cost,screen_id]
      };
      let r = await db.query(query);
      result.push(r);
    })
    const query = {
      text: 'UPDATE theater SET movies=array_append(movies, $2) WHERE theater_id= $1 RETURNING *;',
      values: [theater_id, movie_id]
    };
    let r = await db.query(query);
    res.json(result);

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}

async function updateScreen(req, res, next) {
  try {
    const { theater_id,movie_id, show_time,screen_name,cost,screen_id} = req.body;
    const query = {
      text: 'UPDATE screen SET theater_id=$1,movie_id=$2,show_time=$3,screen_name=$4,cost=$5 WHERE screen_id=$6',
      values: [theater_id,movie_id, show_time,screen_name,cost,screen_id]
    };
    const result = await db.query(query);
    res.json("screen updated");

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}

async function updateTheater(req, res, next) {
  try {
    const { theater_name,location_id,movies,theater_id} = req.body;
    const query = {
      text: 'UPDATE theater SET theater_name=$1,location_id=$2,movies=$3 WHERE theater_id=$4',
      values: [theater_name,location_id,movies,theater_id]
    };
    const result = await db.query(query);
    res.json("theater updated");

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}

async function newSeat(req, res, next) {
  try {
    console.log('beweasfsdfsd')
    const {show_times, rows, columns,screen_name,theater_id} = req.body;
    const query = {
      text: 'INSERT INTO seats (show_times, rows, columns, screen_name,theater_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
      values: [show_times, rows, columns,screen_name,theater_id]
    };
    const result = await db.query(query);
    res.json(result.rows);

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}


async function updateSeat(req, res, next) {
  try {
    const { columns,rows, show_times,screen_name,screen_id} = req.body;
    const query = {
      text: 'UPDATE seats SET columns=$1,rows=$2,show_times=$3,screen_name=$4 WHERE screen_id=$5',
      values: [columns,rows, show_times,screen_name,screen_id]
    };
    const result = await db.query(query);
    res.json("screen updated");

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}

async function del(req, res, next) {
  try {
    const { theater_id} = req.query;
    const query = {
      text: 'DELETE FROM theater WHERE theater_id=$1 RETURNING * ',
      values: [theater_id]
    };
    const result = await db.query(query);
    console.log(result);
    if(result.rowCount){
      res.json("THEATER CANCELED");

    }
    else{
      res.json("Unable to delete THEATER may be you don't have access or movie not present");
    }

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}
async function delScreen(req, res, next) {
  try {
    const { screen_id,show_times} = req.body;
    const query = {
      text: 'DELETE FROM screen WHERE screen_id=$1 AND show_time=ANY($2) RETURNING * ',
      values: [screen_id,show_times]
    };
    const result = await db.query(query);
    console.log(result);
    if(result.rowCount){
      res.json("Show times CANCELED");

    }
    else{
      res.json("Unable to delete show times may be you don't have access or movie not present");
    }

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}


async function get_screen(req,res,next) {
  try {
    const { theater_id,screen_id} = req.query;
    const query = {
      text: 'SELECT * FROM screen WHERE theater_id=$1 AND screen_id=$2',
      values: [theater_id, screen_id]
    };
    const result = await db.query(query);
    console.log(result);
    res.json(result.rows);
  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }
}


module.exports = {
  get,
  get_with_location,
  get_theaters_with_movie,
  get_show_time,
  get_booked_seats,
  newTheater,
  newScreen,
  updateScreen,
  updateTheater,
  get_seats,
  newSeat,
  updateSeat,
  del,
  get_screen,
  delScreen,
  get_seats_screen
};