const express = require('express')
const router = express.Router()
const theater = require('../controllers/theater')
const {auth, roleCheck}  =  require('../services/middleware')

 /**
   * @openapi
   * /theaters:
   *    get:
   *      tags:
   *        - Theater
   *      description: get all theaters list
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/',theater.get);
 /**
   * @openapi
   * /theaters/location/{location_id}:   
   *    get:
   *      parameters:
   *        - in: path
   *          name: location_id
   *          required: true
   *          type: integer
   *          description: Get all the theaters in the specific location with location_id. Location Id can be get from the locations endpoint.
   *      tags:
   *        - Theater
   *      description: get theaters with location id
   *      responses:
   *        200:
   *           description: Returned all theaters with location id
   */
router.get('/location/:location_id',theater.get_with_location);


 /**
   * @openapi
   * /theaters/movie/{movie_id}:   
   *    get:
   *      parameters:
   *        - in: path
   *          name: movie_id
   *          required: true
   *          type: integer
   *          description: Get all the theaters that have movie with movie_id
   *      tags:
   *        - Theater
   *      description: get theaters with movie id
   *      responses:
   *        200:
   *           description: Returned all theaters with movie id
   */
router.get('/movie/:movie_id',theater.get_theaters_with_movie);

 /**
   * @openapi
   * /theaters/show_time:
   *    get:
   *      tags:
   *        - Theater
   *      description: get show times for specfic movie and thater
   *      parameters:
   *        - in: query
   *          name: movie_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: theater_id
   *          required: true
   *          type: integer
 
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/show_time',theater.get_show_time);

 /**
   * @openapi
   * /theaters/booked_seats:
   *    get:
   *      tags:
   *        - Theater
   *      description: get booked seats for the specific screen and show time
   *      parameters:
   *        - in: query
   *          name: movie_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: theater_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: screen_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: show_time
   *          type: string
   *          description: timestamp
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/booked_seats',theater.get_booked_seats);


/**
   * @openapi
   * /theaters:
   *    post:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Create a new theater, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        theater_name:
   *                            type: string
   *                        location_id:
   *                            type: integer
   *                        movies:
   *                            type: array
   *                            items:
   *                                type: integer
   *      responses:
   *        200:
   *           description: create new theater
   */
router.post('/', auth, roleCheck(['admin']),theater.newTheater);
/**
   * @openapi
   * /theaters/screen:
   *    post:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Create a new screen, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        theater_id:
   *                            type: integer
   *                        movie_id:
   *                            type: integer
   *                        screen_name:
   *                            type: string
   *                        show_times:
   *                            type: string
   *                            description: timestamp with time zone
   *                        cost:
   *                            type: integer
   *      responses:
   *        200:
   *           description: create new screen
   */
router.post('/screen', auth, roleCheck(['admin']),theater.newScreen);


/**
   * @openapi
   * /theaters/screen:
   *    put:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Update screen details, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        screen_id:
   *                            type: integer
   *                        theater_id:
   *                            type: integer
   *                        movie_id:
   *                            type: integer
   *                        screen_name:
   *                            type: string
   *                        show_time:
   *                            type: string
   *                            description: timestamp with time zone
   *                        cost:
   *                            type: integer
   *      responses:
   *        200:
   *           description: updated screen details
   */
router.put('/screen', auth, roleCheck(['admin']),theater.updateScreen);


/**
   * @openapi
   * /theaters:
   *    put:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Update theater, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        theater_id:
   *                            type: integer
   *                        theater_name:
   *                            type: string
   *                        location_id:
   *                            type: integer
   *                        movies:
   *                            type: array
   *                            items:
   *                                type: integer
   *      responses:
   *        200:
   *           description: Update theater
   */
router.put('/', auth, roleCheck(['admin']),theater.updateTheater);



/**
   * @openapi
   * /theaters/theater_screen:
   *    get:
   *      tags:
   *        - Theater
   *      description: get seats for specific screen and theater
   *      parameters:
   *        - in: query
   *          name: theater_id
   *          required: true
   *          type: integer
 
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/theater_screen',theater.get_seats);

router.get('/theater_screen/seats',theater.get_seats_screen);

/**
   * @openapi
   * /theaters/theater_screen:
   *    post:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Create seatsnew screen, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        show_times:
   *                            type: array
   *                            items:
   *                                type: string
   *                        rows:
   *                            type: integer
   *                        columns:
   *                            type: integer
   *                        theater_id:
   *                            type: integer
   *                        screen_name:
   *                            type: string
   *      responses: 
   *        200:
   *           description: create seats
   */
router.post('/theater_screen', auth, roleCheck(['admin']),theater.newSeat);

/**
   * @openapi
   * /theaters/theater_screen:
   *    put:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Theater
   *      description: Create seatsnew screen, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        show_times:
   *                            type: array
   *                            items:
   *                                type: string
   *                        rows:
   *                            type: integer
   *                        columns:
   *                            type: integer
   *                        theater_id:
   *                            type: integer
   *                        screen_name:
   *                            type: string
   *      responses: 
   *        200:
   *           description: create seats
   */
router.put('/theater_screen', auth, roleCheck(['admin']),theater.updateSeat);

 /**
   * @openapi
   *  /theater:
   *    delete:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      parameters:
   *        - in: query
   *          name: theater_id
   *          required: true
   *          type: integer
   *      tags:
   *        - Theater
   *      description: Delete Theater
   *      responses:
   *        200:
   *           description: Success
   */
 router.delete('/',auth, roleCheck(['admin']),theater.del);

  /**
   * @openapi
   * /theaters/screen:
   *    delete:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      parameters:
   *        - in: query
   *          name: screen_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: show_times
   *          required: true
   *          type: string
   *      tags:
   *        - Theater
   *      description: Delete Screen
   *      responses:
   *        200:
   *           description: Success
   */
  router.delete('/screen',auth, roleCheck(['admin']),theater.delScreen);

 /**
   * @openapi
   * /theaters/screen:
   *    get:
   *      tags:
   *        - Theater
   *      description: get seats for specific screen and theater
   *      parameters:
   *        - in: query
   *          name: theater_id
   *          required: true
   *          type: integer
   *        - in: query
   *          name: screen_id
   *          required: true
   *          type: integer
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/screen',theater.get_screen);

module.exports = router