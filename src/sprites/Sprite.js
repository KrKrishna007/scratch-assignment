import React from "react";
import CatSprite from "./CatSprite";
import BaseballSprite from "./BaseballSprite";

const Sprite = ({
  type = "cat",
  x = 0,
  y = 0,
  rotation = 0,
  size = 100,
  sayMessage = null,
  visible = true,
}) => {
  if (!visible) return null;

  // Main container style that includes positioning
  const containerStyle = {
    position: "absolute",
    transform: `translate(${x}px, ${y}px)`,
    transformOrigin: "center",
    transition: "transform 0.3s ease",
  };

  // Sprite rotation and sizing
  const spriteStyle = {
    transform: `rotate(${rotation}deg) scale(${size / 100})`,
    transformOrigin: "center",
    position: "relative",
    transition: "transform 0.3s ease",
  };

  const speechBubbleStyle = {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "5px 10px",
    border: "2px solid black",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    zIndex: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  };

  // Triangle pointer styles
  const triangleStyle = {
    position: "absolute",
    left: "50%",
    bottom: "-8px",
    transform: "translateX(-50%)",
    width: "0",
    height: "0",
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderTop: "8px solid white",
    zIndex: 9,
  };

  const triangleBorderStyle = {
    position: "absolute",
    left: "50%",
    bottom: "-10px",
    transform: "translateX(-50%)",
    width: "0",
    height: "0",
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "10px solid black",
    zIndex: 8,
  };

  const renderSprite = () => {
    switch (type) {
      case "baseball":
        return <BaseballSprite />;
      case "cat":
      default:
        return <CatSprite />;
    }
  };

  return (
    <div style={containerStyle}>
      {sayMessage && (
        <div style={speechBubbleStyle}>
          {sayMessage}
          <div style={triangleBorderStyle}></div>
          <div style={triangleStyle}></div>
        </div>
      )}
      <div style={spriteStyle}>{renderSprite()}</div>
    </div>
  );
};

export default Sprite;
