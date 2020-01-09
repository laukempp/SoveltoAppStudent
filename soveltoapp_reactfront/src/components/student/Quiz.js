import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../../service/Request";
import Question from "./Question";
import {StoreContext} from '../../context/StoreContext'
import "../../styles/quiz.css";

export default function Quiz({history}) {
  const {state} = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [questions, setQuestions] = useState([]);

  const socket = socketIOClient("http://localhost:5001");
  socket.on("eventMessageStudent", message => {
    setMessage(message);
    getStudentQs(message).then(res => setQuestions(res));
    sessionStorage.setItem("started", message.idArray);
  });

  let newObject = { idArray: [] };
  newObject["idArray"] = JSON.parse("[" + sessionStorage.getItem("started") + "]");

  useEffect(() => {
    getStudentQs(newObject).then(res => setQuestions(res));
  }, []);

  const quizSchema = Yup.object().shape({
    nickname: Yup.string()
      .required("Nimimerkki täytyy valita")
      .min(2, "Kaksi kirjainta vähintään olis hyvä!")
      .max(20, "Liikaa merkkejä")
  });

  if (sessionStorage.getItem("started")) {
    const studentQs = questions.map((result, index) => {
      return (
        <Question
          index={index}
          result={result}
          key={result.id}
        />
      );
    });

    return (
      <div className="container">
        <h2>{message.title}</h2>
        <Formik
          initialValues={{nickname: "", score: []}}
          validationSchema={quizSchema}
          onSubmit={(values, { setSubmitting }) => {
            values.score = state.pointList;
            setSubmitting(true);
            setTimeout(() => {
              postScores(values);
            })
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
                type="text"
                name="nickname"
                placeholder="Nimimerkki"
                className={touched.nickname && errors.nickname ? "error" : null}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.nickname || ""}
              />
              <ErrorMessage
                component="div"
                name="nickname"
                className="invalidQName"
              />
              <div className="qnbox">{studentQs}</div>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  } else {
    return <div>
      <h2 className="detail_header">Odota hetki, tentti alkaa pian</h2></div>;
  }
}
