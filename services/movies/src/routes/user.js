const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const {auth}  =  require('../services/middleware')


 /**
   * @openapi
   * /user/signup:
   *    post:
   *      tags:
   *        - User
   *      description: Create a New User/Signup
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        username:
   *                            type: string
   *                        email:
   *                            type: string
   *                        password:
   *                            type: string
   *      responses:
   *        200:
   *           description: Successfully registered user
   */
router.post('/signup',user.signup);

/**
   * @openapi
   * /user/login:
   *    post:
   *      tags:
   *        - User
   *      description: Login user to get userdata and token for authentication
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        email:
   *                            type: string
   *                        password:
   *                            type: string
   *      responses:
   *        200:
   *           description: Successfully loggedin user
   */
router.post('/login',user.login);


/**
   * @openapi
   * /user/rewards:
   *    get:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - User
   *      description: get reward points of user
   *      responses:
   *        200:
   *           description: Successfully returned reward points
   */
router.get('/rewards',auth,user.getRewardPoints);

/**
   * @openapi
   * /user/premium:
   *    put:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - User
   *      description: update premium
   *      responses:
   *        200:
   *           description: updated to premium
   */
router.put('/premium',auth,user.updateRole);




module.exports = router