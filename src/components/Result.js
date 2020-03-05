import React, { useState, useEffect } from "react";
import { studentScore } from "../service/Request";
import { Link } from 'react-router-dom';
import ScoreItem from "./ScoreItem";

const Result = ({ history }) => {
  const [score, setScore] = useState([]);

  //Tarkistetaan, löytyykö localStoragesta sessioData. Jos ei löydy, siirretään opiskelija sivulle, joka hoitaa sessioDatan tallennuksen, koska ilman sessioDataa, ei ole oikeutta nähdä tenttiä
  if (!localStorage.getItem("sessionKey")) {
    let message =
      "Hei! Oletko käyttämässä sovellusta ensi kertaa tai pitkän ajan jälkeen? Ole hyvä ja täytä nimimerkki ja tunnusnumero, minkä jälkeen pääset tekemään tenttejä. Tulokset voi katsoa vasta, kun tentti on suoritettu.";
    history.push({ pathname: "/student/enter/", state: { message: message } });
  } else 

  //Tarkistetaan, löytyykö sessionStoragesta nimimerkkiä - se tarvitaan tulosten tallennukseen - ja jos ei löydy, ohjataan sivulle, jolla opiskelijan tulee se syöttää
  if (!sessionStorage.getItem("nickname")) {
    let message =
      "Hei! Sovellus ei löytänyt nimimerkkiäsi. Ole hyvä ja syötä nimimerkki sekä opettajanumero, jotta pääset tekemään tenttejä. Tulokset voi katsoa vasta, kun tentti on suoritettu";
    history.push({ pathname: "/student/enter/", state: { message: message } });
  } 

  //Funktiota käytetään ensimmäiseen tuloshakuun - tapahtuu historian staten avulla
  const getResults = () => {
    const tagForResult = ((history || {}).location || {}).state;
    studentScore(tagForResult).then(res => {
        if (sessionStorage.getItem("nickname")) {
            setScore(res)
        }
    });
  };

  //useEffect hakee oppilaan tulokset sivulle joka kerta, kun sivu renderöityy
  useEffect(() => {
    let isSubscribed = true

    /*const tag = JSON.parse(localStorage.getItem("sessionKey"));*/
    const storageTag = sessionStorage.getItem("sessionKey");/*tag && tag.sessionID;*/
    const quizID = sessionStorage.getItem("quizID");

    const resultSearchTag = { result_tag: storageTag, quiz_badge: quizID };

    studentScore(resultSearchTag).then(res => {
        if(isSubscribed) {
            setScore(res)
        }
    });

    return () => isSubscribed = false;
  }, []);

  //Funktio laskee oppilaan kokonaispisteet tarkistamalla, missä kohdin oppilaan vastaus JA oikea vastaus olivat saman; niistä oppilas saa pisteen.
  const pointCounter = array => {
    let points = [];

    if (array) {
      array.forEach(item => {
        item.results.forEach(count => {
          if (count.count === 1 && count.isCorrect === true) {
            points.push(count.count);
          }
        });
      });
    }
    return (
      <div className="text-white">
        Kokonaispisteesi: {points.length}/{score.length} eli{" "}
        {Math.round((points.length / score.length) * 100)} %
      </div>
    );
  };

  //Mikäli sivulle tullaan suoraan kirjoittamalla se urliin, sillä ei ole historiaa ja vain tämä näkymä ensimmäinen renderöityy. Mikäli on historia, mutta ei dataa, renderöidään seuraava näkymä, joka käynnistää hakufunktion. Sen jälkeen on dataa ja voidaan näyttää se.
  if (!history.location.state || !localStorage.getItem("sessionKey")) {
    return <div className="text-white">Sori, ei oo tuloxii</div>;
  } else if (score && score.length <= 0) {
    return <div className="text-white">{getResults()}</div>;
  } else {
    return (
        <div>
      <div>
        {pointCounter(score)}
        {/*Tässä mapataan scoreItem-komponenttia eli luodaan tarpeellinen määrä näkymiä; niin monta näkymää kuin on kysymystä ja samalla välitetään vastaus-arrayn tiedot scoreItem-komponentille, joka käsittelee ne ja esittelee ne oikeannäköisenä. Alussa on ehto, joka määrittää, että map-funktio käynnistyy VAIN, jos score-array on olemassa ja täten sivu ei kaadu siihen, jos score-array onkin tyhjä, koska map ei silloin käynnisty*/}
        {score &&
          score.map((item, index) => {
            return (
              <ScoreItem
                index={index}
                question={item.question}
                key={item.id}
                studentAnswer={item.results}
                id={item.id}
              />
            );
          })}
      </div>
      <div>
        <br/>
        <Link to={{pathname: "/student/quiz/" + sessionStorage.getItem("teacher")}}>
        <h5 className="textWhite">Takaisin tenttisivulle</h5></Link>
      </div>
      </div>
    );
  }
};

export default Result;
