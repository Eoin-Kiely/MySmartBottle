import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestoreDB } from "../Services/firebase";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import { doc, setDoc } from "firebase/firestore/lite";

const RegisterPage = (props) => {
  let navigate = useNavigate();
  let [errorMessage, setErrorMessage] = useState();

  const schema = z.object({
    firstName: string().max(45).nonempty({ message: "First Name is required" }),
    lastName: string().max(45).nonempty({ message: "Last Name is required" }),
    phoneNo: string().max(20).nonempty({ message: "Phone Number is required" }),
    email: string().email().max(45).nonempty({ message: "Email is required" }),
    password: string().nonempty({ message: "Password is required" }),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

  const onRegister = (formValues) => {
    createUserWithEmailAndPassword(auth, formValues.email, formValues.password)
      .then((userCredential) => {
        let user = userCredential.user;
        setDoc(doc(firestoreDB, "users", user.uid), {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phoneNo: formValues.phoneNo,
          email: formValues.email,
          recommendedWaterIntake: 0,
          currentWaterIntake: 0,
          date: "",
        });
        sessionStorage.setItem("loggedInUser", user.uid);
      })
      .catch((error) => {
        const errMessage = error.message;
        if (errMessage === "Firebase: Error (auth/email-already-in-use).") {
          setErrorMessage("An account with that email already exists!");
        } else {
          setErrorMessage(errMessage);
        }
      });
    props.setLogin(true);
    navigate("/");
  };
  return (
    <Container className="py-5">
      <h3 className="w-75 mx-auto">Register</h3>
      <Form onSubmit={handleSubmit(onRegister)} className="w-25 mx-auto">
        <fieldset>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>First Name:</Form.Label>
                <Form.Control {...register("firstName")} />
                <br />
                {errors.firstName?.message.length > 0 && (
                  <Alert variant="danger">{errors.firstName?.message}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control {...register("lastName")} />
                <br />
                {errors.lastName?.message.length > 0 && (
                  <Alert variant="danger">{errors.lastName?.message}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control {...register("phoneNo")} />
                <br />
                {errors.phoneNo?.message.length > 0 && (
                  <Alert variant="danger">{errors.phoneNo?.message}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Email Address:</Form.Label>
                <Form.Control {...register("email")} />
                <br />
                {errors.email?.message.length > 0 && (
                  <Alert variant="danger">{errors.email?.message}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control {...register("password")} type="password" />
            <br />
            {errors.password?.message.length > 0 && (
              <Alert variant="danger">{errors.password?.message}</Alert>
            )}
          </Form.Group>

          <div className="text-center">
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
            <Button variant="primary" type="submit">
              Register
            </Button>
          </div>
          <hr />
          <div className="text-center">
            <p>Or click below to login</p>
            <Link to={"/login"}>
              <Button variant="success" className="">
                Login
              </Button>
            </Link>
          </div>
        </fieldset>
      </Form>
    </Container>
  );
};

export default RegisterPage;
