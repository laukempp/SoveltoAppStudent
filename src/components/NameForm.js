import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { checkTeacherBadge } from "../service/Request";
import * as Yup from "yup";
import "../styles/quiz.scss";
import { uuid } from "uuidv4";

//Lomakkeen kenttien validointi
const quizSchema = Yup.object().shape({
  nickname: Yup.string()
    .required("Nimimerkki täytyy valita")
    .min(3, "Kaksi kirjainta vähintään olis hyvä!")
    .max(20, "Liikaa merkkejä"),
  badge: Yup.number()
    .required("Syötä opettajanumero")
    .min(0, "Vähintään yksi numero")
    .max(99999, "Opettajanumero sisältää enintään viisi numeroa")
});

//Haetaan localStoragesta sessiodata (jos sitä ei ole, tulee toki tyhjää)
const previousDate = JSON.parse(localStorage.getItem("sessionKey"));

//Funktio, joka tarkistaa, onko siihen syötetty aika verrattuna nykyhetkeen 10 tuntia + enemmän vai 10 tuntia + vähemmän
const hourCheck = date => {
  const hours = 1000 * 60 * 60; //* 10;
  const tenHoursAgo = Date.now() - hours;

  return date > tenHoursAgo;
};

//Funktio, joka hoitelee sessioDatan päivitystä. Jos localStoragessa ei ole mitään, lisää sinne sessionID:n ja timestampin. Jos on, tarkistaa ylemmän funktion avulla, onko sessioData vanhempi kuin 10h (timestamp sessionDatassa) - jos on alle 10h vanha, ei tehdä mitään. Jos on yli 10h vanha, luodaan uusi sessioData-olio ja tallennetaan localStorageen entisen tilalle.
const checkAndSetStorage = now => {
  let storageItem = { sessionID: uuid(), timestamp: Date.now() };

  if (now) {
    let pastTime = now.timestamp;
    if (!hourCheck(pastTime)) {
      localStorage.setItem("sessionKey", JSON.stringify(storageItem));
    }
  } else {
    localStorage.setItem("sessionKey", JSON.stringify(storageItem));
  }
  sessionStorage.setItem("sessionKey", storageItem.sessionID);
};



export default function NameForm({ history }) {
  const [show, setShow] = useState(true);
  const [teacher_badge, setTeacher_badge] = useState(0);
  let disabledValue;
  return (
    <div className="container">
      <h2 className="text-white"> </h2>
      <Formik
        initialValues={{ nickname: "", badge: "" }}
        validationSchema={quizSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          sessionStorage.setItem("nickname", values.nickname);
          console.log("submit toimii");
          checkTeacherBadge({ badge: values.badge }).then(res => {
            if (res.success) {
              checkAndSetStorage(previousDate);
              history.push({ pathname: `/student/quiz/${values.badge}` });
            } else {
              setTeacher_badge(values.badge);
              setShow(false);
            }
          });
          resetForm();
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit
        }) => (
          
          <Form>
            <div className="text-white">
              <h2 className="text-white">Tervetuloa tekemään tenttiä!</h2>
              <Field
                type="text"
                name="nickname"
                id="studentNickname"
                placeholder="Nimimerkki"
                className={touched.nickname && errors.nickname ? "error" : null}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.nickname || ""}
              />
              <ErrorMessage
                component="div"
                name="nickname"
                className="invalidNickName"
              />
            </div>
            <div className="text-white">
              <Field
                type="number"
                name="badge"
                id="teacherBadge"
                placeholder="Opettajanumero"
                className={touched.badge && errors.badge ? "error" : null}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.badge || ""}
              />
              <ErrorMessage
                component="div"
                name="badge"
                className="invalidtbadge"
              />
            </div>
            <div>
              {show ? null : (
                <div className="text-white" id="teacherError">
                  Opettajanumeroa {teacher_badge} ei voida tunnistaa, kokeile
                  uudelleen!
                </div>
              )}
            </div>
              {disabledValue = values.nickname && values.badge ? null : true}
            <button
              id="nfButton"
              className="quizSubmit"
              onClick={handleSubmit}
              type="submit"
              disabled={isSubmitting || disabledValue}
            >
              Lähetä
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
