import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import "../../styles/quiz.css";

const Question = ({ result }) => {
  const [singlequestion, setsingleQuestion] = useState();
  const [counter, setCounter] = useState(0);
  //   const [answerChosen, setAnswerChosen] = useState("");
  console.log(result);

  let arrayy = [result.correct_answer];
  const answers = result.wrong_answer.map(result_ => {
    arrayy.push(result_);
  });

  //   const value = 0;

  //   const radioChangeHandler = event => {};


  const shuffle = arr => {
    let i, j, temp;
    for (i = answers.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  };
  const shuffled = shuffle(arrayy);

  const shuffledAnswers = shuffled.map(input => {
    return (
      <div>
        <input type="radio" value={input} /> <label>{input}</label>
      </div>
    );
  });

  return (
    <div>
      <div className="qntxtbox">
        <b>{result.question}</b>
      </div>
      <div className="answerDiv">{shuffledAnswers}</div>
    </div>
  );
};
export default Question;