import React from "react";
import DraggableBlock from "../components/common/DraggableBlock";

export default function Sidebar() {
  const motionBlocks = [
    {
      type: "motion",
      text: "Move X by 50",
      color: "blue",
      action: "moveXBy50",
    },
    {
      type: "motion",
      text: "Move Y by 50",
      color: "blue",
      action: "moveYBy50",
    },
    {
      type: "motion",
      text: "Turn 45° anticlockwise",
      color: "blue",
      action: "turnAnticlockwise45",
    },
    {
      type: "motion",
      text: "Turn 45° clockwise",
      color: "blue",
      action: "turnClockwise45",
    },
    {
      type: "motion",
      text: "Rotate 360°",
      color: "blue",
      action: "rotate360",
    },
    {
      type: "motion",
      text: "Go to X: 0, Y: 0",
      color: "blue",
      action: "goToOrigin",
    },
    {
      type: "motion",
      text: "Move X=50, Y=50",
      color: "blue",
      action: "moveXY50",
    },
    {
      type: "motion",
      text: "Go to random position",
      color: "blue",
      action: "goToRandomPosition",
    },
    {
      type: "motion",
      text: "Say Hello",
      color: "blue",
      action: "sayHello",
    },
    {
      type: "motion",
      text: "Say Hello for 1 sec",
      color: "blue",
      action: "sayHelloFor1Sec",
    },
    {
      type: "motion",
      text: "Increase Size",
      color: "blue",
      action: "increaseSize",
    },
    {
      type: "motion",
      text: "Decrease Size",
      color: "blue",
      action: "decreaseSize",
    },
  ];

  const controlBlocks = [
    {
      type: "control",
      text: "Repeat",
      color: "red",
      action: "repeatWholeAnimation",
    },
  ];

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="w-full mb-4">
        <h3 className="font-bold text-sm uppercase text-gray-700 mb-2 px-1">Motion</h3>
        {motionBlocks.map((block, index) => (
          <DraggableBlock
            key={`motion-block-${index}`}
            id={`motion-block-${index}`}
            type={block.type}
            text={block.text}
            color={block.color}
            iconName={block.iconName}
            iconSize={block.iconSize}
            iconClass={block.iconClass}
            action={block.action}
          />
        ))}
      </div>

      <div className="w-full">
        <h3 className="font-bold text-sm uppercase text-gray-700 mb-2 px-1">Control</h3>
        {controlBlocks.map((block, index) => (
          <DraggableBlock
            key={`control-block-${index}`}
            id={`control-block-${index}`}
            type={block.type}
            text={block.text}
            color={block.color}
            iconName={block.iconName}
            iconSize={block.iconSize}
            iconClass={block.iconClass}
            action={block.action}
          />
        ))}
      </div>
    </div>
  );
}
