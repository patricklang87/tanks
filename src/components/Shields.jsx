import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const Shields = (props) => {
  const { gameState } = props;
  const { tanks } = gameState;

  return (
    <div style={{ padding: "10px" }}>
      {tanks.map((tank, index) => (
        <div
          key={`shields_${index}`}
          className="row"
          style={{
            margin: "5px",
            radius: "10px",
            padding: "5px",
            backgroundColor: tank.color,
          }}
        >
          <span className="col-4">{tank.shields}%</span>
          <div className="col-8">
            {" "}
            <ProgressBar
              animated
              now={tank.shields}
              style={{ color: tank.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shields;
