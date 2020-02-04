import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = ({history}) => {

    const tag = sessionStorage.getItem('moi')

    const resultSearchTag = {quiz_badge: sessionStorage.getItem('c2eb1463-da5a-4eea-aa0e-4e27cc83b85d'), result_tag: parseInt(tag)}


    console.log(tag)

    const [score, setScore] = useState([]);

    useEffect(() => {
        studentScore(resultSearchTag)
        .then(res => setScore(res))
      }, []);
    
    console.log(history.location.state.values)
    console.log(score)


    //sessionStorage.removeItem('started')
    if (!history.location.state) {
        return (
            <div>
                Sori, ei oo tuloxii
            </div>
        )
    } else {
        return (
            <div>
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