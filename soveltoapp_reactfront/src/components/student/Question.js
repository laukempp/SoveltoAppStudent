import React, { useState, useEffect, useContext } from "react";
import "../../styles/quiz.scss";
import {StoreContext} from '../../context/StoreContext'

const Question = ({ result, index, studentAnswer, helperVar}) => {
  const {state, actions} = useContext(StoreContext);
  const [answerOptions, setAnswerOptions] = useState([]); 
  const [selected, setSelected] = useState();

  let helperIndex = 0;

  var bgColors = { "Default": "#81b71a",
                    "Blue": "#00B1E1",
                    "Cyan": "#37BC9B",
                    "Green": "#8CC152",
                    "Red": "#E9573F",
                    "Yellow": "#F6BB42",
};

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

  const showResult = () => {
      return answerOptions.map((answer, index) => {
        let colorsin = {backgroundColor : "#f5f5f5"}
      if (answer.answerText === studentAnswer && answer.answerText === result.correct_answer) {
          colorsin = {backgroundColor : "#008000"} } 
      if (answer.answerText === studentAnswer) {
            colorsin = {backgroundColor : "#E9573F"}}
      if (result.correct_answer === answer.answerText && studentAnswer !== result.correct_answer) {
        colorsin = {backgroundColor : "#90EE90"}
      }
          console.log("Oppilaan vastaus: " + studentAnswer)
          console.log("Oikea vastaus: " + result.correct_answer)
        return (
          <div key={index}
               className={index}
               style={colorsin}
               >
            <input
              type="radio"
              value={answer.answerText}
              onChange={onChangeCheck}
              name={result.id}
            />{" "}
            <label>{answer.answerText}</label>
          </div>
        )} 
      )}

  let answers = answerOptions.map((answer, index) => {
    return (
      <div key={index}
           >
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

  if (helperVar) {
    return (
      <div>
      <div className="qntxtbox">
        <b>{result.question}</b>
      </div>
      <div className="answerDiv">
        {showResult()}
      </div>
    </div>
    )

  } else {
  return (
    <div>
      <div className="qntxtbox">
        <b>{result.question}</b>
      </div>
      <div className="answerDiv">
        {answers}
      </div>
    </div>
  )}
}

export default Question;
