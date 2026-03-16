import React from "react";

const BurgerLoader = ({ size = "medium" }) => {
  const scale = size === "small" ? 0.6 : size === "large" ? 1.5 : 1;

  return (
    <div className="burger-layers" style={{ transform: `scale(${scale})` }}>
      <div className="burger-bun-top"></div>
      <div className="burger-lettuce"></div>
      <div className="burger-cheese"></div>
      <div className="burger-patty"></div>
      <div className="burger-bun-bottom"></div>
    </div>
  );
};

export default BurgerLoader;
