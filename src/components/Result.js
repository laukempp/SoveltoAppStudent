import React, {useState, useEffect} from 'react'
import { studentScore } from '../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = ({history}) => {
    const [score, setScore] = useState([]);

    const getResults = () => {
        const tagForResult = ((history||{}).location||{}).state
        studentScore(tagForResult)
            .then(res => setScore(res))
    }

    
    //useEffect hakee oppilaan tulokset yllämuotoillulla oliolla sivulle joka kerta, kun sivu renderöityy
    useEffect(() => {
        const tag = JSON.parse(localStorage.getItem('sessionKey'))
        const storageTag = tag && tag.sessionID;
        const quizID = sessionStorage.getItem('quizID')

        const resultSearchTag = {result_tag: storageTag, quiz_badge: quizID}

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
    return (<div className="text-white">Kokonaispisteesi: {points.length}/{score.length} eli {Math.round(points.length/score.length*100)} %</div>)
    }
    
    //Mikäli sivulle tullaan suoraan kirjoittamalla se urliin, sillä ei ole historiaa ja vain tämä näkymä renderöityy
    if (!history.location.state || !localStorage.getItem('sessionKey')) {
        return (
            <div className="text-white">
                Sori, ei oo tuloxii
            </div>
        )
    } else if (score && score.length <= 0) {
        return (
            <div className="text-white">
                {getResults()}
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