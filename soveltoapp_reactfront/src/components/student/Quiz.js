import React, { useState, useEffect, useContext } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../../service/Request";
import Question from "./Question";
import {StoreContext} from '../../context/StoreContext'
import { uuid } from 'uuidv4';
import "../../styles/quiz.scss";

const freeTheButton = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    return false
  } 
  return true
}

const createDataArray = (array, marker) => {
  let newOne = array.sort((a, b) => a.id - b.id)

  if (marker) {
    return newOne.map((item) => item.id)
  } else {
    return newOne.map((item) => item.resultText)
  }
}

const hourCheck = (date) => {
  const hours = 1000 * 60 * 60 //* 10;
  const tenHoursAgo = Date.now() - hours;

  return date > tenHoursAgo;
}

const checkAndSetStorage = now => {
  let storageItem = {sessionID: uuid(), timestamp: Date.now()}

  if (now) {
    let pastTime = now.timestamp;
    if (!hourCheck(pastTime)) {
    localStorage.setItem('sessionKey', JSON.stringify(storageItem))}
  } else {
    localStorage.setItem('sessionKey', JSON.stringify(storageItem))
  }
}

export default function Quiz({history, match}) {
  const {state} = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [data, setData] = useState([]);
  const [title, setTitle] = useState()

  const tagItem = JSON.parse(localStorage.getItem("sessionKey"))

  const socket = socketIOClient("http://localhost:5001");

  checkAndSetStorage(tagItem)

  socket.on("eventMessageStudent", message => {
    setMessage(message);
    if (message.quiz_author === match.params.quiz_author) {
        sessionStorage.removeItem("quizID")
        sessionStorage.setItem("start", message.quiz_badge)
        sessionStorage.setItem("teacher", message.quiz_author)
        sessionStorage.setItem("quizID", message.quiz_badge)
      
        let socketObject = {badge: message.quiz_author,
                            result_tag: tagItem && tagItem.sessionID,
                            quiz_badge: message.quiz_badge}

        getStudentQs(socketObject).then(res => {
          setData(res.question)
          setTitle(res.result)
          })
      } else {
        console.log("moi")
      }
  });

  useEffect(() => {

    const tagItem = JSON.parse(localStorage.getItem("sessionKey"));
    const badge = {badge: parseInt(match.params.quiz_author),
                    result_tag: tagItem && tagItem.sessionID,
                    quiz_badge: sessionStorage.getItem("quizID")
                  };
    if (tagItem) {           
    getStudentQs(badge).then(res => {
      if (!res.question) {
        sessionStorage.removeItem('start')
        setData()
      } else {
        sessionStorage.setItem('start', res.result[0].quiz_badge)
        sessionStorage.setItem("teacher", match.params.quiz_author)
        sessionStorage.setItem("quizID", res.result[0].quiz_badge)
        setData(res.question)
        setTitle(res.result[0].title)
      }
    })} 

    return
  }, [match.params.quiz_author]);

  const submitClick = (e) => {
    e.preventDefault()
    let postData = { 
      nickname: 'nick',
      question_ids: createDataArray(state.pointList, message), 
      user_answer : createDataArray(state.pointList),
      result_tag: tagItem && tagItem.sessionID, 
      quiz_badge: sessionStorage.getItem("start")}

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
        state: {result_tag: postData.result_tag, quiz_badge: postData.quiz_badge}}))
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
