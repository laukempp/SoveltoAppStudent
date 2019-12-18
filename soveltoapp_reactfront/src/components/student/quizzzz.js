import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs } from "../../service/Request";
import Question from "./questionnnnn";
import "../../styles/quiz.css";
export default function Quiz() {
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  //   const [score, setScore] = useState(0)

  //   const score = 0;

  useEffect(() => {
    getQuestions();
  }, []);
  const getQuestions = () => {
    getStudentQs().then(res => setQuestions(res));
  };
  console.log(questions);

  const studentQs = questions.map(result => {
    return <Question result={result} key={result.id} />;
  });

  return (
    <div className="container">
      <form>
        <div className="qnbox">{studentQs}</div>

        <button type="submit"> Submit my answers </button>
      </form>
    </div>
  );
}

// onClick={handleCreateClick}
