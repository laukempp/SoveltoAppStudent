import React, {useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../service/Auth";
import auth from '../../service/Auth';
import { Redirect } from "react-router-dom";
import Footer from "../../layout/Footer";
export default function Login() {
  const [authT, setAuthT] = useState(auth.isAuthenticated());
  
  console.log("login authT", authT)


  const loginSchema = Yup.object().shape({
    login: Yup.string().required("This field is required."),
    password: Yup.string().required("password is required")
  });
  return (
    <>
      {authT ? <Redirect to="/dashboard" /> : null}
      <div>
        <Formik
          initialValues={{ login: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            loginUser(values).then(res => {
              setAuthT(auth.isAuthenticated())
            })
            
          
              /* .then(res => {
                return checkItem();
              })
              .then(item => {
                setToDash(item);
              }); */
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
            <Form onSubmit={handleSubmit}>
              <Field
                type="email"
                name="login"
                placeholder="email@example.com"
                className={touched.login && errors.login ? "error" : null}
                onChange={handleChange}
                autoComplete="off"
                onBlur={handleBlur}
                value={values.login || ""}
              />
              <ErrorMessage
                component="div"
                name="login"
                className="invalidEmail"
              />

              <Field
                type="password"
                name="password"
                placeholder="*********"
                className={touched.password && errors.password ? "error" : null}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password || ""}
              />
              <ErrorMessage
                component="div"
                name="password"
                className="invalidPassword"
              />

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <Footer />
      </div>
    </>
  );
}
