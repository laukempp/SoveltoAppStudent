import React, { useState, useEffect } from "react";
//import { Formik, Form, Field } from "formik";
import "../../styles/quiz.css";

const Question = ({ result, collectPoints, open }) => {
  const [answerOptions, setAnswerOptions] = useState([]); 
  const [counter, setCounter] = useState(0);
  const [selected, setSelected] = useState();
  let moi = 0;

  let newArray = result.wrong_answer.concat(result.correct_answer)

  useEffect(() => {
    shuffle(newArray)
  }, [])

  const shuffle = arr => {
    let i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    setAnswerOptions(arr);
  };

  const onChangeCheck = e => {
    console.log('moi')
    setSelected({...selected, [e.target.name]: e.target.value })
    if (e.target.value === result.correct_answer) {
      setCounter(1)
    } if (e.target.value !== result.correct_answer) {
      setCounter(0)
    }
  }

  if (open) {
    collectPoints(counter)
  }

  console.log("tämä on laskin" + counter)

  let answers = answerOptions.map((answer, index) => {
    return (
      <div key={index}>
        <input
          type="radio"
          value={answer}
          onChange={onChangeCheck}
          name={result.id}
        />{" "}
        <label>{answer}</label>
      </div>
    );
  })


  return (
    <div>
      <div className="qntxtbox">
        <b>{result.question}</b>
      </div>
      <div className="answerDiv">
        {answers}
      </div>
    </div>
  );
};
export default Question;
