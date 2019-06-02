import React from 'react';

import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

//import Message from './Message';

import '../styles/Topic.css';

class Topic extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            messages:{}
        }
    }

    componentWillMount()
    {
        console.log(this.props.location.state.topic);
        
        //get messages
    }

    render()
    {
        const main = this.props.location.state.topic;
        return(
            <div id='singleTopic'>
                <Card>
                    <Card.Header>
                        <h5>{main.topicName}</h5>
                        <br/>
                        <div className='info'>
                        </div>
                    </Card.Header>
                    <Card.Text>
                        {main.subtext}
                    </Card.Text>
                    <Card.Subtitle>
                        <i className="fa fa-user" aria-hidden="true"></i>{main.author} on {main.timestamp}
                    </Card.Subtitle>
                    <hr/>
                    <Card.Body>
                        {
                            //.map
                        
                        }
                        Load the messages
                    </Card.Body>
                    <InputGroup className="mb-3">
                    <FormControl
                        placeholder="..."
                        aria-label="message"
                        maxLength='140'
                        as='textarea'
                    />
                        <InputGroup.Append>
                            <Button variant="outline-success">Button</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card>
            </div>
        )
    }
    
}
export default Topic;