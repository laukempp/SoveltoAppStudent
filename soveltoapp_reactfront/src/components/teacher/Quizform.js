import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {fetchQuestions, getTopics} from '../../service/Request'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import socketIOClient from 'socket.io-client';

export default function QuizForm() {
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('')
  const [topics, setTopics] = useState([])

  const socket = socketIOClient('http://localhost:5001');
  const handleClose = () => setShow(false);

  const eventMessage = (object) => {
    return new Promise((resolve) => {
    socket.emit('eventMessage', object)
    resolve() })
  }

  
    socket.on("renderScore", event => {
      console.log("tässä tulee oppilaan vastausdata", event)
    })
  
  const createIdArray = (array) => {
    return array.map(option => {
      let idArray = option.id
      return idArray;})
  }

  const buttonHappen = () => {
    const tama = createIdArray(questions);
    let sendObject = {idArray: tama, title: title}
    eventMessage(sendObject)
    .then(() => {handleClose()})
  }


  /*const eventClick = () => {
    socket.emit('eventClick', 'tämä tulee quizformista')
  }*/

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
      <div className="mContainer"key={option.id}>
        <div>
          <label className="mQuestion">{option.question}</label>
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
    name: Yup.string().required("Anna tentille nimi."),
    number: Yup.number()
    .required("number is required")
    .positive("Numeron täytyy olla positiivinen luku ja suurempi kuin 0")
    .integer("Kokonaisluku, kiitos")
    .lessThan(11, "Enintään 10 kysymystä, ei kiusata oppilaita enempää")
  });

  return (
    <>
    <div className="qFormContainer text-white">
      <h3 className="detail_header formTitle">Luo uusi tentti</h3>
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
                id="quiztopic"
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
          <Button className="sendQ" onClick={buttonHappen}>
             Lähetä quiz
          </Button>
          </Modal.Footer>
        </Modal>


      </div></div>
    </>
  );
}
