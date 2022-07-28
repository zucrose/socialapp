import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";

export default function SignUp({ setAlert, setUser }) {
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = "Required";
    } else if (values.firstName.length > 15) {
      errors.firstName = "Must be 15 characters or less";
    }

    if (!values.lastName) {
      errors.lastName = "Required";
    } else if (values.lastName.length > 20) {
      errors.lastName = "Must be 20 characters or less";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Must be atleast 8 characters";
    } else if (values.password.length > 20) {
      errors.password = "Must be 20 characters or less";
    }

    if (!values.username) {
      errors.username = "Required";
    } else if (!/^[a-z0-9_]+$/.test(values.username)) {
      errors.username =
        "Username must contain only lower case letters ,numbers or _";
    }

    return errors;
  };

  function createAccount(values) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        password: values.password,
      }),
    };

    fetch("https://uzstragram.herokuapp.com/createUser", requestOptions)
      .then((_res) => {
        return _res.json();
      })
      .then((data) => {
        setAlert({
          variant: "success",
          message: "Your account has been created.",
        });
        setUser(data.username);
        navigate("/");
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="align-items-center">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          password: "",
          username: "",
        }}
        validate={validate}
        onSubmit={(values) => {
          createAccount(values);
        }}
      >
        <Form className="center-form ">
          <h1>Sign Up</h1>
          <div className="form-group mt-4 mb-2">
            <label htmlFor="firstName">
              <h5>First Name</h5>
            </label>
            <Field name="firstName" type="text" className="form-control" />
            <ErrorMessage
              name="firstName"
              className="text-danger "
              component="div"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="lastName">
              <h5>Last Name</h5>
            </label>
            <Field name="lastName" type="text" className="form-control" />
            <ErrorMessage
              name="lastName"
              className=" text-danger"
              component="div"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="username">
              <h5>Username</h5>
            </label>
            <Field name="username" type="text" className="form-control" />
            <ErrorMessage
              name="username"
              className=" text-danger"
              component="div"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="password">
              <h5>Password</h5>
            </label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage
              name="password"
              className=" text-danger"
              component="div"
            />
          </div>

          <Button type="submit" className="btn btn-primary">
            Sign Up 
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
