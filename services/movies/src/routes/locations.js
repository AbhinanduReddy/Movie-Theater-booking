const express = require('express')
const router = express.Router()
const location = require('../controllers/location')


 /**
   * @openapi
   * /locations:
   *    get:
   *      tags:
   *        - Locations
   *      description: get locations
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/', location.get);
 /**
   * @openapi
   * /healthcheck:
   *    get:
   *      tags:
   *        - healthcheck
   *      description: Healthcheck
   *      responses:
   *        200:
   *           description: Success
   */
 router.get('/healthcheck',(req,res,next)=>{
    console.log(req);
    res.send("healthcheck passed,Service is working.")
  })


module.exports = router