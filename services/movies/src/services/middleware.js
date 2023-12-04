const jwt = require('jsonwebtoken')
const db = require('../config/db')

const auth = (req, res, next) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if(!tokenHeader) return res.sendStatus(403);
        const token = tokenHeader.split(" ")[1];
        jwt.verify(token,process.env.TOKEN,(error,decoded)=>{
            if(error) res.sendStatus(403);
            next();    
        })
    }
    catch(err) {
        console.error(`Errors`, err.message);
        next(err);
    }
    
}

const roleCheck = (role) => async (req,res,next) => {
    try {
        const tokenHeader = req.headers["authorization"];
        if(!tokenHeader) return res.sendStatus(403);
        const token = tokenHeader.split(" ")[1];
console.log(token);
        jwt.verify(token,process.env.TOKEN, async (err, decoded) => {
            
            if(err){
                console.error(err);
            }
            else{
                
                const query = {
                    text: 'SELECT role FROM public."user" WHERE email=$1',
                    values: [decoded.email]
                    };
                const result = await db.query(query);
                console.log(role,decoded.role)
                role.includes(result.rows[0].role)?next():res.status(401).json("You dont have access");
            }
        });

    }
    catch(err) {
        console.error(`Errors`, err.message);
        next(err);
    }

}

module.exports ={
    auth,
    roleCheck
}