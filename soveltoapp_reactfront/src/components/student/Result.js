import React, { Component } from 'react'
/* import { studentScore } from ''; */

export default class Score extends Component {
    state = { scores: [] }

   /*  componentDidMount() {
        this.fetchScoreList();
    }
    fetchScoreList = () => {
        studentScore().then(scores => {
            this.setState({ scores });
        })
    } */


    render() {
        return (
                <table>
                    <th>NAME</th><th>SCORE</th>
                <tbody>
                    {
                    this.state.scores.map((item) =>{
                    return <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.score}</td>
                        </tr>
                    })
                    }
                    </tbody>
                </table>
        )
    }
}