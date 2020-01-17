import React, {useState, useEffect} from 'react'
import { studentScore } from '../../service/Request'; 
import Question from './Question'

const Result = (history) => {

    const [result, setResult] = useState();
    const [questions, setQuestions] = useState(history.location.state.questions)


    useEffect(() => {
        studentScore(history.location.state.values)
        .then(res => setResult(res))
      }, []);
    
    console.log(questions)

    /*const quiz = result.quizQuestions.map((result, index) => {
        return (
          <Question
            index={index}
            result={result}
            key={result.id}
          />
        );
      });*/

    
      sessionStorage.removeItem('started')

        return (
            <div>
                {result && result.lenght > 0 ? (
                    result.quizQuestions.map((result, index) => {
                        return (
                            <Question
                            index={index}
                            result={result}
                            key={result.id}
                            />);
                        })) : (questions.map((result, index) => {
                            return (
                                <Question
                                index={index}
                                result={result}
                                key={result.id}
                                />);
                            }))}
            </div>
        )
}

export default Result;