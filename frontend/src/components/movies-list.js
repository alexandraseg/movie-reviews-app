import React, {useState, useEffect} from 'react'
import MovieDataService from "../services/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';


//MoviesList is a functional component and receives and uses props. I use the React useState hook 
//to create the movies, searchTitle, searchRating and ratings state variables.
//The searchTitle and searchRating keep track of what a user has entered into the search form fields in the Movies List page.

const MoviesList = props => {
    const [movies, setMovies] = useState([]) //movies is default set to an empty array 
    const [searchTitle, setSearchTitle] = useState("")
    const [searchRating, setSearchRating] = useState("")
    const [ratings, setRatings] = useState(["All Ratings"]) //ratings is default set to 'All Ratings"

    //these two state variables are populated in retrieveMovies
    const [currentPage, setCurrentPage] = useState(0) //to keep track of which page we are currently displayings
    const [entriesPerPage, setEntriesPerPage] = useState(0)
    const [currentSearchMode, setCurrentSearchMode] = useState("") //contains the value either "", "findByTitle" or "findByRatings"

    useEffect(()=>{
        setCurrentPage(0)
    }, [currentSearchMode])

    //The useEffect hook is called after the component renders. So if we want to tell the component to perform some code after rendering, we include it here.
    //In our case, after the component renders, we want to retrieve movies and ratings.
    //It's important to specify an empty array [] in the second argument, so that useEffect is called only once when the component first renders. 
    //Without the 2nd argument, useEffect is run on every render of the component which is not wanted since this will call retrieveMovies and retrieveRatings multiple times
    //unnecessarily. Will later fix it to be called whenever the state changes
    useEffect(() =>{
        retrieveMovies()
        retrieveRatings()
    }, [])

    useEffect(()=>{
        retrieveNextPage()
    }, [currentPage]) //because I have specified currentPage in the 2nd argument array, 
    //each time currentPage changes in value, this useEffect will be trigged and call
    //RetrieveMovies with the updated currentPage value.
    
    const retrieveNextPage=()=>{
        if(currentSearchMode === "findByTitle"){
            findByTitle()
        }
        else if(currentSearchMode === "findByRating"){
            findByRating()
        }
        else{
            retrieveMovies()
        }
    }

    //reminder:
    // getAll(page = 0){
    //    return axios.get(`http://localhost:5000/api/v1/movies?page=${page}`) //this endpoint is served by the method apiGetMovies in MoviesController (backend)
    // }
    const retrieveMovies = () =>{
        setCurrentSearchMode("")
        MovieDataService.getAll(currentPage)
        .then(response =>{
            console.log(response.data)
            setMovies(response.data.movies) //getAll returns a promise with the movies retrieved from the database and I set it to the 'movies' state variable | reminder: const [movies, setMovies] = useState([])
            setCurrentPage(response.data.page)
            setEntriesPerPage(response.data.entries_per_page)
        })
        .catch( e =>{
            console.log(e)
        })
    }

    const retrieveRatings = () =>{
        MovieDataService.getRatings()
        .then(response =>{
            console.log(response.data)
            //I concat the response data to the 'All ratings' array. 
            //In case user doesn't specify any search criteria in the 'ratings' drop down menu, 
            //it will be set to 'All Ratings'
            setRatings(["All Ratings"].concat(response.data))
        })
        .catch( e => {
            console.log(e)
        })
    }

    //will be called whenever a user types into the search title field.
    //Will then take the entered value and set it to the component state.
    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value
        setSearchTitle(searchTitle);
    }

    const onChangeSearchRating = e => {
        const searchRating = e.target.value
        setSearchRating(searchRating);
    }


    const find = (query, by) =>{
        MovieDataService.find(query,by, currentPage)
        .then(response =>{
            console.log(response.data)
            setMovies(response.data.movies)
        })
        .catch(e =>{
            console.log(e)
        })
    }

    const findByTitle = () =>{
        setCurrentSearchMode("findByTitle")
        find(searchTitle, "title")
    }

    const findByRating = () =>{
        setCurrentSearchMode("findByRating")
        if(searchRating === "All Ratings"){
            retrieveMovies()
        }
        else{
            find(searchRating, "rated")
        }
    }

    //Putting the two search fields in a single row and in side by side columns
    //Setting the Form.Control value={searchTitle}
    //Setting Form.Control onChange={onChangeSearchTitle} which will in turn update searchTitle state variable
    //In essence, this field is double binded to the searchTitle state.
    return (
        <div className="App">   
          <Container>
            <Form>        
              <Row> 

                <Col>
                  <Form.Group>          
                    <Form.Control 
                      type="text" 
                      placeholder="Search by title" 
                      value={searchTitle} 
                      onChange={onChangeSearchTitle} 
                    />
                  </Form.Group>        
                  <Button 
                    variant="primary" 
                    type="button" 
                    onClick={findByTitle}
                  > 
                    Search         
                  </Button>
                </Col>

                <Col>
                  <Form.Group>
                      {/* The dropdown field to select a movie rating.  */}
                    {/* To populate the option values for the dropdown,  */}
                    {/* I use map function, where for each 'rating' in 'ratings' array,  */}
                    {/* I return an option element with the rating value for the select box. */}
                    <Form.Control as="select" onChange={onChangeSearchRating} >
                      {ratings.map(rating =>{
                        return(
                          <option value={rating}>{rating}</option>
                        )
                      })}
                    </Form.Control>       
                  </Form.Group>    
                  <Button 
                      variant="primary" 
                      type="button" 
                      onClick={findByRating}
                  > 
                    Search         
                  </Button>  
                </Col>

              </Row>              
            </Form> 
            <Row>
                {movies.map((movie) =>{
                  return(
                    <Col>
                      <Card style={{ width: '18rem' }}>
                        <Card.Img src={movie.poster+"/100px180"} />
                        <Card.Body>
                          <Card.Title>{movie.title}</Card.Title>
                          <Card.Text>
                            Rating: {movie.rated}                        
                          </Card.Text>
                          <Card.Text>{movie.plot}</Card.Text>                                            
                          <Link to={"/movies/"+movie._id} >View Reviews</Link>
                        </Card.Body>
                      </Card>            
                    </Col>                
                  )
                })}
            </Row>          
            <br />       
              Showing page: {currentPage}. 
              <Button 
                variant="link"             
                onClick={() => {setCurrentPage(currentPage + 1)}}       
              > 
                Get next {entriesPerPage} results         
              </Button>
          </Container>        
        </div>
      );
    
    


}



export default MoviesList;