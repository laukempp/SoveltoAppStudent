import React, { useState, useEffect, useContext } from "react";
import "../styles/quiz.scss";
import { StoreContext } from "../context/StoreContext";

const Question = ({ result, index }) => {
  //Määritellään komponentin tila
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selected, setSelected] = useState();

  //Otetaan käyttöön reactin useContext-hook, jota käytetään vähän kuin Reduxia eli tilan säilyttämiseen
  const { state, actions } = useContext(StoreContext);

  //Joka kerta, kun sivu renderöityy, sekoitetaan vastausten järjestystä
  useEffect(() => {
    let newArray = result.wrong_answer
      .concat(result.correct_answer)
      .map((item, index) => {
        return { option: index, answerText: item };
      });

    shuffle(newArray);
  }, [result.wrong_answer, result.correct_answer]);

  //Funktio vastausten järjestyksen sekoittamiseen
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

  //Funktio, joka tallentaa oppilaan vastaukset. setSelected poimii vastaukset, mutta oleellisempaa on data-muuttujan keräämä tieto, koska se lähetetään ja tallennetaan store-komponentin ylläpitämään arrayhin, jotta kaikki oppilaan vastaukset saadaan tallennettua. Lisää kommentointia storen puolella.
  const onChangeCheck = e => {
    setSelected({...selected, [e.target.name]: e.target.value })
    let data = {id: result.id, identifier: index, resultText: e.target.value}    
    actions.addToPointList(data, state.pointList); 
    }
    console.log(answerOptions)
  //Muotoillaan vastaussetti 
  let answers = answerOptions.map((answer, index) => {
    return (
      <div className="radioContainer" key={index}>
        <input
          id={answer.answerText}
          type="radio"
          className="ansRadioBtn"
          value={answer.answerText}
          onChange={onChangeCheck}
          name={result.id}
        />
        <label htmlFor={answer.answerText}>{answer.answerText}</label>
      </div>
    );
  });

  //Lopullinen renderöinti, jossa kysymys ja ylläoleva vastaussetin muotoileva muuttuja
  return (
    <div>
      <div className="qntxtbox">
        <b>{result.question}</b>
      </div>
      <div className="answerDiv">{answers}</div>
    </div>
  );
};

export default Question;
