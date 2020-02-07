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

const tagi = Math.round(Math.random() * 100000);

export default function Quiz({history, match}) {
  const {state} = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [data, setData] = useState([]);
  const [title, setTitle] = useState()

  /* const getQuiz = (match) => {
    if (match.params.quiz_badge) {
      return {quiz_badge: match.params.quiz_badge}
    } else if (match.params.title) {
      return {title: match.params.title}
    } else  if (match.params.quiz_author) {
      return {quiz_author: parseInt(match.params.quiz_author)}
    } 
  }
 */
  console.log(title)
  console.log(data)

  const socket = socketIOClient("http://localhost:5001");
  
  socket.on("eventMessageStudent", message => {
    setMessage(message);
    if (message.quiz_author === match.params.quiz_author) {
      sessionStorage.removeItem("quizID")
      sessionStorage.setItem("start", message.quiz_badge)
      sessionStorage.setItem("teacher", message.quiz_author)
      sessionStorage.setItem("quizID", message.quiz_badge)
      
      let object = {badge: message.quiz_badge}
      getStudentQs(object).then(res => {
        setData(res.question)
        setTitle(res.result)
        })
      } else {
        console.log("moi")
      }
  });

  const submitClick = () => {
    socket.emit("submitClick", ev => {
      console.log("submit click lähtetty", ev);
    })
  }

  const badge = {badge: sessionStorage.getItem("start")};

  useEffect(() => {
    getStudentQs(badge).then(res => {
      setData(res.question)
      setTitle(res.result)});
  }, []);

  const createDataArray = (array, marker) => {
    
    let newOne = array.sort((a, b) => a.id - b.id)

    if (marker) {
      return newOne.map((item) => {
        console.log("sortattu" + item)
        return item.id
      })
    } else {
      return newOne.map((item) => {
        return item.resultText
      })
    }
  }


  if (sessionStorage.getItem("start") && data && match.params.quiz_author === sessionStorage.getItem("teacher")) {
    
    return (
      <div className="container">
        <h2 className="text-white">{title ? title[0].title : null} </h2>
        <Formik
          initialValues={{nickname: "", question_ids: [], user_answer: [], result_tag: tagi, quiz_badge: badge.badge}}
          validationSchema={quizSchema}
          onSubmit={(values, { setSubmitting }) => {
            values.question_ids = createDataArray(state.pointList, message);
            values.user_answer = createDataArray(state.pointList);
            sessionStorage.setItem('studentTag', tagi)
            setSubmitting(true);
            setTimeout(() => {
              console.log("submit tapahtuu")
              postScores(values)
              .then(sessionStorage.removeItem("start"))
              .then(() => setData([]))
              .then(() => setTitle())
              .then(() => {history.push({
                pathname: "/student/results",
                state: {values:values, data:data, tagi:tagi}
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
            <Form onSubmit={handleSubmit}><div className="qnbox">
              
              {data && data.length > 0 && data.map((result, index) => {
                  return (
                      <Question
                      index={index}
                      result={result}
                      key={result.id}
                      />
                  );
                })}
              
              </div>
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
              
              <button className="quizSubmit" type="submit" onClick={submitClick} disabled={isSubmitting}>
                Lähetä
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
