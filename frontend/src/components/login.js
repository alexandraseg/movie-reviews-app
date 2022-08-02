import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = props => {
  
    const [name, setName] = useState("")
    const [id, setId] = useState("")  
  
    //binding the field values to the name and id state variables
    const onChangeName = e => {
      const name = e.target.value
      setName(name);
    }  
  
    const onChangeId = e => {
      const id = e.target.value
      setId(id);
    }  
  
    
    const login = () => {
      props.login({name: name, id: id})
      props.history.push('/') //after login, we then redirect to the main page
    }  
  
    return(
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter username" 
              value={name} 
              onChange={onChangeName}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter id" 
              value={id} 
              onChange={onChangeId}
            />
          </Form.Group>        
          <Button variant="primary" onClick={login}>
            Submit
          </Button>
        </Form>    
      </div>
    )
  }
  
  export default Login;