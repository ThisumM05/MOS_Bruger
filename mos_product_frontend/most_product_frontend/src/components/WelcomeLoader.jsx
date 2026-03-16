import React from "react";
import BurgerLoader from "./BurgerLoader";
import { Card } from "react-bootstrap";

const WelcomeLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        className="border-0 text-center p-5 rounded-4"
        style={{ minWidth: "320px", maxWidth: "400px" }}
      >
        <Card.Body>
          <h2
            className="mb-4"
            style={{
              color: "#e60012",
              fontFamily: "sans-serif",
              fontWeight: "800",
            }}
          >
            MOS Burger
          </h2>
          <div className="d-flex justify-content-center py-4">
            <BurgerLoader size="large" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WelcomeLoader;
