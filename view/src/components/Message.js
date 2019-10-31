import React from 'react';

import Alert from 'react-bootstrap/Alert';

import '../styles/Message.css';

const Message =(props)=>
{
    const message = props.messageData;
    return(
        <div className={`topic-message rank-${message.rank}`}>
        <div className='blurb'>
            {
                props.rank
                ?
                null
                :
                <div className='controls'>
                    {message.likes}
                    <i 
                        onClick={()=>props.likeBtn(1,message._id)} 
                        className={`fa fa-fire ${message.likes?'liked':null}`} 
                        aria-hidden="true">
                    </i>
                    <i
                        onClick={()=>props.likeBtn(0,message._id)} 
                        className="fa fa-fire-extinguisher" 
                        aria-hidden="true">
                    </i>
                    {message.dislikes}
                </div>            
            }
            <Alert
                variant='info'    
            >
                {message.message} 
            </Alert>
            {
                //stop replies getting replies?
                message.rank
                ?null
                :
                <div className='reply-btn'>
                    <i
                        onClick={()=>props.openReply(true,message._id,message.rank+1)} 
                        className="fa fa-reply" 
                        aria-hidden="true">
                    </i>
                </div>
            }
        </div>
            <div className='message-info'>
                -{message.author} {message.timestamp}
            </div>
        </div>
    )
}
export default Message;