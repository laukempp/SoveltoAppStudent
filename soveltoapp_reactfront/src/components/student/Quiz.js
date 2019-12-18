import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client';
import { getStudentQs } from '../../service/Request';
import Question from './Question';

export default function Quiz() {

    const [message, setMessage] = useState('');
    const [questions, setQuestions] = useState([]);

    const socket = socketIOClient('http://localhost:5001');
    socket.on('eventMessageStudent', (message) => {
        setMessage(message)
        sessionStorage.setItem('started', message.idArray)
        console.log(message)
    })
    /* .then(message => messageReturner(message)) */

    /*if(message) {
        sessionStorage.setItem('started', true)
    }*/

    const getQuestions = (array) => {
        getStudentQs(array).then(res => setQuestions(res))
    }
 
    console.log(questions);

    if (sessionStorage.getItem('started')) {
        let newmessage = JSON.parse("[" + sessionStorage.getItem('started') + "]")
        console.log(newmessage)
        getQuestions(newmessage)
        
        const studentQs = questions.map(result => {

            return (
                <Question result={result} />
            )
        })

        return (
            <div>
                {studentQs}
                {message.idArray}
            </div>
        )
    }
    else {
        return (
            <div>
                ei oikeuksia {message}
            </div>
        )
    }

}

