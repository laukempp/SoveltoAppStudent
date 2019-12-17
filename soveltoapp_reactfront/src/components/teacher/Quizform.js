import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import auth from "../../service/Auth";
import { fetchQuestions, getTopics } from '../../service/Request'
import { Redirect } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import socketIOClient from 'socket.io-client';
export default function QuizForm() {
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ title: '', idArray: [] })
  const [topics, setTopics] = useState([])

  const handleClose = () => setShow(false);
  const socket = socketIOClient('http://localhost:5001');
  let eventBoolean = false;

  const eventClick = () => {
    eventBoolean = true;
    socket.emit('eventClick', 'tämä tulee quizformista ' + eventBoolean)
  }
  const eventMessage = () => {
    eventBoolean = true;
    socket.emit('eventMessage', eventBoolean)
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
    name: Yup.string().required("This field is required."),
    number: Yup.string().required("number is required")
  });

  return (
    <>
      <div>
        <Formik
          initialValues={{ name: "", number: 0, topic_id: 1 }}
          validationSchema={quizformSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            fetchQuestions(parseInt(values.topic_id))
              .then(res => setQuestions(res))
              .then(res => setShow(true))
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
              <Form onSubmit={handleSubmit}>
                <Field
                  type="name"
                  name="name"
                  placeholder="Kyselyn nimi"
                  className={touched.name && errors.name ? "error" : null}
                  onChange={handleChange}
                  autoComplete="off"
                  onBlur={handleBlur}
                  value={values.name || ""}
                />
                <ErrorMessage
                  component="div"
                  name="name"
                  className="invalidQName"
                />

                <Field
                  as="select"
                  name="topic_id"
                  className={touched.topic_id && errors.topic_id ? "error" : null}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.topic_id}
                  style={{ display: "block" }}
                >
                  {topicInput}

                </Field>

                <Field
                  type="number"
                  name="number"
                  className={touched.number && errors.number ? "error" : null}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.number || ""}
                />
                <ErrorMessage
                  component="div"
                  name="number"
                  className="invalidQNumber"
                />

                <button type="submit" disabled={isSubmitting}>
                  Submit
              </button>

              </Form>
            )}
        </Formik>
        <button onClick={eventClick}>start student</button>
        <button onClick={eventMessage}>send message</button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>{box}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>

            <Button variant="primary">

              Send Quiz
          </Button>
          </Modal.Footer>
        </Modal>


      </div>
    </>
  );
}
