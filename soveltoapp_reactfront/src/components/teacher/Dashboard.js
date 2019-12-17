import React from "react";
import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';

import Quizform from './Quizform'


import {Navigation} from '../../layout/Navbar';
import Footer from '../../layout/Footer';

export default function Dashboard() {
  const authT = auth.sessionStorageGetItem();

  console.log("hello from dashboard", authT);

  //siirrä alas {authT ? null : <Redirect to="/" />}


  return (
    <div>

    
      <Quizform/>

      <Navigation title={'Soveltommi'} />
      
      
      <h1>Tämä on dashboard</h1>

    <Footer />

    </div>
  );
}
