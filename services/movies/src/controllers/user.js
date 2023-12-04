const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { error } = require('../services/Logger');


async function signup(req, res, next) {
  try {
    const username = req.body.username;
    const email =  req.body.email;
    const password = await bcrypt.hash(req.body.password, 12);

    const role = req.body.role || 'user';

    const query = {
      text: 'INSERT INTO public."user" (username,email,password,role,rewards) VALUES ($1,$2,$3,$4,$5);',
      values: [username,email,password,role,5]
    };
    
    console.log(query);
    const result = await db.query(query);
    res.json("User Successfully Created");

  }
  catch (err) {
    console.error(`Errors`, err);
    next(err.message);
  }

}

async function login(req, res, next) {
  try {
    const email =  req.body.email;
    const password = req.body.password;

    console.log(req)
    const query = {
      text: 'SELECT * FROM public."user" WHERE email=$1',
      values: [email]
    };
    
    console.log(query);
    const result = await db.query(query);
    const userData = result.rows[0]
    console.log(userData);
    if(userData==undefined){
      res.status(404).json({ error: 'User not found' });
      next();
    }
    orginalPass=userData.password;
    console.log(orginalPass)
    console.log(password)
    let correctPass = await bcrypt.compare(password, orginalPass);
    if(correctPass) {
      let token =jwt.sign({
        name: userData.username,
        email: userData.email,
        role: userData.role,
        user_id: userData.user_id
      },
      process.env.TOKEN,
      {expiresIn:"4 days"}
      )
      let result = {
        username: userData.username,
        role: userData.role,
        email: userData.email,
        token: `Bearer ${token}`,
        expiresIn: 168,
        rewards: userData.rewards
      };
      res.status(200).json({
        ...result,
        message: "Successfully loggedin"
      });
    }
    else{
      throw Error('Incorrect Password or Email');
    }
  }
  catch (err) {
    console.error(`Errors`, err.message);
    next(err);
  }
}

async function updateRewards(user_id,reward){

  try {

    const query = {
      text: 'UPDATE public."user" SET rewards=rewards+$1 WHERE user_id=$2',
      values: [reward,user_id]
    };
   const result = await db.query(query);
    console.log(result)
  }
  catch (err) {
    console.error(`Errors`, err);
  }

}
async function updateRole(req,res){

  try {
    let premium='premium';
    const user_id = req.userdata?req.userdata.user_id:null;

    const query = {
      text: 'UPDATE public."user" SET role=$1 WHERE user_id=$2',
      values: [premium,user_id]
    };
   const result = await db.query(query);
    console.log(result)
    res.json('updated to premium');
  }
  catch (err) {
    console.error(`Errors`, err);
  }

}
async function getRewardPoints(req,res){
  try {
    const user_id = req.userdata.user_id;
    const query = {
      text: 'SELECT rewards FROM public."user" WHERE user_id=$1',
      values: [user_id]
    };
   const result = await db.query(query);
    console.log(result)
    res.json(result.rows[0])
  }
  catch (err) {
    console.error(`Errors`, err);
  }
}

module.exports = {
  signup,
  login,
  updateRewards,
  getRewardPoints,
  updateRole
};