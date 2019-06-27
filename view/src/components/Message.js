import React from 'react';

import Alert from 'react-bootstrap/Alert';

import '../styles/Message.css';

const Message =(props)=>
{

    //console.log(props);
    const message = props.messageData
    return(
        <div className='topic-message'>
            <Alert
                variant='info'    
            >
                {message.message} 
            </Alert>
            <div className='message-info'>
                -{message.author} {message.timestamp}
            </div>
        </div>
    )
}
export default Message;