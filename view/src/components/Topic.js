import React from 'react';

import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import Message from './Message';
import PopUp from './PopUp';
import '../styles/Topic.css';

class Topic extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state={
            listMessages:[],
            tempMessages:[],
            message:'',
            timestamp:'',
            session:{},
            PopUpMessage:'',
            PopUpColor:'',
            ShowPopUp:false
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
            this.setState({
                listMessages:data.messages,
                tempMessages:data.messages
            });
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
                        'timestamp':this.state.timestamp,
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
                            author:sess.username,
                            timestamp:this.state.timestamp
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
                //alert('Log in first!');
                this.setState({
                    PopUpMessage:'Log in First!',
                    PopUpColor:'danger',
                    ShowPopUp:true
                })
            }
        }
        else
        {
            //alert('Need message!');
            this.setState({
                PopUpMessage:'Need Message!',
                PopUpColor:'danger',
                ShowPopUp:true
            })
        }
       
    }

    handleChange=(e)=>
    {
        this.setState({message:e});
    }

    sortBy=(code)=>
    {
        if(code===2)
        {
            let x = this.state.tempMessages;
            let size=this.state.tempMessages.length
            let n=Math.floor(size/2);

            for(let i=0 ;i<n;i++)
            {
                let temp=x[i];
                x[i]=x[x.length-i-1];
                x[x.length-i-1]=temp;
            }
            this.setState({listMessages:x});
        }
    }

    getDate=()=>
    {
        const Months={
            0:"Jan",
            1:"Feb",
            2:"Mar",
            3:"Apr",
            4:"May",
            5:"Jun",
            6:"Jul",
            7:"Aug",
            8:"Sep",
            9:"Oct",
            10:"Nov",
            11:"Dec"
        };
        let d = new Date();
        this.setState({timestamp:String(Months[d.getMonth()])+' '+String(d.getDate())});
    }

    closePopUp=()=>
    {
        this.setState({show:!this.state.ShowPopUp});
    }

    componentWillMount()
    {
        this.loginCheck();
        this.fetchMessages();
        this.getDate();
        //console.log(this.props.location.state.topic);
    }

    render()
    {
        const main = this.props.location.state.topic;
        return(
            <Container id='singleTopic'>
                <Row>
                    <Col md={12}>
                    <Card>
                    <Card.Header>
                        <h5>{main.topicName}</h5>
                        <br/>
                    </Card.Header>
                    <Card.Text>
                        {main.subtext}
                    </Card.Text>
                    <Card.Subtitle>
                        <div className='sort-messages'>Sort By: <span onClick={()=>this.sortBy(1)}>Litt's</span>&nbsp;&nbsp;<span onClick={()=>this.sortBy(2)}>Recents</span></div>
                        <div className='topic-info'>
                            <i className="fa fa-user" aria-hidden="true"></i>{main.author} on {main.timestamp}
                        </div>
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
                    </Card.Body>
                    {
                        this.state.ShowPopUp
                        ?
                        <PopUp 
                            ClosePopUp={(value)=>{
                                this.setState({ShowPopUp:value})//callback
                            }} 
                            message={this.state.PopUpMessage} 
                            color={this.state.PopUpColor}
                            show={this.state.ShowPopUp}
                        />
                        :
                        null
                    }
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
                            >
                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Topic;