import React from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import '../styles/AddTopic.css';

class AddTopic extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            topicName:'',
            subtext:'',
            timestamp:'',
            session:{},
            logged:false
        };
    }

    handleChange=(e,val)=>
    {
        switch(e)
        {
            case 'topicName':
                this.setState({topicName:val});
                break;
            case 'subtext':
                this.setState({subtext:val});
                break
            default:
                console.log('defaulted');
        }
    }
    
    handleSumbit=()=>
    {
        if(this.state.topicName.length===0 || this.state.subtext.length===0)
        {
            alert('All Fields are required!');
        }
        else
        {
            if(this.state.logged)
            {
                const options=
                {
                    method:'POST',
                    body:JSON.stringify({
                        'topicName':this.state.topicName,
                        'subtext':this.state.subtext,
                        'author':this.state.session.username,
                        'timestamp':this.state.timestamp
                    }),
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                        }
                };  

                fetch('/addTopic',options)
                .then(res=>res.json())//preProcess
                .then(data=>{
                    if(data.pass)
                    {
                        alert(data.mess);
                        this.props.history.push(`/topic/${data.topicName}`);//redirect
                        //NEED TO PASS PROPS???
                    }
                });
            }
            else
            {
                alert('Make sure to login!');
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
                console.log('user is logged');
                this.setState({
                    session:data.session, 
                    logged:true
                });
            }
        })
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

    componentWillMount()
    {
        this.loginCheck();
        this.getDate();
    }
    
    render()
    {
        return(
            <div id='addTopic'>
            <Card>
                <Card.Header>Enter your Topic</Card.Header>
                <Card.Body>
                    <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl 
                        autoFocus
                        onChange={(e)=>this.handleChange('topicName',e.target.value)}
                    />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Prepend>
                        </InputGroup.Prepend>
                        <FormControl 
                            as="textarea" 
                            placeholder='Details..'
                            onChange={(e)=>this.handleChange('subtext',e.target.value)}
                        />
                    </InputGroup>
                </Card.Body>
                <Button variant="primary" onClick={this.handleSumbit}>Sumbit</Button>
            </Card>
        </div>
        )
    }
}
export default AddTopic;