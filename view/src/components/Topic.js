import React from 'react';

import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';


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
            messageRank:0,
            session:{},
            PopUpMessage:'',
            PopUpColor:'',
            ShowPopUp:false,
            sortToggle:0,
            modalReply:false,
            replyMessage:'',
            replyMessageID:'',
            replies:{
                /*
                "5d37f3217d39791afe037783":[
                    {
                        "message":"#reply1",
                        "author":"user",
                        "timestamp":"Aug 7"},
                    {
                        "message":"#reply2",
                        "author":"user",
                        "timestamp":"Aug 7"}
                ],
                */
            }
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
            for(let i in data.messages)
            {
                this.fetchReplies(data.messages[i]._id)
            }
            this.setState({
                listMessages:data.messages,
                tempMessages:data.messages
            });
        });
    }

    fetchReplies=(id)=>
    {
        fetch('/loadMessages/replies/'+id)
        .then(res=>res.json())
        .then(data=>
        {
            if(data.pass)
            {
                //console.log(data.replies);
                let temp=this.state.replies;
                try
                {
                    temp[id].push(...data.replies);
                }
                catch(e)
                {
                    //if the key does not exist, make one
                    temp[id]=data.replies;
                }
                console.log(temp);
                this.setState({replies:temp});
                //return data.replies;
            }
            else
            {
                console.log(data.mess);
            }
        });
    }

    submitMessage=(code)=>
    {
        let sess = this.state.session;
        let topic = this.props.location.state.topic;
        let timestamp = this.getDate();
        let replyTo = 0;
        let message='';
        let rank=0
        if(code)//turns into a reply
        {
            message = this.state.replyMessage;
            replyTo = this.state.replyMessageID;
            rank=this.state.messageRank
        }
        else
        {
            message = this.state.message
        }
        if(message.length)
        {
            if(sess.uID)
            {
                const options=
                {
                    method:'POST',
                    body:JSON.stringify({
                        'topicID':topic._id,
                        'replyTo':replyTo,
                        'author':sess.username,
                        'timestamp':timestamp,
                        'message':message,
                        'likes':0,
                        'dislikes':0,
                        'rank':rank
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
                        if(code)
                        {
                            let temp=this.state.replies;
                            let x={
                                'topicID':topic._id,
                                'replyTo':replyTo,
                                'author':sess.username,
                                'timestamp':timestamp,
                                'message':message,
                                'likes':0,
                                'dislikes':0,
                                'rank':rank
                            };
                            try
                            {
                                temp[replyTo].push(x);
                            }
                            catch(e)
                            {
                                //if the key does not exist, make one
                                temp[replyTo]=[x];
                            }
                            console.log(temp);
                            this.setState({

                                replyMessage:'',
                                modalReply:false
                            });
                        }
                        else
                        {
                            let temp=[{
                                topicID:topic.id,
                                reply:'0',
                                message:this.state.message,
                                author:sess.username,
                                timestamp:timestamp
                            }];
                            let newList = temp.concat(this.state.listMessages);
                            this.setState({
                                listMessages:newList,
                                message:'',
                            });
                            console.log(this.state.listMessages); 
                        }
                        console.log(data.mess);
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
                });
            }
        }
        else
        {
            //alert('Need message!');
            this.setState({
                PopUpMessage:'Need Message!',
                PopUpColor:'danger',
                ShowPopUp:true
            });
        }
    }

    handleReply=(value,id,rank)=>
    {
        console.log(value, id);
        this.setState({
            modalReply: value,
            replyMessageID:id,
            messageRank:rank
        });
    }

    cancelReply=()=>
    {
        this.setState({
            modalReply:false,
            replyMessage:'',
            replyMessageID:'',
            messageRank:0
        })
    }

    handleChange=(e,code)=>
    {
        if(code)
        {
            this.setState({message:e});
        }
        else
        {
            this.setState({replyMessage:e});
        }
    }

    sortBy=(code)=>
    {
        //mini function
        this.reverseList=(arr)=>
        {
            let size=arr.length
            let n=Math.floor(size/2);

            for(let i=0 ;i<n;i++)
            {
                let temp=arr[i];
                arr[i]=arr[arr.length-i-1];
                arr[arr.length-i-1]=temp;
            }

            return arr;
        }

        if(code===2)
        {
            let x = this.reverseList(this.state.tempMessages);
            this.setState({listMessages:x});
        }

        else
        {
            let toggle = this.state.sortToggle;
            if(!toggle)
            {
                let x = [...this.state.tempMessages];
                //bubble-sort
                for(let i=0; i<x.length;i++)
                {
                    for(let j=i+1;j<x.length;j++)
                    {
                        if(x[j].likes>x[i].likes)
                        {
                            let temp = x[i];
                            x[i]=x[j];
                            x[j]=temp;
                        }
                    }
                }
                this.setState({listMessages:x,sortToggle:1});
            }
            else if(toggle===1)
            {
                //likes acending
                let x = this.reverseList(this.state.listMessages);
                this.setState({listMessages:x,sortToggle:2})
            }
            else
            {
                //revert 
                this.setState({
                    listMessages:this.state.tempMessages, sortToggle:0
                });
            }
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
        return String(Months[d.getMonth()])+' '+String(d.getDate());
    }

    closePopUp=()=>
    {
        this.setState({show:!this.state.ShowPopUp});
    }

    handleLike=(val,id,)=>
    {
        //console.log(val,id);
        const options=
            {
                method:'POST',
                body:JSON.stringify({
                    'code':val,
                    'messageID':id,
                    'userID':this.state.session.uID
                }),
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                    }
            };

        fetch('/message/like-dislike',options).then(res=>res.json())
        .then(data=>
        {
            console.log('...');
        })

        //a user must have a record of the liked and disliked messages
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
                        <div className='sort-messages'>Sort By: <span onClick={()=>this.sortBy(1)}>Litt's</span>&nbsp;&nbsp;<span onClick={()=>this.sortBy(2)}>Oldest</span></div>
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
                                    <div className='message-blurb'>
                                    <Message 
                                        key={i}
                                        rank={message.rank} 
                                        messageData={message} 
                                        likeBtn={(val,id)=>this.handleLike(val,id)}
                                        openReply={(value,id)=>{this.handleReply(value,id)}} 
                                    />
                                    {
                                        this.state.replies[message._id]
                                        ?
                                        <div className={'replies'}>
                                            {
                                        this.state.replies[message._id].map((reply,j)=>
                                        {
                                            return(
                                            <Message
                                                key={j}
                                                rank={reply.rank}
                                                messageData={reply}
                                                openReply={(value,id,rank)=>{this.handleReply(value,id,rank)}} 
                                            />
                                                )
                                        })}
                                        </div>
                                        :
                                        null
                                    }
                                    </div>
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
                        onChange={(e)=>this.handleChange(e.target.value,1)}
                        value={this.state.message}
                    />
                        <InputGroup.Append>
                            <Button 
                                variant="outline-success"
                                onClick={()=>this.submitMessage(0)}
                            >
                                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Card>
                    <Modal show={this.state.modalReply} onHide={this.cancelReply}>
                        <Modal.Header closeButton>
                            <Modal.Title>Submit Reply</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {
                            /*
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
                            */
                         }           
                            <FormControl
                                autoFocus={true}
                                placeholder="Type Your Reply"
                                aria-label="message"
                                maxLength='140'
                                as='textarea'
                                onChange={(e)=>this.handleChange(e.target.value,0)}
                                value={this.replyMessage}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={()=>this.submitMessage(1)}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {/**Make a Seperate Modal Component/File??*/}
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Topic;