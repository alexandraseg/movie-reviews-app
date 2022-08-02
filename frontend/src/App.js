import React from 'react'
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import AddReview from "./components/add-review"
import MoviesList from "./components/movies-list"
import Movie from "./components/movie"
import Login from "./components/login"

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {

  const [user, setUser] = React.useState(null) //React.useState lets us add some local state to functional components

  async function login(user=null){//default user to null
    setUser(user)
  }

  async function logout(){
    setUser(null)
  }


  return (
    <div className="App">

      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link> 
              <Link to={"/movies"}>Movies</Link> 
            </Nav.Link>
            <Nav.Link>
              { user ? (
                <a onClick={logout}>Logout User</a>
              ) : (
              <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>

    <Switch>
      <Route exact path={["/", "/movies"]} component={MoviesList}></Route>
      <Route path="/movies/:id/review" render={(props)=><AddReview {...props} user={user}/> }></Route>
      <Route path="/movies/:id/" render={(props)=><Movie {...props} user={user}/>}></Route>
      <Route path="/login" render={(props)=><Login {...props} login={login}/>}></Route>
    </Switch>


    </div>
  );
}

export default App;

//Link allows to route to a different component 
//If the user is not logged in, 'Login' will be shown, which links to the login component,
//otherwise it will show 'logout user', linking to the logout component

//using Switch component to switch between different routes. It renders the first route that matches.
//<Route exact path={["/", "/movies"]} component={MoviesList}></Route> : if the path is "/" or "/movies", show the MoviesList component

//<Route path="/movies/:id/review" render={(props)=><AddReview {...props} user={user}/> }></Route> : 
//we use render instead of component because render allows us to pass in props into a component rendered by React Router. <Route path=" " render={ }></Route>
//In this case, I am passing user as props to the AddReview component.
//Data can be passed  into a component by passing in an object called props

//The login route passes in the login function (of this file) as a prop.
//This allows the login function to be called from the Login component and thus populate the user state variable