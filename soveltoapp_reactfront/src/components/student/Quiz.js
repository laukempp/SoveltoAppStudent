import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../../service/Request";
import Question from "./Question";
import {StoreContext} from '../../context/StoreContext'
import "../../styles/quiz.scss";

const onKeyDown = (keyEvent) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    keyEvent.preventDefault();
  }
}

const quizSchema = Yup.object().shape({
  nickname: Yup.string()
    .required("Nimimerkki täytyy valita")
    .min(2, "Kaksi kirjainta vähintään olis hyvä!")
    .max(20, "Liikaa merkkejä")
});

export default function Quiz({history, match}) {
  const {state} = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [questions, setQuestions] = useState([]);

  const getQuiz = (match) => {
    if (match.params.quiz_badge) {
      return {quiz_badge: match.params.quiz_badge}
    } else if (match.params.title) {
      return {title: match.params.title}
    } else  if (match.params.quiz_author) {
      return {quiz_author: parseInt(match.params.quiz_author)}
    } 
  }

  console.log(getQuiz(match))

  const socket = socketIOClient("http://localhost:5001");
  socket.on("eventMessageStudent", message => {
    let sessionItem = Math.round(Math.random() * 100000)
    setMessage(message);
    getStudentQs(getQuiz(match)).then(res => setQuestions(res));
    sessionStorage.setItem(sessionItem, message.quiz_badge);
  });

  const submitClick = () => {
    socket.emit("submitClick", ev => {
      console.log("submit click lähtetty", ev);
    })
  }

  let newObject = { question_ids: [] };
  newObject["question_ids"] = JSON.parse("[" + sessionStorage.getItem("started") + "]");

  useEffect(() => {
    getStudentQs(getQuiz(match)).then(res => setQuestions(res));
  }, []);

  const createDataArray = (array, marker) => {
    if (marker) {
      return array.map((item) => {
        return item.id
      })
    } else {
      return array.map((item) => {
        return item.resultText
      })
    }
  }

  console.log(state.pointList)

  if (sessionStorage.getItem("started") || true) {
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
        <h2 className="text-white">{message.title}</h2>
        <Formik
          initialValues={{nickname: "", question_ids: [], user_answer: []}}
          validationSchema={quizSchema}
          onSubmit={(values, { setSubmitting }) => {
            values.question_ids = createDataArray(state.pointList, message);
            values.user_answer = createDataArray(state.pointList);
            setSubmitting(true);
            setTimeout(() => {
              console.log("submit tapahtuu")
              postScores(values)
              .then(() => {history.push({
                pathname: "/student/results",
                state: {values:values, questions:questions}
            })});
              console.log(values)
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
            <Form onSubmit={handleSubmit}><div className="qnbox">{studentQs}</div>
              <div className="text-white">
              <Field
                type="text"
                name="nickname"
                id="studentNickname"
                placeholder="Kirjoita nimesi"
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
              /></div>
              
              <button type="submit" onClick={submitClick} disabled={isSubmitting}>
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
