import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { postQuestion, getTopics } from "../../service/Request";
import * as Yup from "yup";
import auth from "../../service/Auth";

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
  const authT = auth.sessionStorageGetItem();

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

  if (authT) {
    return (
      <div>
        <Formik
          initialValues={{
            question: "",
            correct_answer: "",
            wrong_answer: [""],
            topics_id: 1
          }}
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
          }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  as="select"
                  name="topics_id"
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
                  placeholder="Enter the question here"
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
                  placeholder="Give correct answer here"
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
                <FieldArray name="wrong_answer"
                  render={({ insert, remove, push }) => (
                    <div>
                      {values.wrong_answer.length > 1 &&
                        values.wrong_answer.map((one_wrong_answer, index) => (
                          <div className="row" key={index}>
                            <div className="col">
                              <label htmlFor={`wrong_answer.${index}`}>Wrong Answer</label>
                              <Field name={`wrong_answer.${index}`}

                                placeholder="Add another"
                                type="text" />
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
                          </div>
                        ))}
                      <button type="button" className="secondary"
                        onClick={() => push({ wrong_answer: "Add another" })}>
                        Add another wrong answer
                  </button>
                    </div>
                  )}
                />
                <br />
                <button onClick={event => {
                  event.preventDefault();
                  handleReset();
                }}
                >Reset</button>



                <div className="input-row">
                  <button type="submit" disabled={isSubmitting}>
                    Submit
              </button>
                </div>
              </Form>
            )}
        </Formik>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}