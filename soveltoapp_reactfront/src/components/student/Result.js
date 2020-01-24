import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = (history) => {

    const [score, setScore] = useState([]);

    useEffect(() => {
        studentScore(history.location.state.values)
        .then(res => setScore(res))
      }, []);
    
    console.log(history.location.state.values)
    console.log(score)


    //sessionStorage.removeItem('started')

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

export default Result;