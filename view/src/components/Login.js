import React from 'react';
import { Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


//import Row from 'react-bootstrap/Row';
//import Row from 'react-bootstrap/Row';

import '../styles/Login.css';

class Login extends React.Component {

    constructor(props)
    {
      super(props);
      this.state={
        username:'',
        password:'',
        okay:false,
        session:{}
      };
      //this.login = this.login.bind(this);
      //this.isEmpty = this.isEmpty.bind(this);
      //this.handleChange = this.handleChange.bind(this);
    }
  
    isEmpty()
    {
      if(this.state.username.length===0 && this.state.password.length===0)
        return true;
    }

    clearState=()=>
    {
        this.setState({
            username:'',
            password:''
        })
    }
  
    login=(e,val)=>
    {
        if(this.isEmpty())
        {
            console.log('Empty');
        }
        else
        {
            const options=
            {
                method:'POST',
                body:JSON.stringify({'username':this.state.username,'password':this.state.password}),
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                    }
            };  
            
            fetch('/login',options)
            .then(res=>res.json())//preProcess
            .then(data=>{
                if(data.pass)
                {
                    console.log(data);
                    this.setState({
                    okay:true,
                    session:data.session
                });
                }
                else
                {
                    alert(data.mess);
                    this.clearState();
                }
                
            })
        }
    }

    signup=()=>
    {
        if(this.isEmpty())
        {
            console.log('empty');
        }
        else
        {
            const options=
            {
                method:'POST',
                body:JSON.stringify({'username':this.state.username,'password':this.state.password}),
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                    }
            };  
            
            fetch('/signup',options)
            .then(res=>res.json())//preProcess
            .then(data=>{
                if(data.pass)
                {
                //console.log(data);
                this.setState({
                    okay:true,
                    session:data.session
                });
                }
                else
                {
                    alert(data.mess);
                    this.clearState();
                }
            })
        }
    }
  
    handleChange=(elem,value)=>
    {
      switch(elem)
      {
        case "username":
          this.setState({username:value})
          break;
        case "password":
          this.setState({password:value})
          break;
        default:
            console.log('defaulted');
      }
    }

    componentWillMount()//login check
    {
      fetch('/login')
      .then(res=>res.json())
      .then(data=>{
          if(data.pass)
          {
              console.log(data);
              this.setState({
                  okay:true,
                  session:data.session
              });
          }
      })
    }
  
    render() {
      return (

        <div id={'login'}>
        {
        !this.state.okay
        ?
        <Tab.Container defaultActiveKey="login">
        <Card>
            <Card.Header>
            <Nav variant="pills" className="flex-column">
            <Row>
                <Nav.Item><Nav.Link eventKey="login">Login</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="signup">Sign Up</Nav.Link></Nav.Item>
            </Row>
            </Nav>
            </Card.Header>
            <Tab.Content>
                <Tab.Pane eventKey="login">
                    <Card.Body>
                        <Card.Title className='text-center'>Join the conversation!</Card.Title>
                        <Form>
                            <Form.Group controlId="username">
                                <FormControl 
                                    type="username" 
                                    placeholder="Username" 
                                    onChange={(e)=>this.handleChange('username',e.target.value)} 
                                    autoFocus 
                                    maxLength='6' 
                                    value={this.state.username}
                                />
                                {/* <Form.Text className="text-muted"></Form.Text> */}
                            </Form.Group>
                            <Form.Group controlId="password">
                                <FormControl 
                                    type="password" 
                                    placeholder="Password" 
                                    onChange={(e)=>this.handleChange('password',e.target.value)} 
                                    maxLength='12'
                                    value={this.state.password}
                                />
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicChecbox">
                                <Form.Check type="checkbox" label="Check me out" />
                            </Form.Group> */}
                        </Form>
                        <Button variant="primary" onClick={this.login}>
                            Submit
                        </Button>
                    </Card.Body>
                </Tab.Pane>
                <Tab.Pane eventKey="signup">
                <Card.Body>
                <Card.Title className='text-center'>Join the conversation!</Card.Title>
                        <Form>
                            <Form.Group controlId="susername">
                                <FormControl 
                                    type="susername" 
                                    placeholder="Username" 
                                    onChange={(e)=>this.handleChange('username',e.target.value)} 
                                    autoFocus
                                    maxLength='6'
                                    value={this.state.username}
                                />
                                {/* <Form.Text className="text-muted"></Form.Text> */}
                            </Form.Group>
                            <Form.Group controlId="spassword">
                                <FormControl 
                                    type="password" 
                                    placeholder="Password" 
                                    onChange={(e)=>this.handleChange('password',e.target.value)}
                                    maxLenth='12'
                                    value={this.state.password}
                                />
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={this.signup}>
                            Sign up!
                        </Button>
                    </Card.Body>
                </Tab.Pane>
            </Tab.Content>
        </Card>
        </Tab.Container>
        :
        <Redirect to={{
            pathname:'/',
            state:this.state.session
        }} /> //redirect to Home with session if present
        }
        </div>
      );
    }
  }
export default Login;