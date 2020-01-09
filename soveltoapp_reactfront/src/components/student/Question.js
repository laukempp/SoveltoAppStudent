import React, { useState, useEffect, useContext } from "react";
//import { Formik, Form, Field } from "formik";
import "../../styles/quiz.css";
import {StoreContext, StoreProvider} from '../../context/StoreContext'

const Question = ({ result, index }) => {
  const {state, actions} = useContext(StoreContext);
  const [answerOptions, setAnswerOptions] = useState([]); 
  const [counter, setCounter] = useState({id: result.id, identifier: index, point: 0});
  const [selected, setSelected] = useState();

  console.log(state.pointList)

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
    setSelected({...selected, [e.target.name]: e.target.value })
    if (e.target.value === result.correct_answer) {
      setCounter({...counter, point: 1})
      actions.addToPointList(counter, state.pointList);
    } if (e.target.value !== result.correct_answer) {
      setCounter({...counter, point: 0})
      actions.addToPointList(counter, state.pointList);
    }
  }

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
