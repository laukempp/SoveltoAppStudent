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
            <div>
                <h2>Miten meni noin niin kuin omasta mielestä?</h2>
                <table>
                <tbody>
                    <tr>
                    <th>Nimimerkki</th>
                    <th>Tulos</th>
                    </tr>
                    <tr>
                        <td>{sessionStorage.getItem('piip')}</td>
                        <td>{sessionStorage.getItem('pimpelipom')}%</td>
                    </tr>
                    </tbody>
                </table>
                </div>
        )
    }
}