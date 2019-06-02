import React from 'react';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route'
import Link from 'react-router-dom/Link';

import './App.css';
//import Router from './Routes/Router';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Topic from './components/Topic';
import AddTopic from './components/AddTopic';

//Home Page
class App extends React.Component {
    constructor(props)
    {
        super(props);
        this.state={
            session:{}
        }
    }

    componentWillMount()
    {
        /* fetch('/login')
        .then(res=>res.json())
        .then(res=>
        {
            this.setState({session:res});
        }) */
    }

    render(){
    return (
    <div className="App">
        <BrowserRouter> 
            <Header />
            <Switch>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/' component={Home} />
                <Route exact path='/addTopic' component={AddTopic} />
                
                <Route path='/topic' component={Topic}/>

                <Route exact path='*' component={()=>{return(<h1 style={{textAlign:'center'}}><br/><br/>404 ...</h1>)}}/>
            </Switch>
        </BrowserRouter>
        <div>
        </div>
    </div>
    );
  }
}

export default App;
