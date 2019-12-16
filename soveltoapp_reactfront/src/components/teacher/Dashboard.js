import React from "react";
import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';
import Quizform from './Quizform'

export default function Dashboard() {
  /*const authT = auth.sessionStorageGetItem();
  
  console.log("hello from dashboard", authT);
  {authT ? null : <Redirect to="/" />}*/

  return (
    <div>
      
      <h1>Tämä on dashboard</h1>
      <Quizform/>
    </div>
  );
}
