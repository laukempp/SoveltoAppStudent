import React from 'react'
import { Link } from 'react-router-dom';
import auth from '../../service/Auth'
export default function Logout() {
          auth.logOut();
    return ( 
        <div>  
            <p>Logout successful!</p> 
            
        </div>
    )
}
