import React from "react";
import "../../styles/quiz.scss";

const ScoreItem = ({question, studentAnswer, id}) => {

    //Tässä muotoillaan vastausnäkymä niin, että jos oppilas on vastannut oikein, vastaus maalataan tietynväriseksi ja jos väärin niin sekä oppilaan väärä vastaus että se, mikä olisi ollut oikea vastaus, maalataan tietynvärisiksi. Funktio palauttaa html-elementtejä.
    const showResult = () => {
        return studentAnswer.map((item, index) => {
            let colorsin = {backgroundColor : "rgb(247,247,248)"}
            if (item.count === 1 && item.isCorrect === true) {
                colorsin = {backgroundColor : "#33dd22"} } else
            if (item.isCorrect === true && item.count === 0) {
                colorsin = {backgroundColor : "#90EE90"}} else
            if (item.isCorrect === false && item.count === 1) {
                colorsin = {backgroundColor : "#eedd9d"}
                }
                
            console.log("Oppilaan vastaus: " + studentAnswer)
            return (
                    <div key={index}
                    className="text-left"
                    style={colorsin}
                     >
                        {/* <input
                    type="radio"
                    className=""
                    value={item.value}
                    disabled
                    name={id}
                    />{" "} */}
                    <label className="answer"> {item.value}</label>
                </div>
                )
            }) 
        }
    
    //Esitetään tulokset
    return (
          <div className="resultBG">
              <h4 className="text-white">{question}</h4>
          <div className="resultContainer">
            
          </div>
          <div className="">
            {showResult()}
          </div>
        </div>
        )
    }

    export default ScoreItem;