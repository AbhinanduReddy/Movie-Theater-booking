const db = require('../config/db')
const {updateRewards} = require('../controllers/user');
async function book(req, res, next) {
  try {
    const { movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id} = req.body;
    const user_id = req.userdata?req.userdata.user_id:null;
    const query = {
      text: 'INSERT INTO ticket (user_id, movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;',
      values: [user_id, movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id]
    };
    const result = await db.query(query);
    if(user_id && total_cost-rewards_used>0){
      await updateRewards(user_id,total_cost-2*rewards_used);
    }
    if(user_id && total_cost==rewards_used){
      await updateRewards(user_id,-rewards_used);
    }
    res.json(result.rows);
    next();

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}

async function updateBooking(req, res, next) {
  try {

    const user_id = req.userdata?req.userdata.user_id:null;
    const { movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id,ticket_id} = req.body;
    const query = {
      text: 'UPDATE ticket (user_id, movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) WHERE ticket_id=$9 RETURNING *;',
      values: [user_id, movie_id, screen_id, show_time, seats, total_cost, rewards_used, theater_id,ticket_id]
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
    const user_id = req.userdata.user_id;
    const { ticket_id} = req.query;
    const query = {
      text: 'DELETE FROM ticket WHERE ticket_id=$1 AND user_id=$2 RETURNING * ',
      values: [ticket_id,user_id]
    };
    const result = await db.query(query);
    console.log(result);
    if(result.rowCount){
      if(user_id){
        await updateRewards(user_id,result.rows[0].rewards_used);
      }
      res.json("TICKET CANCELED");

    }
    else{
      res.json("Unable to delete ticket may be you don't have access or ticket not present");
    }

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}

async function discountUpdate(req,res,next){
  let {percentage,discount} =  req.body;
  const query = {
    text: 'UPDATE discount SET percentage=$1,discount=$2 RETURNING * ',
    values: [percentage,discount]
  };
  const result = await db.query(query);
  res.json(result);
}

async function getDiscount(req,res,next){
  const query = {
    text: "SELECT * FROM discount;",
  };
  const result = await db.query(query);
  res.json(result.rows[0]);
}

async function getTransactions(req, res, next) {
  try {
    const user_id = req.userdata?req.userdata.user_id:null;
    let query;

    if (user_id) {
      query = {

       //text: 'SELECT * FROM ticket WHERE user_id = $1',
       text: 'SELECT m.movie_name,t.* FROM ticket AS t left join movies as m ON t.movie_id=m.movie_id WHERE user_id = $1',

        values: [user_id]
      };
    } 

    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting transactions', err);
    next(err);
  }
}

async function analytics(req,res,next){
  let {days}=req.query;
  console.log(days);
  if(days==30){
    query = {
      text: "SELECT movie_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '30 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY movie_id ORDER BY movie_id;",
    };
  }
  else if(days==60){
    query = {
      text: "SELECT movie_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '60 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY movie_id ORDER BY movie_id;",
    };
  }
  else{
    query = {
      text: "SELECT movie_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '90 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY movie_id ORDER BY movie_id;",
    };
  }
  console.log(query)
  const result = await db.query(query);
  res.json(result.rows);
}

async function analyticsLocation(req,res,next){
  let {days}=req.query;
  console.log(days);
  if(days==30){
    query = {
      text: "SELECT location_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '30 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY location_id ORDER BY location_id;",
    };
  }
  else if(days==60){
    query = {
      text: "SELECT location_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '60 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY location_id ORDER BY location_id;",
    };
  }
  else{
    query = {
      text: "SELECT location_id, SUM(total_tickets) as total_tickets, SUM(total_seats) as total_seats FROM ( SELECT th.location_id, t.movie_id, COUNT(*) as total_tickets, SUM(ARRAY_LENGTH(t.seats, 1)) as total_seats FROM ticket t JOIN theater th ON t.theater_id = th.theater_id WHERE t.show_time >= CURRENT_DATE - INTERVAL '90 days' GROUP BY th.location_id, t.movie_id ) AS temp GROUP BY location_id ORDER BY location_id;",
    };
  }
  console.log(query)
  const result = await db.query(query);
  res.json(result.rows);
}
module.exports = {
 book,
 del,
 updateBooking,
 discountUpdate,
 getDiscount,
 getTransactions,
 analytics,
 analyticsLocation
};