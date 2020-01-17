import React, { useState, useEffect, useContext } from "react";
import "../../styles/quiz.scss";
import {StoreContext} from '../../context/StoreContext'

const Question = ({ result, index }) => {
  const {state, actions} = useContext(StoreContext);
  const [answerOptions, setAnswerOptions] = useState([]); 
  const [selected, setSelected] = useState();

  let newArray = result.wrong_answer.concat(result.correct_answer).map((item, index) => {
    return {option: index, answerText: item}
  })

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
        <label>{answer.answerText}</label>
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
