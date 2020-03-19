import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { getStudentQs } from "../service/Request";
import QuizWhole from "./QuizWhole";
import QuizOne from "./QuizOne";

import "../styles/quiz.scss";

export default function Quiz({ history, match }) {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [load, setLoad] = useState(false)

  //Tarkistetaan, löytyykö localStoragesta sessioData. Jos ei löydy, siirretään opiskelija sivulle, joka hoitaa sessioDatan tallennuksen, koska ilman sessioDataa, ei ole oikeutta nähdä tenttiä
  if (!localStorage.getItem("sessionKey")) {
    let message =
      "Hei! Oletko käyttämässä sovellusta ensi kertaa tai pitkän ajan jälkeen? Ole hyvä ja täytä nimimerkki ja tunnusnumero, minkä jälkeen pääset tekemään tenttejä.";
    history.push({ pathname: "/student/enter/", state: { message: message } });
  }

  //Tarkistetaan, löytyykö sessionStoragesta nimimerkkiä - se tarvitaan tulosten tallennukseen - ja jos ei löydy, ohjataan sivulle, jolla opiskelijan tulee se syöttää
  else if (!sessionStorage.getItem("nickname")) {
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
    if (message.quiz_author === match.params.quiz_author) {
      sessionStorage.removeItem("quizID");
      sessionStorage.setItem("start", message.quiz_badge);
      sessionStorage.setItem("quizID", message.quiz_badge);
      sessionStorage.setItem("quizType", message.quiz_type)

      let socketObject = {
        badge: message.quiz_author,
        result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
        quiz_badge: message.quiz_badge
      };
      
      getStudentQs(socketObject).then(res => {
        setQuestions(res.question);
        setTitle(res.result[0].title);
        setType(res.result[0].quiz_type);
      });
    }
  });

  //useEffect hakee tenttidatan ekan renderöinnin jälkeen (ekalla käytetään socket-funktion sisällä olevaa funktiota) - useEffectin sisällä tarkistetaan, että opiskelijalla on oikeus nähdä tentti (tagItem = true) ja sitten haetaan data. Jos palvelin palauttaa tyhjää, tentti on yli 10 min vanha eikä opiskejalla ole enää oikeutta nähdä sitä, joten poistetaan sessionStoragesta tentin aloittava "start" -tagi.
  useEffect(() => {
    console.log('Sinäkö siellä')
    //const tagItem = JSON.parse(localStorage.getItem("sessionKey"));
    const tagTestItem = sessionStorage.getItem("sessionKey");
    const badge = {
      badge: sessionStorage.getItem('teacher'),
      result_tag: tagTestItem /*tagItem && tagItem.sessionID*/,
      quiz_badge: sessionStorage.getItem("quizID")
    };

    if (tagTestItem) {
      getStudentQs(badge).then(res => {
        if (!res.question) {
          sessionStorage.removeItem("start");
        } else {
          sessionStorage.setItem("start", res.result[0].quiz_badge);
          sessionStorage.setItem("quizID", res.result[0].quiz_badge);
          sessionStorage.setItem("quizType", res.result[0].quiz_type)
          setQuestions(res.question);
          setTitle(res.result[0].title);
          setType(res.result[0].quiz_type);
        }
      });
    }

    return;
  }, []);

  //Kootaan lapsikomponenteille lähetettävät tiedot
  const formProps = {
    questions: questions,
    title: title,
    tagTestItem: tagTestItem,
    history: history
  };

  //Tentti näytetään vain, jos storagesta löytyy start-item, komponentti sisältää dataa ja urlin params vastaa sessionStorageen tallennettua opettajatagia - muuten näytetään "Odota tenttiä"
  if (
    sessionStorage.getItem("start") &&
    questions[0] &&
    match.params.quiz_author === sessionStorage.getItem("teacher") &&
    !type
  ) {
    return (
      <div>
        <QuizWhole formProps={formProps} />
      </div>
    );
  } else if (
    sessionStorage.getItem("start") &&
    questions[0] &&
    match.params.quiz_author === sessionStorage.getItem("teacher") &&
    type
  ) {
    return (
      <div>
        <QuizOne formProps={formProps} />
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
