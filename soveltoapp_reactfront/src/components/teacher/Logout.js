import React, {useEffect} from 'react'
import auth from '../../service/Auth'
export default function Logout() {
    useEffect(() => {
        setTimeout(() => {
           window.location.assign('login'); 
        }, 1500)     
    })
          auth.logOut();      
    return ( 
        <div className="logoutxt" >Logout successful
       </div>
    )
}
