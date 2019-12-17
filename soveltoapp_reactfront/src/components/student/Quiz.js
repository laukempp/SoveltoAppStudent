import React, { useState, useEffect } from 'react'
import { getStudentQs } from '../../service/Request'
import { Formik, Form, Field } from 'formik';

const Quiz = () => {


    const [studentquestions, setStudentquestions] = useState([])
    const fetchStudentQuestions = () => {
        getStudentQs().then(res => setStudentquestions(res))
    }

    useEffect(() => {
        fetchStudentQuestions()
    }, [])
    console.log(studentquestions);

    return (
        <div>
            TÄHÄN TULEE OPPILAIDEN QUIZ
        </div>
    )
}

export default Quiz;
