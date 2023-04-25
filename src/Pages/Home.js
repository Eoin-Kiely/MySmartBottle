import { doc, getDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { firestoreDB } from "../Services/firebase";
import { Link } from "react-router-dom";

const Home = (props) => {
  let [data, setData] = useState([]);

  let user = sessionStorage.getItem("loggedInUser");

  useEffect(() => {
    let getData = async () => {
      const docRef = getDoc(doc(firestoreDB, "users/" + user));
      setData((await docRef).data());
    };
    getData();
  }, [user]);

  return (
    <Container className="py-5">
      {props.login ? (
        <>
          <h1>Home</h1>
          <Container className="py-5 mx-auto w-75">
            <h2 className="w-75">
              Welcome back {data.firstName + " " + data.lastName}
            </h2>
            {data?.recommendedWaterIntake !== undefined &&
              (data?.recommendedWaterIntake !== 0 ? (
                <p>
                  Your current water intake percentage is:{" "}
                  {data?.currentWaterIntake === undefined ||
                  data?.recommendedWaterIntake === undefined
                    ? 0
                    : data?.currentWaterIntake / data?.recommendedWaterIntake >
                      1
                    ? 100
                    : (data?.currentWaterIntake /
                        data?.recommendedWaterIntake) *
                      100}
                  %{" "}
                </p>
              ) : (
                <p>
                  You have not completed your water intake form yet, please
                  complete your water intake form.
                </p>
              ))}
            {data?.currentWaterIntake / data?.recommendedWaterIntake >= 1 && (
              <Alert
                variant="success"
                className="mt-3 w-50 mx-auto text-center"
              >
                You have completed your water intake for today, well done! Come
                back tomorrow to see your progress.
              </Alert>
            )}
          </Container>
        </>
      ) : (
        <>
          <h1>Welcome to My Smart Bottle</h1>
          <Container className="py-5 mx-auto w-75">
            <p>Login or Register to continue</p>
            <Link to="/login" className="p-1">
              <Button variant="success">Login</Button>
            </Link>
            <Link to="/register" className="p-1">
              <Button variant="primary">Register</Button>
            </Link>
          </Container>
        </>
      )}
    </Container>
  );
};

export default Home;
