import React, { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";

const LoginPage = (props) => {
  let auth = getAuth();
  let navigate = useNavigate();
  let [errorMessage, setErrorMessage] = useState();

  const schema = z.object({
    email: string().email().max(45).nonempty({ message: "Email is required" }),
    password: string().nonempty({message: "Password is required"})
  })

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

  const onLogin = (formValues) => {
    signInWithEmailAndPassword(auth, formValues.email, formValues.password)
      .then(() => {
        sessionStorage.setItem("loggedInUser", auth.currentUser.uid);
        props.setLogin(true);
        navigate("/");
      })
      .catch((error) => {
        const errMessage = error.message;
        if (errMessage === "Firebase: Error (auth/user-not-found).") {
          setErrorMessage("Incorrect Email or User does Not Exist!");
        } else if(errMessage.includes("(auth/too-many-requests).")){
          setErrorMessage("Too many login requests, try again later!");
        } else {
          setErrorMessage("Incorrect Password!");
          console.log(errMessage);
        }
      });
  };
  return (
    <Container className="py-5">
      <h3 className="w-75 mx-auto">Login</h3>
      <Form onSubmit={handleSubmit(onLogin)} className="w-25 mx-auto">
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Label>Email Address:</Form.Label>
            <Form.Control {...register("email")} />
                <br/>
                {errors.email?.message.length > 0 && <Alert variant="danger">{errors.email?.message}</Alert>}
          </Form.Group>{" "}
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control {...register("password")} type="password"/>
                <br/>
                {errors.password?.message.length > 0 && <Alert variant="danger">{errors.password?.message}</Alert>}
          </Form.Group>
          <div className="text-center">
            {errorMessage && <Alert variant={'danger'}>{errorMessage}</Alert>}

            <Button variant="primary" type="submit" data-testid="loginButton">
              Login
            </Button>
          </div>
          <hr />
          <div className="text-center">
            <p>Or click below to register</p>
            <Link to={"/register"}>
              <Button variant="success" data-testid="registerButton">
                Register
              </Button>
            </Link>
          </div>
        </fieldset>
      </Form>
    </Container>
  );
};

export default LoginPage;
