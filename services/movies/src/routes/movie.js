const express = require('express')
const router = express.Router()
const movie = require('../controllers/movie')
const {auth, roleCheck}  =  require('../services/middleware')


 /**
   * @openapi
   * /movies:
   *    get:
   *      tags:
   *        - Movies
   *      description: get all movies list
   *      responses:
   *        200:
   *           description: Success
   */
router.get('/', movie.get);
router.get('/images/:id',movie.image);
 /**
   * @openapi
   * /movies/location/{location_id}:   
   *    get:
   *      parameters:
   *        - in: path
   *          name: location_id
   *          required: true
   *          type: integer
   *          description: Get all the movies in the specific location with location_id. Location Id can be get from the locations endpoint.
   *      tags:
   *        - Movies
   *      description: get movies with location id
   *      responses:
   *        200:
   *           description: Returned all movies with location id
   */
router.get('/location/:location_id',movie.get_with_location);
 /**
   * @openapi
   * /movies/theater/{theater_id}:   
   *    get:
   *      parameters:
   *        - in: path
   *          name: theater_id
   *          required: true
   *          type: integer
   *          description: Get all the movies in the specific theater with theater_id
   *      tags:
   *        - Movies
   *      description: get movies with location id
   *      responses:
   *        200:
   *           description: Returned all movies with location id
   */
router.get('/theater/:theater_id',movie.get_with_theater);

 /**
   * @openapi
   * /movies/upcoming:
   *    get:
   *      tags:
   *        - Movies
   *      description: get all upcomping movies
   *      responses:
   *        200:
   *           description: Returned all upcoming movies
   */
router.get('/upcoming',movie.upcoming);

 /**
   * @openapi
   * /movies:
   *    post:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Movies
   *      description: Create a new movie with this endpoint, but as only admin can create a new movie copy the token with admin credentials that is returned with login endpoint ins user section above into the authorize button on top header.NOTE- copy with out bearer
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        movie_name:
   *                            type: string
   *                        release_date:
   *                            type: string
   *                            format: date-time
   *                            description: timestamp
   *                        booking_started:
   *                            type: boolean
   *                        image_url:
   *                            type: string
   *                        description:
   *                            type: object
   *      responses:
   *        200:
   *           description: Returned all upcoming movies
   */
router.post('/', auth, roleCheck(['admin']),movie.newMovie);


 /**
   * @openapi
   *  /movies:
   *    delete:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      parameters:
   *        - in: query
   *          name: movie_id
   *          required: true
   *          type: integer
   *      tags:
   *        - Movies
   *      description: Delete movie
   *      responses:
   *        200:
   *           description: Success
   */
 router.delete('/',auth, roleCheck(['admin']),movie.del);

 /**
   * @openapi
   * /movies/{movie_id}:   
   *    get:
   *      parameters:
   *        - in: path
   *          name: movie_id
   *          required: true
   *          type: integer
   *          description: Get movie with movie_id.
   *      tags:
   *        - Movies
   *      description: get movies with movie id
   *      responses:
   *        200:
   *           description: Returned movie details with movie id
   */
 router.get('/:movie_id',movie.getWithId);

 /**
   * @openapi
   * /movies:
   *    put:
   *      security:
   *        - bearerAuth:
   *            type: http
   *            scheme: bearer
   *            bearerFormat: JWT
   *            summary: Endpoint requiring token authentication
   *      tags:
   *        - Movies
   *      description: Update movie, use token with admin user to create new theater
   *      requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        movie_id:
   *                            type: integer
   *                        movie_name:
   *                            type: string
   *                        release_date:
   *                            type: string
   *                            format: date-time
   *                            description: timestamp
   *                        booking_started:
   *                            type: boolean
   *                        image_url:
   *                            type: string
   *                        description:
   *                            type: object
   *      responses:
   *        200:
   *           description: Update theater
   */
router.put('/', auth, roleCheck(['admin']),movie.updateMovie);

module.exports = router