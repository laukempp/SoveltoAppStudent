import React, { useState, useEffect, useContext } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs, postScores } from "../service/Request";
import Question from "./Question";
import { StoreContext } from "../context/StoreContext";
import "../styles/quiz.scss";

//Submit-nappi on disabled aina siihen asti, että on vastattu kaikkiin kysymyksiin - tarkistaa siis, että vastaus-array on samanpituinen kuin kysymys-array
const freeTheButton = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    return false;
  }
  return true;
};

//Käytetään tietokantaan lähetettävän datan muotoiluun. Funktio erottelee storen tuloslistasta id:t omaksi arrayksi ja vastaustekstit omaksi arrayksi sen mukaan, onko annettu mukaan markkeri vai ei. Funktio myös sorttaa id:t oikeaan järjestykseen, jotta backend voi myöhemmin suorittaa tuloslaskun oikein
const createDataArray = (array, marker) => {
  let newOne = array.sort((a, b) => a.id - b.id);

  if (marker) {
    return newOne.map(item => item.id);
  } else {
    return newOne.map(item => item.resultText);
  }
};

export default function Quiz({ history, match }) {
  const { state } = useContext(StoreContext);
  const [message, setMessage] = useState({});
  const [data, setData] = useState();
  const [title, setTitle] = useState();

//Tarkistetaan, löytyykö localStoragesta sessioData. Jos ei löydy, siirretään opiskelija sivulle, joka hoitaa sessioDatan tallennuksen, koska ilman sessioDataa, ei ole oikeutta nähdä tenttiä
if (!localStorage.getItem("sessionKey")) {
  let message =
    "Hei! Oletko käyttämässä sovellusta ensi kertaa tai pitkän ajan jälkeen? Ole hyvä ja täytä nimimerkki ja tunnusnumero, minkä jälkeen pääset tekemään tenttejä.";
  history.push({ pathname: "/student/enter/", state: { message: message } });
} else 

//Tarkistetaan, löytyykö sessionStoragesta nimimerkkiä - se tarvitaan tulosten tallennukseen - ja jos ei löydy, ohjataan sivulle, jolla opiskelijan tulee se syöttää
if (!sessionStorage.getItem("nickname")) {
  let message =
    "Hei! Sovellus ei löytänyt nimimerkkiäsi. Ole hyvä ja syötä nimimerkki sekä opettajanumero, jotta pääset tekemään tenttejä.";
  history.push({ pathname: "/student/enter/", state: { message: message } });
}

  //Väliaikainen ratkaisu testaamiseen. Normitilanteessa opiskelija ei voi lähettää tuloksia kuin kerran yhdestä ikkunasta, mutta testejä varten tarvitaan toistaiseksi useampi ikkuna, josta lähettää tuloksia.
  //const tagItem = JSON.parse(localStorage.getItem("sessionKey"))
  const tagTestItem = sessionStorage.getItem("sessionKey");

  //Muodostetaan socket-clientti
  const socket = socketIOClient("http://localhost:5001");

  //Vastaanotetaan socketin viesti, verrataan viestin sisältöä urliin ja jos ne osuvat yksiin, tallennetaan sessionStorageen tarpeellinen tentin näyttämiseksi. Sitten haetaan tenttidata.
  socket.on("eventMessageStudent", message => {
    setMessage(message);
    if (message.quiz_author === match.params.quiz_author) {
      sessionStorage.removeItem("quizID");
      sessionStorage.setItem("start", message.quiz_badge);
      sessionStorage.setItem("teacher", message.quiz_author);
      sessionStorage.setItem("quizID", message.quiz_badge);

      let socketObject = {
        badge: message.quiz_author,
        result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
        quiz_badge: message.quiz_badge
      };

      getStudentQs(socketObject).then(res => {
        setData(res.question);
        setTitle(res.result);
      });
    } else {
      console.log("moi");
    }
  });

  //useEffect hakee tenttidatan ekan renderöinnin jälkeen (ekalla käytetään socket-funktion sisällä olevaa funktiota) - useEffectin sisällä tarkistetaan, että opiskelijalla on oikeus nähdä tentti (tagItem = true) ja sitten haetaan data. Jos palvelin palauttaa tyhjää, tentti on yli 10 min vanha eikä opiskejalla ole enää oikeutta nähdä sitä, joten poistetaan sessionStoragesta tentin aloittava "start" -tagi.
  useEffect(() => {
    //const tagItem = JSON.parse(localStorage.getItem("sessionKey"));
    const tagTestItem = sessionStorage.getItem("sessionKey");
    const badge = {
      badge: parseInt(match.params.quiz_author),
      result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
      quiz_badge: sessionStorage.getItem("quizID")
    };

    if (tagTestItem) {
      getStudentQs(badge).then(res => {
        if (!res.question) {
          sessionStorage.removeItem("start");
          setData();
        } else {
          sessionStorage.setItem("start", res.result[0].quiz_badge);
          sessionStorage.setItem("teacher", match.params.quiz_author);
          sessionStorage.setItem("quizID", res.result[0].quiz_badge);
          setData(res.question);
          setTitle(res.result[0].title);
        }
      });
    }

    return;
  }, [match.params.quiz_author]);

  //Kaikki, mitä tapahtuu, kun tulokset lähetetään tietokantaan. Ensin muodostetaan tulosolio, sitten lähetetään se kantaan. Sitten poistetaan storagesta tentin näyttämiseehn tarvittavat tagit. Sitten lisätään opiskelijatagi sessionStorageen - tällä haetaan tuloksia. Sitten lähetetään opettajalle sokettiviesti, että opiskelija on tallentanut tulokset. Sitten pyyhitään komponentin tila tyhjäksi ja lopuksi ohjataan tulos-sivulle.
  const submitClick = e => {
    e.preventDefault();
    let postData = {
      nickname: sessionStorage.getItem("nickname"),
      question_ids: createDataArray(state.pointList, message),
      user_answer: createDataArray(state.pointList),
      result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
      quiz_badge: sessionStorage.getItem("start")
    };

    postScores(postData)
      .then(res => {
        console.log(res);
      })
      .then(sessionStorage.removeItem("start"))
      .then(sessionStorage.removeItem("sessionKey"))
      .then(sessionStorage.setItem("studentTag", postData.result_tag))
      .then(
        socket.emit("submitClick", ev => {
          console.log("submit click lähtetty", ev);
        })
      )
      .then(setData([]))
      .then(setTitle())
      .then(
        history.push({
          pathname: "/student/results",
          state: {
            result_tag: postData.result_tag,
            quiz_badge: postData.quiz_badge
          }
        })
      );
  };

  //Tentti näytetään vain, jos storagesta löytyy start-item, komponentti sisältää dataa ja urlin params vastaa sessionStorageen tallennettua opettajatagia - muuten näytetään "Odota tenttiä"
  if (
    sessionStorage.getItem("start") &&
    data &&
    match.params.quiz_author === sessionStorage.getItem("teacher")
  ) {
    return (
      <div className="container">
        <h2 className="text-white">{title ? title[0].title : null} </h2>
        <form>
          <div className="qnbox">
            {data &&
              data.length > 0 &&
              data.map((result, index) => {
                return (
                  <Question index={index} result={result} key={result.id} />
                );
              })}
          </div>
          <button
            className="quizSubmit"
            type="button"
            onClick={submitClick}
            disabled={freeTheButton(state.pointList, data)}
          >
            Lähetä
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2 id="quizFormTitle" className="detail_header">
          Odota hetki, tentti alkaa pian
        </h2>
      </div>
    );
  }
}
