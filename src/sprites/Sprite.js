import React, { useEffect, useState } from "react";
import CatSprite from "./CatSprite";
import BaseballSprite from "./BaseballSprite";
import BearSprite from "./BearSprite";
import PersonSprite from "./PersonSprite";

const Sprite = ({
  id,
  type = "cat",
  x = 0,
  y = 0,
  rotation = 0,
  size = 100,
  updateSpriteState,
  sayDuration = null,
  sayMessage = null,
  visible = true,
}) => {
  if (!visible) return null;

  const [message, setMessage] = useState("");

  const containerStyle = {
    position: "absolute",
    transform: `translate(${x}px, ${y}px)`,
    transformOrigin: "center",
    transition: "transform 0.3s ease",
  };

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
      case "bear":
        return <BearSprite />;
      case "person":
        return <PersonSprite />;
      default:
        return <CatSprite />;
    }
  };

  useEffect(() => {
    if (sayMessage) {
      setMessage(sayMessage);
      if (sayDuration) {
        setTimeout(() => {
          setMessage("");
          updateSpriteState(id, { sayMessage: null, sayDuration: null });
        }, sayDuration);
      } else {
        setTimeout(() => {
          setMessage("");
          updateSpriteState(id, { sayMessage: null, sayDuration: null });
        }, 400);
      }
    }
  }, [sayMessage]);

  return (
    <div style={containerStyle}>
      {message && (
        <div style={speechBubbleStyle}>
          {message}
          <div style={triangleBorderStyle}></div>
          <div style={triangleStyle}></div>
        </div>
      )}
      <div style={spriteStyle}>{renderSprite()}</div>
    </div>
  );
};

export default Sprite;
