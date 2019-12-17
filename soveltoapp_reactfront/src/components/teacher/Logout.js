import React from 'react'

export default function Logout() {
    const tokenRemover = () => {
        sessionStorage.removeItem("tommi");
    }
    tokenRemover();
    return (
        
        <div>
            Logout successful, bye!
        </div>
    )
}
