import React from 'react';

import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import Message from './Message';

import '../styles/Topic.css';

class Topic extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            listMessages:[],
            message:'',
            session:{}
        }
    }

    loginCheck=()=>
    {
        fetch('/login')
        .then(res=>res.json())
        .then(data=>{
        if(data.pass)
        {
            //console.log(data);
            this.setState({
                session:data.session
            });
        }
      });
    }

    fetchMessages=()=>
    {
        let topic = this.props.location.state.topic;
        fetch('/loadMessages/'+topic._id)
        .then(res=>res.json())
        .then(data=>
        {
            this.setState({listMessages:data.messages});
        });
    }

    submitMessage=()=>
    {
        let sess = this.state.session;
        let topic = this.props.location.state.topic;
        let message = this.state.message;

        if(message.length)
        {
            if(sess.uID)//check login
            {
                //console.log('check',sess,'topic',topic._id);
                const options=
                {
                    method:'POST',
                    body:JSON.stringify({
                        'topicID':topic._id,
                        'reply':0,
                        'author':sess.username,
                        'timestamp':0,
                        'message':this.state.message
                    }),
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                        }
                }; 
                
                fetch('/newMessage',options)
                .then(res=>res.json())
                .then(data=>
                {
                    if(data.pass)
                    {
                        let temp=[{
                            topicID:topic.id,
                            reply:'0',
                            message:this.state.message,
                            author:sess.username
                        }];
                        let newList = temp.concat(this.state.listMessages);
                        this.setState({
                            listMessages:newList,
                            message:''
                        });
                        console.log(this.state.listMessages);
                    }
                });
            }
            else
            {
                alert('Log in first!');
            }
        }
        else
        {
            alert('Need message!');
        }
       
    }

    handleChange=(e)=>
    {
        this.setState({message:e});
    }

    componentWillMount()
    {
        this.loginCheck();
        this.fetchMessages();
        //console.log(this.props.location.state.topic);
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
                            this.state.listMessages
                            ?
                            this.state.listMessages.map((message,i)=>
                            {
                                return(
                                    <Message key={i} messageData={message} />
                                )
                            })
                            :
                            <h2>Unable to fetch messages?</h2>
                        
                        }
                        {/* <Message messageData={{'text':'sample text'}}/> */}
                    </Card.Body>
                    <InputGroup className="mb-3">
                    <FormControl
                        placeholder="..."
                        aria-label="message"
                        maxLength='140'
                        as='textarea'
                        onChange={(e)=>this.handleChange(e.target.value)}
                        value={this.state.message}
                    />
                        <InputGroup.Append>
                            <Button 
                                variant="outline-success"
                                onClick={this.submitMessage}
                            >Button</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Card>
            </div>
        )
    }
    
}
export default Topic;