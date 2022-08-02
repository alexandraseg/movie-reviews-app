import React, {useState, useEffect} from 'react'
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Media from 'react-bootstrap/Media';
import moment from 'moment'


const Movie = props => {

    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews: []
    })

    const getMovie = id =>{
        MovieDataService.get(id)
        .then(response =>{
            setMovie(response.data)
            console.log(response.data)
        })
        .catch(e =>{
            console.log(e)
        })
    }

    //useEffect is called when the component renders
    //By providing props.match.params.id into the second argument array, useEffect will be called each time this value changes.
    useEffect(()=>{getMovie(props.match.params.id)}, [props.match.params.id])
    //how props.match.params.id is populated: <Route path="/movies/:id/" render={(props)=><Movie {...props} user={user}/>}></Route>


    //reminder about the index:
    // {movie.reviews.map((review, index)=>{
    //     return (
    //       <Media key={index}>
    //         <Media.Body>
    const deleteReview = (reviewId, index) => { 
        MovieDataService.deleteReview(reviewId, props.user.id) //ensuring user who is deleting the review is the one who has created the review (DAO--> await reviews.deleteOne({_id:xxxx, user_id:xxxx}))
        .then(response => { //a callback function is called when deleteReview completes. We get the reviews array in the current state (meaning the one having deleted the review).
            setMovie((prevState)=>{ //prevState holds the value of state before the setState was triggered
                prevState.reviews.splice(index, 1) //we provide the index of the review to be deleted to the splice method to remove that review. Index is the starting index, and 1 is the number of elements to remove.
                return({
                    ...prevState //we set the updated reviews array as the state
                })
            })
        })
        .catch(e=>{
            console.log(e)
        })
    }

    return(
    <div>
     <Container>
        <Row>
          {/* This column contains the movie poster if it exists */}
          <Col>
            <Image src={movie.poster+"/100px250"} fluid />            
          </Col>
          {/* This column show the movie details in a Card component */}
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>                  
                <Card.Text>
                  {movie.plot}
                </Card.Text>
                {/* If the user is logged in, i.e. props.user is true, I include a link to 'Add Review' */}
  		        {props.user &&
                <Link to={"/movies/" + props.match.params.id + "/review"}>Add Review</Link>}
              </Card.Body>
            </Card>
            <br></br>
            <h2>Reviews</h2>
            <br></br>            
            {movie.reviews.map((review, index)=>{
              return (
                <Media key={index}>
                  <Media.Body>
                  <h5>
                     {review.name+" reviewed on "} {moment(review.date).format("Do MMMM YYYY")}
                  </h5>             

                    <p>{review.review}</p>
                    {/* IF a user is logged in (props.user is true) AND the logged-in-user-id === review-user-id ONLY THEN do we render the Edit/Delete buttons */}
                    {props.user && props.user.id === review.user_id && 
                      <Row>                          
                        <Col><Link to={{
                          pathname:"/movies/"+props.match.params.id+"/review", 
                          state: {currentReview: review}
                          }}>Edit</Link>
                        </Col>
                        <Col>
                        <Button variant="link" onClick={()=>deleteReview(review._id, index)}>
                        Delete
                        </Button>	
                        </Col>

                      </Row>
                    }
                  </Media.Body>
                </Media> 
              )
            })}                         

          </Col>          
        </Row>
      </Container>    
    </div>
    );

}



export default Movie;