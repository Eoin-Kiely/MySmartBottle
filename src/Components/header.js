import React from "react";
import logo from "../logo.png";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  let navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem("loggedInUser");
        props.setLogin(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container data-testid="nav">
        <Navbar.Brand href={`/`}>
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          My Smart Bottle
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={`/`}>Home</Nav.Link>
            {props.login ? (
              <>
                {" "}
                <Nav.Link href={`/status`}>Status</Nav.Link>
                <Nav.Link href={`/waterIntakeForm`}>Water Intake Form</Nav.Link>
                <Nav.Link onClick={logout} data-testid="logoutNav">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href={`/login`} data-testid="loginNav">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
