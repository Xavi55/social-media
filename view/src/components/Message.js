import React from 'react';

import Alert from 'react-bootstrap/Alert';

import '../styles/Message.css';

const Message =(props)=>
{

    //console.log(props);
    const message = props.messageData
    return(
        <div className='topic-message'>
        <div className='blurb'>
            <div className='controls'>
                <i className="fa fa-fire" aria-hidden="true"></i>
                <i className="fa fa-fire-extinguisher" aria-hidden="true"></i>
            </div>
            <Alert
                variant='info'    
            >
                {message.message} 
            </Alert>
            <div className='reply-btn'>
                <i className="fa fa-reply" aria-hidden="true"></i>
            </div>
        </div>
            <div className='message-info'>
                -{message.author} {message.timestamp}
            </div>
        </div>
    )
}
export default Message;