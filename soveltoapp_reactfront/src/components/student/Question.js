import React, { useState } from 'react'

const Question = ({ result }) => {
    const [singlequestion, setsingleQuestion] = useState();
    const [counter, setCounter] = useState(0);


    return (
        <div>
            <p className="">
                plaaa
                {result.question}
            </p>

        </div>
    )
}
export default Question;