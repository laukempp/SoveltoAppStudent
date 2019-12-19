import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../../service/Request";
import Question from "./Question";
import "../../styles/quiz.css";

export default function Quiz({history}) {
  const [message, setMessage] = useState({});
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isDir, setIsDir] = useState(false)

  let newObject = { idArray: [] };
  let scoreObject = {nickname: '', score: []};
  let pointArray = [];

  const socket = socketIOClient("http://localhost:5001");
  socket.on("eventMessageStudent", message => {
    setMessage(message);
    getStudentQs(message).then(res => setQuestions(res));
    sessionStorage.setItem("started", message.idArray);
    sessionStorage.setItem("title", message.title);
  });

  let newmessage = JSON.parse("[" + sessionStorage.getItem("started") + "]");
  newObject["idArray"] = newmessage;

  const toggle = (values) => {
    return new Promise(resolve => {
        setOpen(!open)
        resolve("näkyykö")
    })
  }

  useEffect(() => {
    getStudentQs(newObject).then(res => setQuestions(res));
  }, []);

  const collectPoints = point => {
    sessionStorage.removeItem('pimpeliPom')
    pointArray.push(point);
    let length = pointArray.length;
    let helpArray = pointArray.reduce((a, b) => a + b, 0)
    let toinenApu = parseInt(helpArray/length*100);
    sessionStorage.setItem('pimpelipom', toinenApu)
}

const createObject =(one1, one2) => {
    scoreObject["score"] = parseInt(one2);
    scoreObject["nickname"] = one1;
    return scoreObject
}

  const quizSchema = Yup.object().shape({
    nickname: Yup.string()
      .required("Valitse nyt joku nimimerkki, jookoskookos")
      .min(5, "Viisi kirjainta vähintään olis hyvä!")
      .max(20, "No niin, ei liioitella noilla merkeillä")
  });

  if (sessionStorage.getItem("started")) {
    const studentQs = questions.map(result => {
      return (
        <Question
          result={result}
          key={result.id}
          collectPoints={collectPoints}
          open={open}
        />
      );
    });

    return (
      <div className="container">
        <h2>{sessionStorage.getItem("title")}</h2>
        <Formik
          initialValues={{ nickname: "", score: pointArray}}
          validationSchema={quizSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            toggle()
            .then(() => {sessionStorage.setItem('piip', values.nickname)})
            .then(() => {postScores(createObject(sessionStorage.getItem('piip'),
                sessionStorage.getItem('pimpelipom')))})
            .then(() => {history.push({
                pathname: "/student/results",
                state: {}
            })})
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
