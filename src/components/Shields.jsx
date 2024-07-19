import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { environmentConstants } from "../gameplay/constants";

const Shields = (props) => {
  const { gameState } = props;
  const { tanks } = gameState;
  const {destroyedTankColor} = environmentConstants;

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
            backgroundColor: tank.shields > 0 ? tank.color : destroyedTankColor,
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
