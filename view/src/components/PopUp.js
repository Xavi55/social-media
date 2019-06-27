import React from 'react';

import Alert from 'react-bootstrap/Alert';

//import '../styles/Alert.css';

const PopUp=(props)=>
{
    return(
        <Alert
            show={props.show}
            variant={props.color} 
            onClose={()=>props.ClosePopUp(false)}//callback
            dismissible
        >
        <Alert.Heading>
            {/*console.log(this.props)*/}
            {props.message}
        </Alert.Heading>
        </Alert>
    )
}
export default PopUp;