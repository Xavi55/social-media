import React from 'react';
import { Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
/* 
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
 */

import Link from 'react-router-dom/Link';

const Header = (props) =>
{
return(
<Navbar bg="light" expand="md" style={{'margin':'0 0 10px 0'}}>
    <Navbar.Brand>Zocialitt</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto links">{/*mr-auto allows a space in between */}
            <Link to='/'>Home</Link>&nbsp;&nbsp;&nbsp;
            {console.log(props)}
            <Link to='/login'>Login</Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> 
            */}
            </Nav>
            <Nav>
            <Nav.Link
            onClick={()=>{
                fetch('/logout')
                .then(res=>res.json())
                .then(res=>{
                    console.log('logout',res);
                });
                return(<Redirect to='/'></Redirect>);
            }}
            >Logout&nbsp;<i className="fa fa-sign-out" aria-hidden="true"></i></Nav.Link>
        </Nav>
        {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
        </Form> */}
    </Navbar.Collapse>
</Navbar>

);
}
export default Header;