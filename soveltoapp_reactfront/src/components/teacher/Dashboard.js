import React from "react";
import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';

import Quizform from './Quizform'
import Questionform from './Questionform';

import {Navigation} from '../../layout/Navbar';
import Footer from '../../layout/Footer';

export default function Dashboard() {
  const authT = auth.sessionStorageGetItem();

  console.log("hello from dashboard", authT);


  return (
    <div>

      <Navigation title={'Soveltommi'} />
      
      {authT ? null : <Redirect to="/" />}
      <h1>Tämä on dashboard</h1>
      <Quizform/>
     {/*  <Questionform /> */}
    
    <Footer />

    </div>
  );
}
