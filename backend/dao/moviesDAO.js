import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId

let movies //movies stores the reference to the database

export default class MoviesDAO{

    static async injectDB(conn){ //injectDB is called as soon as the server starts, and provides the database reference to movies
        if(movies){ //if the reference already exists, we return
            return
        }
        try{ //else, we connect to the database name (process.env.MOVIEREVIEWS_NS) and 'movies' collection
            movies = await conn.db('sample_mflix').collection('movies') // conn.db(process.env.MOVIEREVIEWS_NS).collection('movies')
        }
        catch(e){ //if I fail to get the reference, an error msg is sent to the console
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    static async getMovies({// default filter

        filters = null, //object. The app provides filtering results by movie title "title" and movie rating "rated" (e.g. G for General audience, PG for Parental Guidance suggested and R for Restricted)
        page = 0,
        moviesPerPage = 20, //will only get 20 movies at once
    } = {}){
        let query //this variable will be empty unless a user specifies filters in their retrieval
        if(filters){
            if("title" in filters){ //if("title" in filters) ==== if(filters.hasOwnProperty('title'))
                query = { $text: { $search: filters['title']}} //object. Using $text and $search operators to query for documents that match any of the search terms. $text allows to query using multiple words by separating them with spaces.
            }else if("rated" in filters){ //if(filters.hasOwnProperty('rated'))
                query = { "rated": { $eq: filters['rated']}} //checking if the user specified value equals to the value in the database field
            }
        }
    
        let cursor
        try{
            cursor = await movies //finding all movies that fit the query and assigning to a cursor
                        .find(query)
                        .limit(moviesPerPage)
                        .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query) //getting the total number of movies by counting the number of documents in the query
            return {moviesList, totalNumMovies} //return them in an object
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0} //if any error, just returning an empty moviesList and totalNumMovies to be 0
        }

    }

    static async getRatings(){
        let ratings = []
        try{
            ratings = await movies.distinct("rated") //getting all the distinct rated values from the movies collection
            return ratings
        }catch(e){
            console.error(`unable to get ratings, $(e)`)
            return ratings
        }
    }

    static async getMovieById(id){
        try{
            return await movies.aggregate([ //using aggregate to provide a sequence of data aggregation operations
                {
                    $match: {
                        _id: new ObjectId(id) //looking for the movie document that matches the specified id
                    }
                },
                {
                    $lookup: { //performing an equality join using the _id field (from the movie document) with the movie_id field(from reviews collection)
                        from: 'reviews', //collection to join
                        localField: '_id', //field from the input document
                        foreignField: 'movie_id', //field from the documents of the "from" collection
                        as: 'reviews' //output array field
                    }
                }
            ]).next()
        }
        catch(e){
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

}



