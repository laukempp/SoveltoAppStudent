import React from "react";
import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';

import Quizform from './Quizform'
//import Questionform from './Questionform';

import {Navigation} from '../../layout/Navbar';
import Footer from '../../layout/Footer';

export default function Dashboard() {
  const authT = auth.sessionStorageGetItem();

  console.log("hello from dashboard", authT);

 

  return (
    <div>
      {authT ? null : <Redirect to="/" />}
      <Navigation title={'Soveltommi'} />
      
      
      <h1 className="user__header detail_header">Tervetuloa kojelaudalle</h1>
      <Quizform/>
      {/*  <Questionform /> */}
    
    <Footer />

    </div>
  );
}
