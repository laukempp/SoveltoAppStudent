import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {fetchQuestions, getTopics} from '../../service/Request'
/*import auth from "../../service/Auth";
import { Redirect } from "react-router-dom";*/
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import socketIOClient from 'socket.io-client';

export default function QuizForm() {
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('')
  const [topics, setTopics] = useState([])

  const createArray = (array) => {
    return array.map(option => {
      let pip = option.id
      return pip;
    })
  }

  const handleClose = () => setShow(false);

  const buttonHappen = () => {
    const tama = createArray(questions);
    let helpMe = {idArray: tama, title: title}
    eventMessage(helpMe)
    .then(() => {handleClose()})
  }

  const socket = socketIOClient('http://localhost:5001');

  /*const eventClick = () => {
    socket.emit('eventClick', 'tämä tulee quizformista')
  }*/

  const eventMessage = (object) => {
        return new Promise((resolve, reject) => {
        socket.emit('eventMessage', object)
        resolve()
      })
  }

  const fetchTopics = () => {
    getTopics().then(res => setTopics(res))
  }
  useEffect(() => {
    fetchTopics()
  }, [])

  let topicInput = topics.map(option => {
    return (
      <option key={option.id} value={option.id} label={option.title} />
    )
  })


  let box = questions.map(option => {
    let count = 0;
    let unikey = option.id;
    return (
      <div key={option.id}>
        <div>
          <label>{option.question}</label>
        </div>
        <div>
          <input type="radio" id="correct"
            name="correct" disabled />
          <label htmlFor="correct">{option.correct_answer}</label>
        </div>
        {option.wrong_answer.map((wrongy, index) => {
          count++;
          unikey = unikey + 3;
          return (<div key={unikey}> <input type="radio" id={count} name={count} disabled />
            <label key={unikey} htmlFor={count}>{wrongy}</label>
          </div>)
        })}
      </div>
    )
  })

  const quizformSchema = Yup.object().shape({
    name: Yup.string().required("Tämä kenttä vaaditaan"),
    number: Yup.string().required("Vaaditaan numero")
  });

  return (
    <>
      <div className="user">
        <Formik
          initialValues={{name: '', topics_id: 1, number: 0 }}
          validationSchema={quizformSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            fetchQuestions(values)
              .then(res => setQuestions(res))
              .then(res => setTitle(values.name))
              .then (res => setShow(true))
            resetForm();
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
          }) => (
            <Form className="form" onSubmit={handleSubmit}>
              <div className="form__group">
              <div className="em">
                <h3 className="detail_header">Luo uusi tentti</h3>
              <span className="detail_span">Tentin nimi</span>
              <Field
                type="name"
                name="name"
                placeholder="Kyselyn nimi"
                id="kysynimi"
                className={touched.name && errors.name ? "error" : null}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.name || ""}
              /></div></div>
              <ErrorMessage
                component="div"
                name="name"
                className="invalidQName"
              />
                <span className="detail_span">Tentin aihe</span>
              <Field
                as="select"
                name="topics_id"
                id="topic_id"
                className={touched.topics_id && errors.topics_id ? "error" : null}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.topics_id}
                style={{ display: "block" }}
              >
                {topicInput}
  
              </Field>
              <div className="em">
                <span className="detail_span">Kysymysten lukumäärä</span>
              <Field
                type="number"
                name="number"
                id="kysynum"
                placeholder="Kysymysten määrä"

                className={touched.number && errors.number ? "error" : null}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.number || ""}
              /></div>
              <ErrorMessage
                component="div"
                name="number"
                className="invalidQNumber"
              />

            <div className="em">
              <button className="btnLogin" type="submit" disabled={isSubmitting}>
                Luo uusi
              </button></div>


              </Form>
            )}
        </Formik>
       {/*  <button onClick={buttonHappen}>send message</button> */}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Esikatselu</Modal.Title>
          </Modal.Header>
          <Modal.Body>{box}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Sulje
          </Button>
          <Button variant="primary" onClick={buttonHappen}>

           Lähetä quiz
          
          </Button>
          </Modal.Footer>
        </Modal>


      </div>
    </>
  );
}
