import React from "react";
import "../../styles/quiz.scss";

const ScoreItem = ({question, studentAnswer, id}) => {

    const showResult = () => {
        return studentAnswer.map((item, index) => {
            let colorsin = {backgroundColor : "#fff"}
            if (item.count === 1 && item.isCorrect === true) {
                colorsin = {backgroundColor : "#33dd22"} } else
            if (item.isCorrect === true && item.count === 0) {
                colorsin = {backgroundColor : "#90EE90"}} else
            if (item.isCorrect === false && item.count === 1) {
                colorsin = {backgroundColor : "#ff009d"}
                }
                
            console.log("Oppilaan vastaus: " + studentAnswer)
            return (
                    <div key={index}
                    className={index}
                    style={colorsin}
                     >
                        <input
                    type="radio"
                    value={item.value}
                    name={id}
                    />{" "}
                    <label>{item.value}</label>
                </div>
                )
            }) 
        }

    return (
          <div>
          <div className="qntxtbox">
            <b>{question}</b>
          </div>
          <div className="answerDiv">
            {showResult()}
          </div>
        </div>
        )
    }

    export default ScoreItem;