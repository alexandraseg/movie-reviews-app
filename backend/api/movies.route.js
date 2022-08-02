//contains routes that people can go to

import express from 'express'
import MoviesDAO from '../dao/moviesDAO.js'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js'

const router = express.Router() //get access to express router

router.route('/').get(MoviesController.apiGetMovies) //
router
    .route("/review") //post, put and delete http requests are all handled within this one route. If the '/review' route receives a post request to add a review, apiPostReview is called, etc.
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

router.route("/id/:id").get(MoviesController.apiGetMovieById) //retrieves a specific movie and all reviews associated for that movie
router.route("/ratings").get(MoviesController.apiGetRatings) //returns a list of movie ratings (e.g. G, PG, R) so that a user can select the rating from a dropdown menu in the front end


export default router