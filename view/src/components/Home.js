import React from 'react';
import Link from 'react-router-dom/Link';

import 'bootstrap/dist/css/bootstrap.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../styles/Home.css';

class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            topics:[],
            //session:{}
        }
    }

    loadTopics=()=>
    {
        fetch('/loadTopics')
        .then(res=>res.json())
        .then(data=>{
            this.setState({
                topics:data.topics
            })
        });        
    }

    componentWillMount()
    {
        this.loadTopics();
        console.log(this.props.location.state);

    } 

    render()
    {
        const topics = this.state.topics;
        console.log(topics);
        return(
            <Container id='home'>
            <Row>
                <Col>
                    <Jumbotron>
                    <h3>Trending Topics!</h3>
                {
                topics.map((topic,i)=>
                    {
                        return(
                            <Card className='topic-card' key={i}>
                                <Link to={{
                                    pathname:`/topic/${topic.topicName}`,
                                    state:{topic:topic}
                                }}>
                                    <Card.Body>{topic.topicName}</Card.Body>
                                    <div className='info'>
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                    {topic.author} on {topic.timestamp}
                                </div>
                                </Link>
                            </Card>
                        )
                    })
                }
                    <Link to='/addTopic'><Button variant="primary">Add a Topic!</Button></Link>
                </Jumbotron>
                </Col>
            </Row>
            </Container>
        )
    }
}
export default Home;