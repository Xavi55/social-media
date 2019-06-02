import React from 'react';

import Alert from 'react-bootstrap/Alert';

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
        </div>
    )
}
export default Message;