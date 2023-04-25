import { doc, getDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import { firestoreDB } from "../Services/firebase";

const StatusPage = () => {
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
    <h1>Daily Status</h1>
    <Container className="w-75">
      {data?.recommendedWaterIntake === undefined ||
        (data?.recommendedWaterIntake === 0 && (
          <Container className="py-5 mx-auto">
            <Alert variant="danger" className="mt-5 w-50 mx-auto">
              You have not completed your water intake form yet, please complete
              your water intake form to view your status.
            </Alert>
          </Container>
        ))}
      <Row>
        {data?.recommendedWaterIntake !== undefined &&
          (data?.recommendedWaterIntake !== 0 && (
            <>
              <Col>
                <GaugeChart
                  nrOfLevels={420}
                  arcsLength={[0.4, 0.4, 0.2]}
                  style={{ width: "75%" }}
                  needleBaseColor={"#000000"}
                  needleColor={"#000000"}
                  className="my-auto"
                  colors={["red", "yellow", "#5BE12C"]}
                  textColor={"black"}
                  percent={
                    data?.currentWaterIntake === undefined ||
                    data?.recommendedWaterIntake === undefined
                      ? 0
                      : data?.currentWaterIntake /
                          data?.recommendedWaterIntake >
                        1
                      ? 1
                      : data?.currentWaterIntake / data?.recommendedWaterIntake
                  }
                  arcPadding={0.0}
                />
              </Col>
              <Alert variant="dark" className="mt-4 w-25 my-auto">
                Current Water Intake: <br/>{data?.currentWaterIntake.toFixed(2)} litres <br />
                <br />
                Recommended Intake: <br/> {data?.recommendedWaterIntake} litres.
              </Alert>
            </>
          ))}
      </Row>
      <Row>
        {data?.currentWaterIntake / data?.recommendedWaterIntake >= 1 && (
          <Alert variant="success" className="mt-3 w-50 mx-auto text-center">
            You have completed your water intake for today, well done!
          </Alert>
        )}
      </Row>
      </Container>
    </Container>
  );
};

export default StatusPage;
