import MoviesDAO from '../dao/moviesDAO.js'

export default class MoviesController{

    static async apiGetMovies(req,res,next){
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20 //checking if moviesPerPage exists, parse it into an integer
        const page = req.query.page ? parseInt(req.query.page) : 0

        let filters = {} //empty filters object
        if(req.query.rated){ //if the rated query string exists, then add to the filters object.
            filters.rated = req.query.rated
        }
        else if(req.query.title){ //same
            filters.title = req.query.title
        }

        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({filters, page, moviesPerPage}) //calling getMovies in MoviesDAO, which returns moviesList and totalNumMovies

        let response ={
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response) //sending a JSON response with the above response object to whoever calls this URL
    }

    static async apiGetMovieById(req,res,next){
        try{
            let id = req.params.id || {}
            let movie = await MoviesDAO.getMovieById(id)
            if(!movie){
                res.status(404).json({error: "not found"})
                return
            }
            res.json(movie)
        }catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetRatings(req,res,next){
        try{
            let propertyTypes = await MoviesDAO.getRatings()
            res.json(propertyTypes)
        }
        catch(e){
            console.log(`api,${e}`)
            res.status(500).json({error:e})
        }
    }


}