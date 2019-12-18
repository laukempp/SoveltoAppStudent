/*import React, { Component } from 'react'
import Wait from './Wait';
import socketIOClient from 'socket.io-client';

/* class Main extends Component {
    ws = new WebSocket('ws://localhost:5000/ws')

    componentDidMount(){
        this.ws.onopen = () => {
            console.log("web socketti toimii")
        }

        this.ws.onmessage = evt => {
            const message = JSON.parse(evt.data)
            this.setState ({
                dataFromServer: message
            })
            console.log(message)
        }
        this.ws.onclose = () => {
            console.log('yhteys katkaistu')
        }
      
    }
} 

export default class MainWebSocket extends Component {
    
    componentDidMount(){
        const socket = socketIOClient('http://localhost:5001')
        console.log("Soketti", socket);
        socket.on('connect', () => {
            socket.emit('event', 'tämä tulee react frontista')
            console.log("web socketti toimii")
        })

        socket.on('uusi', evt => {
            const message = JSON.parse(evt.data)
            this.setState ({
                dataFromServer: message
            })
            console.log("viesti", message)
        })
        socket.on('redirect', (destination) => {
            window.location.href = destination;
           console.log('viesti vastaanotettu', destination);
            
            
        })
        socket.onclose = () => {
            console.log('yhteys katkaistu')
        }
      
    }
    render() {
        return (
            <div>
                <Wait websocket={this.socket} />
                
            </div>
        )
    }
}*/
