import axios from "axios"; //using axios library for sending get, post, put and delete request

class MovieDataService{

    getAll(page = 0){
        return axios.get(`https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies?page=${page}`) //this endpoint is served by the method apiGetMovies in MoviesController (backend)
    }

    get(id){
        return axios.get(`https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies/id/${id}`) //this endpoint is served by the method apiGetMovieById in MoviesController (backend)
    }

    find(query, by = "title", page = 0){
        return axios.get(`https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies?${by}=${query}&page=${page}`) //connects to the same endpoint as getAll except that it has query which consists of the user-entered search title, ratings and page number
    }

    createReview(data){
        return axios.post("https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies/review", data)
    }

    updateReview(data){
        return axios.put("https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies/review", data)
    }

    deleteReview(id, userId){
        return axios.delete(
            "https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies/review", {data:{review_id: id, user_id: userId}}
        )
    }

    getRatings(){
        return axios.get("https://fathomless-lowlands-88451.herokuapp.com//api/v1/movies/ratings")
    }

}

export default new MovieDataService()