import React, { useState, useEffect, useContext } from "react";
//import { Formik, Form, Field } from "formik";
import "../../styles/quiz.css";
import {StoreContext} from '../../context/StoreContext'

const Question = ({ result, index }) => {
  const {state, actions} = useContext(StoreContext);
  const [answerOptions, setAnswerOptions] = useState([]); 
  const [counter, setCounter] = useState({id: result.id, identifier: index, resultText: ""});
  const [selected, setSelected] = useState();

  console.log(state.pointList)

  let newArray = result.wrong_answer.concat(result.correct_answer).map((item, index) => {
    return {option: index, answerText: item}
  })

  console.log(newArray)

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

  /*const onChangeCheck = e => {
    setSelected({...selected, [e.target.name]: e.target.value })
    if (e.target.value === result.correct_answer) {    
      setCounter({...counter, [e.target.name]: e.target.value})    
      actions.addToPointList(counter, state.pointList);
    } if (e.target.value !== result.correct_answer) {
      setCounter({...counter, [e.target.name]: e.target.value})
      actions.addToPointList(counter, state.pointList)
     
    }
  }*/

  const onChangeCheck = e => {
    setSelected({...selected, [e.target.name]: e.target.value })
    let data = {id: result.id, identifier: index, resultText: e.target.value}    
    actions.addToPointList(data, state.pointList); 
    }
  

  

  let answers = answerOptions.map((answer, index) => {
    return (
      <div key={index}>
        <input
          type="radio"
          value={answer.answerText}
          onChange={onChangeCheck}
          name={result.id}
        />{" "}
        <label>{answer.answerText}{answer.option}</label>
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
