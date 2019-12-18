import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs } from "../../service/Request";
import Question from "./Question";
export default function Quiz() {
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const socket = socketIOClient("http://localhost:5001");
  socket.on("eventMessageStudent", message => {
    console.log("saapunut viesti", message);
    messageSocket = message;
    console.log(messageSocket);
    setMessage(message);
  });
  /* .then(message => messageReturner(message)) */

  let messageSocket = message;

  useEffect(() => {
    getQuestions();
  }, []);
  const getQuestions = () => {
    getStudentQs().then(res => setQuestions(res));
  };
  console.log(questions);
  if (message === false) {
    console.log(questions);

    const studentQs = questions.map(result => {
      return <Question result={result} />;
    });

    return (
      <form className="">
        <span>{studentQs}</span>

        <button type="submit"> </button>
      </form>
    );
  } else {
    return <div>ei oikeuksia {messageSocket}</div>;
  }
}
