import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = ({history}) => {
    const [score, setScore] = useState([]);

    const tag = sessionStorage.getItem('studentTag')
    const quizID = sessionStorage.getItem('quizID')
    const resultSearchTag = {result_tag: tag, quiz_badge: quizID}

    useEffect(() => {
        studentScore(resultSearchTag)
        .then(res => setScore(res))
      }, []);

    const pointCounter = array => {
        let points = []

        if (array) {
            array.map(item => {
                item.results.map(count => {
                    if (count.count === 1 && count.isCorrect === true) {
                        points.push(count.count)
                    }
                })
            })
        }
    return (<div className="text-white">Kokonaispisteesi: {points.length}/{score.length} eli {points.length/score.length*100} %</div>)
    }

    console.log(score)
    console.log(pointCounter(score))
    
  /*   console.log(history.location.state.values)
    console.log(score) */

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
                {score && score.map((item, index) => {
                    console.log(score)
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