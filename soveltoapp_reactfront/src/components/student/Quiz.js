import React, { useState, useEffect, useContext } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../../service/Request";
import Question from "./Question";
import {StoreContext} from '../../context/StoreContext'
import { uuid } from 'uuidv4';
import "../../styles/quiz.scss";

const onKeyDown = (keyEvent) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    keyEvent.preventDefault();
  }
}

const freeTheButton = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    return false
  } 
  return true
}

export default function Quiz({history, match}) {
  const {state} = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [data, setData] = useState([]);
  const [title, setTitle] = useState()

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

  const badge = {badge: sessionStorage.getItem("start")};

  useEffect(() => {
    getStudentQs(badge).then(res => {
      setData(res.question)
      setTitle(res.result)});
  }, []);

  const createDataArray = (array, marker) => {
    let newOne = array.sort((a, b) => a.id - b.id)

    if (marker) {
      return newOne.map((item) => item.id)
    } else {
      return newOne.map((item) => item.resultText)
    }
  }

  const submitClick = (e) => {
    e.preventDefault()
    let postData = { 
      nickname: 'nick',
      question_ids: createDataArray(state.pointList, message), 
      user_answer : createDataArray(state.pointList),
      result_tag: uuid(), 
      quiz_badge: badge.badge }

    console.log(postData)

    postScores(postData)
      .then(res => {console.log(res)})
      .then(sessionStorage.removeItem("start"))
      .then(sessionStorage.setItem('studentTag', postData.result_tag))
      .then(socket.emit("submitClick", ev => {
        console.log("submit click lähtetty", ev);
      }))
      .then(setData([]))
      .then(setTitle())
      .then(history.push({
        pathname: "/student/results",
        state: {data:data, values: postData}}))
    }

  if (sessionStorage.getItem("start") && data && match.params.quiz_author === sessionStorage.getItem("teacher")) {

    return (
      <div className="container">
        <h2 className="text-white">{title ? title[0].title : null} </h2>
        <form>
          <div className="qnbox">             
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
              <button className="quizSubmit" type="button" onClick={submitClick} disabled={freeTheButton(state.pointList, data)}>
                Lähetä
              </button>
        </form>
      </div>
    )
  } else {
    return <div>
      <h2 id="quizFormTitle" className="detail_header">Odota hetki, tentti alkaa pian</h2></div>;
  }
}


  /*if (sessionStorage.getItem("start") && data && match.params.quiz_author === sessionStorage.getItem("teacher")) {
    
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
}*/
