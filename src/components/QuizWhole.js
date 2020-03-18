import React, { useContext, useState } from "react";
import socketIOClient from "socket.io-client";
import { postScores } from "../service/Request";
import Question from "./Question";
import { StoreContext } from "../context/StoreContext";
import FormButton from "./FormButton";
import "../styles/quiz.scss";

//Käytetään tietokantaan lähetettävän datan muotoiluun. Funktio erottelee storen tuloslistasta id:t omaksi arrayksi ja vastaustekstit omaksi arrayksi sen mukaan, onko annettu mukaan markkeri vai ei. Funktio myös sorttaa id:t oikeaan järjestykseen, jotta backend voi myöhemmin suorittaa tuloslaskun oikein
const createDataArray = (array, marker) => {
  let newOne = array.sort((a, b) => a.id - b.id);

  if (marker) {
    return newOne.map(item => item.id);
  } else {
    return newOne.map(item => item.resultText);
  }
};

const QuizWhole = ({ formProps }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const { state } = useContext(StoreContext);
  const { questions, title, tagTestItem, history } = formProps;

  //Muodostetaan socket-clientti
  const socket = socketIOClient("http://localhost:5001");

  //Kaikki, mitä tapahtuu, kun tulokset lähetetään tietokantaan. Ensin muodostetaan tulosolio, sitten lähetetään se kantaan. Sitten poistetaan storagesta tentin näyttämiseehn tarvittavat tagit. Sitten lisätään opiskelijatagi sessionStorageen - tällä haetaan tuloksia. Sitten lähetetään opettajalle sokettiviesti, että opiskelija on tallentanut tulokset. Sitten pyyhitään komponentin tila tyhjäksi ja lopuksi ohjataan tulos-sivulle.
  const submitClick = e => {
    e.preventDefault();
    if (state.pointList.length < questions.length) {
      setMessage("Muistithan vastata kaikkiin kysymyksiin!");
    } else {
      let postData = {
        nickname: sessionStorage.getItem("nickname"),
        question_ids: createDataArray(state.pointList, "marker"),
        user_answer: createDataArray(state.pointList),
        result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
        quiz_badge: sessionStorage.getItem("start")
      };

      postScores(postData)
        .then(res => {
          if (res.nickname) {
            setTimeout(() => {
              history.push({
                pathname: "/student/results",
                state: {
                  result_tag: postData.result_tag,
                  quiz_badge: postData.quiz_badge
                }
              });
            }, 2000);
          }
          setShow(true);
        })
        .then(sessionStorage.removeItem("start"))
        .then(sessionStorage.removeItem("sessionKey"))
        .then(sessionStorage.setItem("studentTag", postData.result_tag))
        .then(
          socket.emit("submitClick", ev => {
            console.log("submit click lähtetty", ev);
          })
        );
    }
  };

  const buttonClassChanger = () => {
    let value;
    if (state.pointList.length === questions.length){
      value = "quizSubmit"
    }
    else{
      value = "quizSubmit_allNotAnswered";
    }
    return value
  }

  if (show) {
    return (
      <div>
        <h3 className="text-white">Tentti lähetetty!</h3>
      </div>
    );
  } else {
  
    return (
      <div className="container">
        <h2 className="text-white">{title} </h2>
        <div className="text-white">
          Hei {sessionStorage.getItem("nickname")}! Tervetuloa tekemään tenttiä.
        </div>
        <form>
          <div className="qnbox">
            {questions &&
              questions.length > 0 &&
              questions.map((result, index) => {
                return (
                  <Question
                    index={index}
                    result={result}
                    key={result.id}
                    setMessage={setMessage}
                  />
                );
              })}
          </div>
          <div className="text-white">{message ? message : null}</div>
          <FormButton
            buttonProps ={{
                buttonText: "Lähetä",
                buttonClass: buttonClassChanger(),
                handleClick: submitClick,
                
            }}/>       
        </form>
      </div>
    );
  }
};

export default QuizWhole;
