import React, {useState} from 'react'
import socketIOClient from 'socket.io-client';
export default function Quiz() {
    const [message, setMessage] = useState ('');
    const socket = socketIOClient('http://localhost:5001');
     socket.on('eventMessageStudent', (message) => {
        console.log('saapunut viesti', message)
        messageSocket = message;
        console.log(messageSocket);
        setMessage(message);
    })
    /* .then(message => messageReturner(message)) */
   let messageSocket = message
    
    return (
        <div>
            FUNCTIONAALINEN QUIZ {messageSocket}
        </div>
    )
}

export default Quiz;
