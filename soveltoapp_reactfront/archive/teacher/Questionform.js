import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray, getIn } from "formik";
import { postQuestion, getTopics } from "../../service/Request";
import * as Yup from "yup";
import auth from "../../service/Auth"; 
import {Navigation} from '../../layout/Navbar';

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .min(2, "Kysymyksen täytyy sisältää vähintään kaksi merkkiä.")
    .max(255, "Kysymys ei voi olla pidempi kuin 255 merkkiä.")
    .required("Kirjoita uusi kysymys."),
  correct_answer: Yup.string()
    .min(2, "Vastauksen täytyy sisältää vähintään kaksi merkkiä.")
    .max(255, "Vastaus ei voi olla pidempi kuin 255 merkkiä.")
    .required("Anna oikea vastaus"),
  wrong_answer: Yup.array()
    .min(1, "Vähintään yksi väärä vastaus.")
    .max(3, "Enintään kolme väärää vastausta")
    .required("Vähintään yksi väärä vastaus vaaditaan")
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

  const initial = {
    question: "",
    correct_answer: "",
    wrong_answer: [""],
    topics_id: 1
  };

  console.log(initial.wrong_answer)

  if (authT) {
    return (
      <div><Navigation title={'Soveltommi'} />
      <div className="qFormContainer">
        <p className="text-white formTitle" >Luo uusi kysymys</p>
      <div className="user text-white">
        <Formik
          initialValues={initial}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            console.log(values.wrong_answer);
            //postQuestion(values);
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
              console.group("formik");
              console.log("values", values);
              console.groupEnd("formik");
              return (
              <Form className="form" onSubmit={handleSubmit}>
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

                <div>
                  {/* <br /> */}
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
                
                  {/* <br /> */}
                </div>
                <FieldArray 
                  className="wrongAns" name="wrong_answer"
                  render = {({remove, push }) => (
                    <div className="wrongAns">
                      {values.wrong_answer && values.wrong_answer.length > 0 ? (
                        <div>
                        {values.wrong_answer.map((one_wrong_answer, index) => 
                             {console.log("Yksi" + one_wrong_answer + " tämä on index " + index)
                           return (
                          <div className="row" id={index} key={index}>
                            <div className="col">
                              <label className="wrongAnsLabel" htmlFor={`wrong_answer.${one_wrong_answer}`}>Väärät vastaukset</label>
                              <Field 
                                type="text"
                                value={one_wrong_answer}
                                name={`wrong_answer.${index}`}
                                placeholder="Lisää uusi"
  
                                />
                              {errors.wrong_answer &&
                                errors.wrong_answer[index] &&
                                touched.wrong_answer &&
                                touched.wrong_answer[index] && (
                                  <div className="wrongError">
                                    {errors.wrong_answer[index]}
                                    </div>
                                )}                            
                            </div>
                            <div className="col">
                              <button
                                type="button"
                                className="qFormRemoveBtn"
                                onClick={() => remove(index)}>X
                            </button>
                          </div>
                        </div>)
                      })}
                        <button type="button" className="secondary btnLogin"
                        onClick={() => push("")}>
                        Lisää väärä vastaus
                      </button>
                        </div>
                        ) : (                      
                      <button type="button" className="secondary btnLogin"
                        onClick={() => push("")}>
                        Lisää väärä vastaus
                      </button>
                      )}
                         
                    </div>
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
      </div></div></div>
    );
  } else {
    return <Redirect to="/" />;
  }
}