import React from "react";

const ShieldDisplay = (props) => {
  const {
    tank: { shields, color },
  } = props;
  return <p style={{ color }}>Shields: {shields}</p>;
};

export const Shields = (props) => {
  const { gameState } = props;
  const { tanks } = gameState;

  return (
    <div style={{backgroundColor: "lightgrey"}}>
      {tanks.map((tank, index) => (
        <ShieldDisplay key={`$tank_shieds_${index}`} tank={tank} />
      ))}
    </div>
  );
};
