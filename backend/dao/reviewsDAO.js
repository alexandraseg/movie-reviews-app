import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId //needing ObjectId to convert an id string to a MongoDB Object id later on

let reviews

export default class ReviewsDAO{

    static async injectDB(conn){
        if(reviews){
            return
        }
        try{
            reviews = await conn.db('sample_mflix').collection('reviews')
        }
        catch(e){
            console.error(`unable to establish connection handle in reviewDAO: ${e}`)
        }
    }

    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: ObjectId(movieId) //have to first convert the movieId string to a MongoDB object id. 
            }
            return await reviews.insertOne(reviewDoc)
        }
        catch(e){
            console.error(`unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, userId, review, date){
        try{
            //filters for an existing review created by userId and whith reviewId.
            //If the review exists, it is updated with the second argument which contains the new review text and date
            const updateResponse = await reviews.updateOne(
                {user_id: userId, _id: ObjectId(reviewId)}, 
                {$set: {review:review, date:date}}
            )
            return updateResponse
        }
        catch(e){
            console.error(`unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId), //looking for an existing review with reviewId and created by userId. If the review exists, then it's deleted
                user_id: userId
            })
            return deleteResponse
        }catch(e){
            console.error(`unable to delete review: ${e}`)
            return { error: e }
        }
    }

}