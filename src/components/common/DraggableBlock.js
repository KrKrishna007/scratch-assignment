import React from "react";
import Icon from "../../icons/Icon";

const DraggableBlock = ({
  type,
  text,
  color = "blue",
  iconName = null,
  iconSize = 15,
  iconClass = "",
  isDraggable = true,
  onDragStart,
  onDragEnd,
  action,
  id,
  onDelete,
  onDragOver,
  onDrop,
  targetSpriteId,
}) => {
  const colorClass = `bg-${color}-500`;

  const handleDragStart = (e) => {
    if (!isDraggable) return;

    const blockData = {
      id,
      type,
      text,
      color,
      iconName,
      iconSize,
      iconClass,
      action,
      targetSpriteId,
    };

    e.dataTransfer.setData("application/json", JSON.stringify(blockData));
    e.dataTransfer.effectAllowed = "copy";

    if (onDragStart) onDragStart(e, blockData);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd(e);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex flex-row items-center flex-wrap ${colorClass} text-white px-2 py-1 my-2 text-sm cursor-pointer relative`}
      data-block-id={id}
    >
      {text}
      {iconName && <Icon name={iconName} size={iconSize} className={`mx-2 ${iconClass}`} />}

      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="ml-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs absolute -right-1 -top-1"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default DraggableBlock;
