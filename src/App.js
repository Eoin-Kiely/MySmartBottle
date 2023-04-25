import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import "./bootstrap/dist/css/bootstrap.min.css";

import Header from "./Components/header";
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import "./Services/firebase";
import ProtectedRoute from "./Services/protectedroute";
import RegisterPage from "./Pages/RegisterPage";
import StatusPage from "./Pages/StatusPage";
import WaterFormPage from "./Pages/WaterFormPage";

function App() {
  let [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("loggedInUser") ? true : false
  );
  return (
    <BrowserRouter>
      <Header login={loggedIn} setLogin={setLoggedIn} />
      <Routes>
        <Route path="/" exact element={<Home login={loggedIn} />} />
        <Route path="/login" element={<LoginPage setLogin={setLoggedIn} />} />
        <Route
          path="/register"
          element={<RegisterPage setLogin={setLoggedIn} />}
        />
        <Route
          path="/status"
          element={<ProtectedRoute loggedIn={loggedIn}><StatusPage /></ProtectedRoute>}
        />
        <Route
          path="/waterIntakeForm"
          element={<ProtectedRoute loggedIn={loggedIn}><WaterFormPage  /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
