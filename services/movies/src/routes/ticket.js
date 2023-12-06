const express = require('express')
const router = express.Router()
const ticket = require('../controllers/ticket')
const theater = require('../controllers/theater')
const { auth, roleCheck } = require('../services/middleware')

/**
  * @openapi
  * /ticket:
  *    post:
  *      tags:
  *        - Ticket
  *      description: book ticket 
  *      requestBody:
  *        required: true
  *        content:
  *            application/json:
  *                schema:
  *                    type: object
  *                    properties:
  *                        movie_id:
  *                            type: integer
  *                        show_time:
  *                            type: string
  *                            description: timestamp
  *                        screen_id:
  *                            type: integer
  *                        seats:
  *                            type: array
  *                            items:
  *                                type: integer
  *                        total_cost:
  *                            type: integer
  *                        rewards_used:
  *                            type: integer
  *                        theater_id:
  *                            type: integer
  *      responses:
  *        200:
  *           description: ticket booked
  */
router.post('/', ticket.book);

/**
  * @openapi
  * /ticket:
  *    put:
  *      security:
  *        - bearerAuth:
  *            type: http
  *            scheme: bearer
  *            bearerFormat: JWT
  *            summary: Endpoint requiring token authentication
  *      tags:
  *        - Ticket
  *      description: update ticket booking
  *      requestBody:
  *        required: true
  *        content:
  *            application/json:
  *                schema:
  *                    type: object
  *                    properties:
  *                        movie_id:
  *                            type: integer
  *                        show_time:
  *                            type: string
  *                            description: timestamp
  *                        screen_id:
  *                            type: integer
  *                        seats:
  *                            type: array
  *                            items:
  *                                type: integer
  *                        total_cost:
  *                            type: integer
  *                        rewards_used:
  *                            type: integer
  *                        theater_id:
  *                            type: integer
  *                        ticket_id:
  *                            type: integer
  *      responses:
  *        200:
  *           description: ticket booked
  */
router.put('/', auth, roleCheck(['admin', 'user']), ticket.updateBooking);


/**
  * @openapi
  * /ticket:
  *    delete:
  *      security:
  *        - bearerAuth:
  *            type: http
  *            scheme: bearer
  *            bearerFormat: JWT
  *            summary: Endpoint requiring token authentication
  *      parameters:
  *        - in: query
  *          name: ticket_id
  *          required: true
  *          type: integer
  *      tags:
  *        - Ticket
  *      description: Delete booking
  *      responses:
  *        200:
  *           description: Success
  */
router.delete('/', auth, ticket.del);


router.post('/discount', auth, roleCheck(['admin', 'user']), ticket.discountUpdate)
router.get('/discount', ticket.getDiscount)

/**
 
@openapi
/ticket/transactions:
get:
security:
bearerAuth:
type: http
scheme: bearer
bearerFormat: JWT
summary: Endpoint requiring token authentication
tags:
Theater
description: Get transaction history
responses:
200:
description: Returned all transactions
*/
router.get('/transactions', auth, ticket.getTransactions);

router.get('/analytics/movie',ticket.analytics);
router.get('/analytics/location',ticket.analyticsLocation);


module.exports = router