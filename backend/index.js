import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'


async function main(){ //creating an asynchronous function main() to connect to my MongoDB cluster and call functions that access the database

    dotenv.config() //loading in the environment variables

    const uri = "mongodb+srv://1234:pwd123@cluster0.4ghjcos.mongodb.net/sample_mflix?retryWrites=true&w=majority";

    const client = new mongodb.MongoClient(uri) //creating an instance of MongoClient and passing in the database URI

    // process.env.MOVIEREVIEWS_DB_URI //process.env didn't work **********
    // const port = process.env.PORT || 8000 //process.env didn't work *******

    const port = 5000 || 8000 //if can't access the given port, I use port 8000

    try {
        //connect to the MongoDB cluster
        await client.connect() //client.connect() returns a promise 
                               //using 'await' to indicate that we block further execution until that operation has completed
        
        
        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        //after connecting to the database and there are no errors, we then start the web server
        app.listen(port, () =>{ //starts the server and listens via the specified port. The callback function provided in the 2nd argument is executed when the server starts listening.
            console.log('server is running on port:'+port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}

main().catch(console.error); //calling the main function and sending any errors to the console
