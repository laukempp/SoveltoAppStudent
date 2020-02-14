import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = ({history}) => {
    const [score, setScore] = useState([]);

    /*Haetaan sessionstoragesta sinne tallennettu opiskelijatagi ja quizin ID. Näitä tietoja käytetään tulosten hakemiseksi ja ne tallentuvat sessionStorageen edellisessä näkymässä, kun opiskelija painaa "submit"-nappia*/
    const tag = sessionStorage.getItem('studentTag')
    const quizID = sessionStorage.getItem('quizID')
    
    //Muotoillaan opiskelijatagista ja quizin ID:sta olio, jonka voi lähettää backendille kyselyä varten
    const resultSearchTag = {result_tag: tag, quiz_badge: quizID}

    //useEffect hakee oppilaan tulokset yllämuotoillulla oliolla sivulle joka kerta, kun sivu renderöityy
    useEffect(() => {
        studentScore(resultSearchTag)
        .then(res => setScore(res))
      }, []);
    
    //Funktio laskee oppilaan kokonaispisteet tarkistamalla, missä kohdin oppilaan vastaus JA oikea vastaus olivat saman; niistä oppilas saa pisteen. 
    const pointCounter = array => {
        let points = []

        if (array) {
            array.forEach(item => {
                item.results.forEach(count => {
                    if (count.count === 1 && count.isCorrect === true) {
                        points.push(count.count)
                    }
                })
            })
        }
    return (<div className="text-white">Kokonaispisteesi: {points.length}/{score.length} eli {points.length/score.length*100} %</div>)
    }
    
    //Mikäli sivulle tullaan suoraan kirjoittamalla se urliin, sillä ei ole historiaa ja vain tämä näkymä renderöityy
    if (!history.location.state) {
        return (
            <div className="text-white">
                Sori, ei oo tuloxii
            </div>
        )
    } else {
        return (
            <div>
                {pointCounter(score)}
                {/*Tässä mapataan scoreItem-komponenttia eli luodaan tarpeellinen määrä näkymiä; niin monta näkymää kuin on kysymystä ja samalla välitetään vastaus-arrayn tiedot scoreItem-komponentille, joka käsittelee ne ja esittelee ne oikeannäköisenä. Alussa on ehto, joka määrittää, että map-funktio käynnistyy VAIN, jos score-array on olemassa ja täten sivu ei kaadu siihen, jos score-array onkin tyhjä, koska map ei silloin käynnisty*/}
                {score && score.map((item, index) => {
                        return (
                            <ScoreItem
                            index={index}
                            question={item.question}
                            key={item.id}
                            studentAnswer={item.results}
                            id={item.id}
                            />)})}
            </div>
        )
    }
}

export default Result;