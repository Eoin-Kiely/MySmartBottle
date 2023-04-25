import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, Container, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import { useState } from "react";
import { updateDoc } from "firebase/firestore/lite";
import { doc } from "firebase/firestore/lite";
import { firestoreDB } from "../Services/firebase";
const WaterFormPage = (props) => {
  let navigate = useNavigate();
  let [result, setResult] = useState(0);

  const schema = z.object({
    weight: string().nonempty({ message: "Weight is required" }),
    exercise: string().nonempty({ message: "Exercise is required" }),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { errors } = formState;

  const handleSave = (formValues) => {
    let recommendedWaterIntake =
      (formValues.weight * 0.5 + (formValues.exercise / 30) * 12) * 0.029574;
    setResult(recommendedWaterIntake.toFixed(2));
    // Add recommended water intake to user's account
    let user = sessionStorage.getItem("loggedInUser");
    updateDoc(doc(firestoreDB, "users", user), {
      recommendedWaterIntake: Number(recommendedWaterIntake.toFixed(2)),
    });
    handleShow();
  };

  return (
    <Container className="py-5">
      <h3 className="w-75 mx-auto">Water Intake Calculator</h3>
      <Form onSubmit={handleSubmit(handleSave)} className="w-25 mx-auto">
        <fieldset>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>Weight (In Pounds):</Form.Label>
              <Form.Control {...register("weight")} type="number" />
              <br />
              {errors.weight?.message.length > 0 && (
                <Alert variant="danger">{errors.weight?.message}</Alert>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                How much exercise do you do daily? (In Minutes):
              </Form.Label>
              <Form.Control {...register("exercise")} type="number" />
              <br />
              {errors.exercise?.message.length > 0 && (
                <Alert variant="danger">{errors.exercise?.message}</Alert>
              )}
            </Form.Group>
          </Row>
          <div className="w-25 mx-auto">
          <Button variant="primary" type="submit" >
            Calculate
          </Button>
          </div>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Water Intake</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your estimated water intake is {result} litres per day! This has been added to your account.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Link to={"/status"}><Button variant="primary">To Account</Button></Link>
            </Modal.Footer>
          </Modal>
        </fieldset>
      </Form>
    </Container>
  );
};

export default WaterFormPage;