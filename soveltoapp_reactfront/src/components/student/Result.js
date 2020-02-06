import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import ScoreItem from './ScoreItem'

const Result = ({history}) => {

    const tag = sessionStorage.getItem('studentTag')

    const resultSearchTag = {result_tag: tag}

    


    console.log(tag)

    const [score, setScore] = useState([]);

    useEffect(() => {
        studentScore(resultSearchTag)
        .then(res => setScore(res))
      }, []);
    
  /*   console.log(history.location.state.values)
    console.log(score) */


    //localStorage.removeItem('started')
    if (!history.location.state) {
        return (
            <div className="text-white">
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