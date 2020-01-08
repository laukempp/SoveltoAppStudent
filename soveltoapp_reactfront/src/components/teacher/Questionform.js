import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray, getIn } from "formik";
import { postQuestion, getTopics } from "../../service/Request";
import * as Yup from "yup";
/* import auth from "../../service/Auth"; */

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .min(2, "Question must have a at least two characters")
    .max(255, "Must be shorter than 255")
    .required("This field is required"),
  correct_answer: Yup.string()
    .min(2, "Must have at least two characters")
    .max(255, "Must be shorter than 255")
    .required("This field is required"),
  wrong_answer: Yup.string()
    .min(2, "Must have at least two characters")
    .max(255, "Must be shorter than 255")
    .required("At least one is required")
});

export default function QuestionForm() {
  const authT = "heippa" 
  //auth.sessionStorageGetItem();

  const [topics, setTopics] = useState([])
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

  const initial = {
    question: "",
    correct_answer: "",
    wrong_answer: [
      {wrong: ""}
    ],
    topics_id: 1
  };

  if (authT) {
    return (
      <div className="user text-white">
        <Formik
          initialValues={initial}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            console.log(values);
            postQuestion(values);
            resetForm();
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            handleReset
          }) => {
              console.log(values.wrong_answer + " values")
              console.log(touched + " touched")
              return (
              <Form className="form" onSubmit={handleSubmit}>
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
                <Field
                  type="text"
                  name="question"
                  id="question"
                  placeholder="Kirjoita uusi kysymys"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.question}
                  className={
                    touched.question && errors.question ? "has-error" : null
                  }
                />
                <ErrorMessage
                  component="div"
                  name="question"
                  className="invalidQuestion"
                />
                <div>
                  <br />
                </div>
                <Field
                  type="text"
                  name="correct_answer"
                  id="correct_answer"
                  placeholder="Oikea vastaus tähän"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.correct_answer}
                  className={
                    touched.correct_answer && errors.correct_answer
                      ? "has-error"
                      : null
                  }
                />
                <ErrorMessage
                  component="div"
                  name="correct_answer"
                  className="invalidCorrectAnswer"
                />
                <div>
                
                  <br />
                </div>
                <FieldArray className="wrongAns" name="wrong_answer"
                  render = {({remove, push }) => (
                    <div className="wrongAns">
                      {values.wrong_answer && values.wrong_answer.length > 0 ? (
                        values.wrong_answer.map((one_wrong_answer, index) => {
                          const wrongAns = `wrong_answer[${index}]`;
                          const touchedWrongAns = getIn(touched, wrongAns);
                          const errorWrongAns = getIn(errors, wrongAns);

                          return (
                          <div className="row" id={index} key={index}>
                            <div className="col">
                              <label htmlFor={`wrong_answer.${one_wrong_answer}`}>Väärät vastaukset</label>
                              <Field 
                                type="text"
                                value={JSON.stringify()}
                                name={`wrong_answer.${JSON.stringify(index)}`}
                                placeholder="Lisää uusi"
                                className={
                                touchedWrongAns && errorWrongAns
                                ? "has-error"
                                : "wrongAns"
                                }/>                              
                              <ErrorMessage
                                component="div"
                                name="wrong_answer"
                                className="invalidWrongAnswer" />
                            </div>
                            <div className="col">
                              <button
                                type="button"
                                className="secondary"
                                onClick={() => remove(index)}>X
                            </button>
                          </div>
                          <div>
                            <button type="button" className="secondary btnLogin"
                            onClick={() => push({ wrong_answer: "Add another" })}>
                            Lisää väärä vastaus
                            </button>
                          </div>
                          </div>
                        )}) 
                        ) : (                      
                      <button type="button" className="secondary btnLogin"
                        onClick={() => push({ wrong_answer: "Add another" })}>
                        Lisää väärä vastaus
                    </button>
                        )
                  } </div>
                  )}
                />
                <br />
                <button className="btnLogin" onClick={event => {
                  event.preventDefault();
                  handleReset();
                }}
                >Tyhjennä</button>



                <div className="input-row">
                  <button className="btnLogin" type="submit" disabled={isSubmitting}>
                    Lähetä
              </button>
                </div>
              </Form>
            )}
            }
        </Formik>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}