import React, { useState, useRef, useEffect } from "react";
import DraggableBlock from "../components/common/DraggableBlock";
import { useFlowContext } from "../contexts/FlowContext";
import { useSpritesContext } from "../contexts/SpritesContext";
import PlusIcon from "../icons/PlusIcon";

export default function MidArea() {
  const {
    flows,
    activeFlowId,
    setActiveFlowId,
    addFlow,
    deleteFlow,
    addBlockToFlow,
    removeBlockFromFlow,
    moveBlockInFlow,
    updateFlowName,
  } = useFlowContext();

  const { sprites } = useSpritesContext();

  const [draggedOverFlowId, setDraggedOverFlowId] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [dragSourceIndex, setDragSourceIndex] = useState(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(true);
  const [isEditingFlowModalOpen, setIsEditingFlowModalOpen] = useState(false);
  const [editingFlowId, setEditingFlowId] = useState(null);
  const [editingFlowName, setEditingFlowName] = useState("");
  const [activeSpriteTab, setActiveSpriteTab] = useState(null);

  const flowRef = useRef(null);

  useEffect(() => {
    if (flows.length > 0 && !activeFlowId) {
      setActiveFlowId(flows[0].id);
    }
  }, [flows, activeFlowId, setActiveFlowId]);

  useEffect(() => {
    if (sprites.length > 0) {
      setActiveSpriteTab(sprites[0].id);
    }
  }, [activeFlowId, sprites]);

  const handleDrop = (e, flowId) => {
    e.preventDefault();

    try {
      const blockData = JSON.parse(e.dataTransfer.getData("application/json"));

      if (isDraggingFromSidebar) {
        const blockWithTarget = {
          ...blockData,
          targetSpriteId: activeSpriteTab,
        };
        addBlockToFlow(flowId, blockWithTarget);
      } else if (dragSourceIndex !== null && draggedOverIndex !== null) {
        const blocksForSprite = getBlocksForCurrentSpriteTab();

        const sourceBlock = blocksForSprite[dragSourceIndex];
        if (sourceBlock) {
          const activeFlow = flows.find((f) => f.id === activeFlowId);
          if (!activeFlow) return;

          const allBlocks = activeFlow.blocks;
          const sourceBlockIndex = allBlocks.findIndex((b) => b.id === sourceBlock.id);

          let targetBlockIndex;
          if (draggedOverIndex >= blocksForSprite.length) {
            targetBlockIndex = allBlocks.length;
          } else {
            const targetBlock = blocksForSprite[draggedOverIndex];
            targetBlockIndex = allBlocks.findIndex((b) => b.id === targetBlock.id);
          }

          moveBlockInFlow(flowId, sourceBlockIndex, targetBlockIndex);
        }
      }

      setDraggedOverFlowId(null);
      setDraggedOverIndex(null);
      setDragSourceIndex(null);
      setIsDraggingFromSidebar(true);
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDragOver = (e, flowId, index) => {
    e.preventDefault();
    if (draggedOverFlowId !== flowId || draggedOverIndex !== index) {
      setDraggedOverFlowId(flowId);
      setDraggedOverIndex(index);
    }
  };

  const handleDragStart = (e, flowId, index) => {
    setDragSourceIndex(index);
    setIsDraggingFromSidebar(false);
    flowRef.current = flowId;
  };

  const handleAddFlow = () => {
    addFlow();
  };

  const handleSelectFlow = (flowId) => {
    setActiveFlowId(flowId);
  };

  const handleSelectSpriteTab = (spriteId) => {
    setActiveSpriteTab(spriteId);
  };

  const handleDeleteFlow = (e, flowId) => {
    e.stopPropagation();
    deleteFlow(flowId);
  };

  const handleRemoveBlock = (flowId, blockId) => {
    removeBlockFromFlow(flowId, blockId);
  };

  const handleOpenEditFlowModal = (e, flowId) => {
    e.stopPropagation();
    const flow = flows.find((f) => f.id === flowId);
    if (flow) {
      setEditingFlowId(flowId);
      setEditingFlowName(flow.name);
      setIsEditingFlowModalOpen(true);
    }
  };

  const handleCloseEditFlowModal = () => {
    setIsEditingFlowModalOpen(false);
    setEditingFlowId(null);
  };

  const handleUpdateFlowName = () => {
    if (editingFlowId && editingFlowName.trim()) {
      updateFlowName(editingFlowId, editingFlowName);
      handleCloseEditFlowModal();
    }
  };

  const getBlocksForCurrentSpriteTab = () => {
    const activeFlow = flows.find((f) => f.id === activeFlowId);
    if (!activeFlow) return [];
    return activeFlow.blocks.filter((block) => block.targetSpriteId === activeSpriteTab);
  };

  return (
    <div className="flex-1 h-full overflow-auto flex flex-col">
      <div className="bg-blue-100 p-2 mb-2 flex justify-between items-center">
        <h2 className="text-md font-bold">Flows</h2>
      </div>

      <div className="flex flex-row space-x-2 p-2 border-b overflow-x-auto">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`px-3 py-1 rounded-t-lg cursor-pointer flex items-center ${
              activeFlowId === flow.id ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSelectFlow(flow.id)}
          >
            <span>{flow.name}</span>
            <button
              className="ml-2 text-xs bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
              onClick={(e) => handleOpenEditFlowModal(e, flow.id)}
            >
              ✎
            </button>
            {flows.length > 1 && (
              <button
                className="ml-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                onClick={(e) => handleDeleteFlow(e, flow.id)}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          className="px-3 py-1 rounded-t-lg bg-green-500 text-white flex items-center space-x-1 whitespace-nowrap"
          onClick={handleAddFlow}
        >
          <PlusIcon />
          <span>New Flow</span>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-gray-100 rounded-lg p-4 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {flows.find((f) => f.id === activeFlowId)?.name || "Flow"}
            </h2>
          </div>

          <div className="bg-white rounded p-2 mb-4">
            <div className="flex border-b overflow-x-auto">
              {sprites.map((sprite) => (
                <div
                  key={sprite.id}
                  className={`px-4 py-2 cursor-pointer ${
                    activeSpriteTab === sprite.id
                      ? "border-b-2 border-green-500 font-medium"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleSelectSpriteTab(sprite.id)}
                >
                  {sprite.name}
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col"
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedOverIndex === null) {
                const blocksForSprite = getBlocksForCurrentSpriteTab();
                setDraggedOverIndex(blocksForSprite.length);
              }
            }}
            onDrop={(e) => handleDrop(e, activeFlowId)}
          >
            <div className="space-y-2 flex-grow">
              {getBlocksForCurrentSpriteTab().map((block, index) => (
                <div
                  key={block.id}
                  className={`${
                    draggedOverIndex === index && draggedOverFlowId === activeFlowId
                      ? "border-t-2 border-blue-500"
                      : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, activeFlowId, index)}
                >
                  <DraggableBlock
                    id={block.id}
                    type={block.type}
                    text={block.text}
                    color={block.color}
                    iconName={block.iconName}
                    iconSize={block.iconSize}
                    iconClass={block.iconClass}
                    action={block.action}
                    targetSpriteId={block.targetSpriteId}
                    onDragStart={(e) => handleDragStart(e, activeFlowId, index)}
                    onDelete={() => handleRemoveBlock(activeFlowId, block.id)}
                  />
                </div>
              ))}

              {draggedOverIndex === getBlocksForCurrentSpriteTab().length && (
                <div className="border-t-2 border-blue-500 h-8"></div>
              )}
            </div>

            {getBlocksForCurrentSpriteTab().length === 0 ? (
              <div
                className="text-center text-gray-500 py-20 my-4 flex-grow flex flex-col justify-center"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggedOverIndex(0);
                }}
              >
                <p className="mb-2">
                  Drag and drop blocks here to create actions for{" "}
                  {sprites.find((s) => s.id === activeSpriteTab)?.name}
                </p>
                <p className="text-sm">
                  Actions added here will be executed when you play the flow
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-xs mt-4">
                Drag more blocks here to add actions
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditingFlowModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Edit Flow</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
              <input
                type="text"
                value={editingFlowName}
                onChange={(e) => setEditingFlowName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseEditFlowModal} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button
                onClick={handleUpdateFlowName}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
