import React from "react";
//import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';

import Quizform from './Quizform'
//import Questionform from './Questionform';

import {Navigation} from '../../layout/Navbar';
import Footer from '../../layout/Footer';

export default function Dashboard() {
  const authT = sessionStorage.getItem("tommi");

  console.log("hello from dashboard", authT);

  /*{authT ? null : <Redirect to="/" />}*/

  return (
    <div>

      <Navigation title={'Soveltommi'} />
      
      
      <h1>Tämä on dashboard</h1>
      <Quizform/>
     {/*  <Questionform /> */}
    
    <Footer />

    </div>
  );
}
