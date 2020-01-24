import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import Question from './Question'

const Result = (history) => {

    const [score, setScore] = useState([]);
    const [questions, setQuestions] = useState(history.location.state.questions)

    let helperVar = "help"


    useEffect(() => {
        studentScore(history.location.state.values)
        .then(res => setScore(res))
      }, []);
    
    console.log(questions)
    console.log(score)


    //sessionStorage.removeItem('started')

        return (
            <div>
                {score.quizQuestions && score.quizQuestions.map((result, index) => {
                    console.log(score.score[0].user_answer)
                        return (
                            <Question
                            index={index}
                            result={result}
                            key={result.id}
                            studentAnswer={score.score[0].user_answer[index]}
                            helperVar={helperVar}
                            />)})}
            </div>
        )
}

export default Result;