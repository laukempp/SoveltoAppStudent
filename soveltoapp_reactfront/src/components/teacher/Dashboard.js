import React from "react";
import { Redirect } from "react-router-dom";
import auth from '../../service/Auth';

export default function Dashboard() {
  const authT = auth.sessionStorageGetItem();
  
  console.log("hello from dashboard", authT);

  return (
    <div>
      {authT ? null : <Redirect to="/" />}
      <h1>Tämä on dashboard</h1>
    </div>
  );
}
