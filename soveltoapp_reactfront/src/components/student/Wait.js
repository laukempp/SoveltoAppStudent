import React, { Component } from 'react'

export default class Wait extends Component {
    sendMessage = () => {
        const {websocket} = this.props

        try{
            websocket.send("data")
        }
        catch(error) {
            console.log(error)
        }
    }
    render() {
        return (
            <div>
                   __
              ___( o)> quack
              
            </div>
        )
    }
}
