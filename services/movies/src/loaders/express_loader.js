const express = require("express");
const jwt = require('jsonwebtoken')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const routesMovie = require("../routes/movie");
const routesLocations = require("../routes/locations");
const routesTheaters = require("../routes/theaters");
const routesUser =  require("../routes/user")
const routesTicket =  require("../routes/ticket")
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    docExpansion: 'none',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    info: {
      title: 'Nacho API',
      version: '0.0.1'
    },tags: [
      {name:'healthcheck'},
      {
        name: 'User',
        description: 'Login and Signup with user data and token',
      },
      {
        name: 'Locations',
        description: 'Get Locations',
      },
      {
        name: 'Movies',
        description: 'Operations related to movie',
      },
      {
        name: 'Theater',
        description: 'Operations related to theater and screens',
      },
      {
        name: 'Ticket',
        description: 'Ticket book, update and delete',
      },

    ],
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);


module.exports = app => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use((req,res,next)=>{
    if(req.headers['authorization']){
      console.log(req.headers)
      const token = req.headers['authorization'].split(" ")[1];
        
      jwt.verify(token,process.env.TOKEN, async (err, decoded) => {
          
          if(err){
              console.error(err);
          }
          else{
              req['userdata']= {...decoded};
              next();
          }
      });
    
    }
    else{
      next();
    }
  })
  app.use('/movies', routesMovie);
  app.use('/locations', routesLocations);
  app.use('/theaters', routesTheaters );
  app.use('/user', routesUser );
  app.use('/ticket', routesTicket );

  app.use('/api-docs',swaggerUI.serve,(req,res)=>{
    const swaggerUIOptions = {
      swaggerOptions: {
        docExpansion: 'none' // Set docExpansion here
      },
    };
    swaggerUI.setup(swaggerDocs, swaggerUIOptions)(req, res);
  })

  /**
   * @openapi
   * /healthcheck:
   *    get:
   *      tags:
   *         - locations
   *      description: Healthcheck
   *      responses:
   *        200:
   *           description: Success
   */
  app.get('/healthcheck',(req,res,next)=>{
    console.log(req);
    res.send("healthcheck passed,Service is working.")
  })

};