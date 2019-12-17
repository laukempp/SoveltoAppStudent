import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import auth from "../../service/Auth";
import {fetchQuestions} from '../../service/Request'
import { Redirect } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function QuizForm() {
  const [questions, setQuestions] = useState([]);
  const [quizT, setQuizT] = useState('')
  const [show, setShow] = useState(false);
  const [newQuiz, setNewQuiz] = useState({})

  const handleClose = () => setShow(false);

  const createQuiz = (questions, title) => {
    let question = questions.map(item => {
      return item.question
    })
    let correct = questions.map(item => {
      return item.correct_answer})

    let answers = questions.map(item => {
      return [item.wrong_answer[0], item.wrong_answer[1], item.wrong_answer[2], item.correct_answer]
    })

    return ({title, question, correct, answers})
  }

  let box = questions.map(option => {
      return (
        <div key={option.id}>
          <label>{option.question}</label>
          <input type="radio" id="correct"
          name="correct"/>
          <label htmlFor="correct">{option.correct_answer}</label>
          <input type="radio" id="wrong1"
          name="wrong1"/>
          <label htmlFor="wrong1">{option.wrong_answer[0]}</label>
          <input type="radio" id="wrong2"
          name="wrong2"/>
          <label htmlFor="wrong2">{option.wrong_answer[1]}</label>
          <input type="radio" id="wrong3"
          name="wrong3"/>
          <label htmlFor="wrong3">{option.wrong_answer[2]}</label>
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
              .then(res => setQuizT(values.name))
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
                <option value="1" label="React" />
                <option value="2" label="Angular" />
                <option value="3" label="Scrum" />
                <option value="4" label="Students" />
  
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

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>{box}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createQuiz(questions, quizT)}>
            Send Quiz
          </Button>
        </Modal.Footer>
      </Modal>
      

      </div>
    </>
  );
}
