import React from "react";
import { Spinner } from "react-bootstrap";

const AppSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="secondary" />
    </div>
  );
};

export default AppSpinner;
