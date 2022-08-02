import ReviewsDAO from '../dao/reviewsDAO.js' //functions: injectDB, addReview, updateReview, deleteReview

export default class ReviewsController{

    //static async addReview(movieId, user, review, date)
    static async apiPostReview(req,res,next){
        try{
            const movieId = req.body.movie_id
            const review = req.body.review
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
        
        const date = new Date()

        const ReviewResponse = await ReviewsDAO.addReview(
            movieId,
            userInfo,
            review,
            date
        )
        res.json({ status: "success "})
        }catch(e){
            res.status(500).json({ error: e.message })
        }
    }

    //static async updateReview(reviewId, userId, review, date)
    static async apiUpdateReview(req,res,next){
        try{
            const reviewId = req.body.review_id
            const review = req.body.review

            const date = new Date()

            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, //to ensure that the user who is updating the view is the one who has created it
                review,
                date
            )

            var { error } = ReviewResponse
            if(error){
                res.status.json({error})
            }

            //updateReview returns a document ReviewResponse which contains the property modifiedCount. 
            //This contains the number of modified documents. If it is zero, it means that the review has not been updated and we throw an error.
            if(ReviewResponse.modifiedCount === 0){ 
                throw new Error ("unable to update review. User may not be original poster")
            }

            res.json({status:"success"})

        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    //static async deleteReview(reviewId, userId)
    static async apiDeleteReview(req,res,next){
        try{
            const reviewId = req.body.review_id
            const userId = req.body.user_id
            const ReviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )

            res.json({status: "success"})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

}