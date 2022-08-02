import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js' //file storing the routes

const app = express() //creating the server. The 'use' function registers a middleware with our Express app

app.use(cors()) //enabling CORS checking, a mechanism  that uses additional HTTP headers to tell browsers to give a web app running at one origin, access to selected resources from a different origin.
app.use(express.json()) //is the JSON parsing middleware to enable the server to read and accept JSON in a request's body.

//specifying the initial routes:
app.use("/api/v1/movies", movies) //i.e. localhost:5000/api/v1/movies (general convention for API urls)
app.use('*', (req,res)=>{
    res.status(404).json({error: "not found"})
}) // if someone tries to go to a route that doesn't exist, the wild card route returns a 404 page with the 'not found' message

export default app