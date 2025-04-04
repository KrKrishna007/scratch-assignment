import React, { useState, useEffect, useRef } from "react";
import Sprite from "../sprites/Sprite";
import { useFlowContext } from "../contexts/FlowContext";
import { useSpritesContext } from "../contexts/SpritesContext";
import PlusIcon from "../icons/PlusIcon";

export default function PreviewArea() {
  const { flows, activeFlowId } = useFlowContext();
  const {
    sprites,
    addSprite,
    removeSprite,
    updateSpriteState,
    getSprite,
    updateSpriteName,
  } = useSpritesContext();

  const [isExecuting, setIsExecuting] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  const [isAddingSpriteModalOpen, setIsAddingSpriteModalOpen] = useState(false);
  const [newSpriteName, setNewSpriteName] = useState("");
  const [newSpriteType, setNewSpriteType] = useState("cat");
  const [isEditingSpriteModalOpen, setIsEditingSpriteModalOpen] =
    useState(false);
  const [editingSpriteId, setEditingSpriteId] = useState(null);
  const [editingSpriteName, setEditingSpriteName] = useState("");
  const [animationRepeatCount, setAnimationRepeatCount] = useState(0);
  const [repeatingSpriteIds, setRepeatingSpriteIds] = useState(new Set());

  const sayTimeoutRef = useRef({});
  const executionTimeoutRef = useRef(null);
  const lastActionRef = useRef(null);

  useEffect(() => {
    return () => {
      Object.values(sayTimeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });

      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
      }
    };
  }, []);

  const moveXBy50Action = (spriteId, spriteState) => {
    const viewportWidth = window.innerWidth;
    const divWidthInPixels = viewportWidth * (3 / 5);
    if (spriteState.x + 50 + 100 > divWidthInPixels) {
      return { ...spriteState, x: 0, sayMessage: null };
    } else {
      return { ...spriteState, x: spriteState.x + 50, sayMessage: null };
    }
  };

  const moveYBy50Action = (spriteId, spriteState) => {
    const viewportHeight = window.innerHeight;
    if (spriteState.y + 50 + 200 > viewportHeight) {
      return { ...spriteState, y: 0, sayMessage: null };
    } else {
      return { ...spriteState, y: spriteState.y + 50, sayMessage: null };
    }
  };

  const turnAnticlockwise45Action = (spriteId, spriteState) => {
    return {
      ...spriteState,
      rotation: spriteState.rotation - 45,
      sayMessage: null,
    };
  };

  const turnClockwise45Action = (spriteId, spriteState) => {
    return {
      ...spriteState,
      rotation: spriteState.rotation + 45,
      sayMessage: null,
    };
  };

  const goToOriginAction = (spriteId, spriteState) => {
    return { ...spriteState, x: 0, y: 0, sayMessage: null };
  };

  const rotate360Action = (spriteId, spriteState) => {
    return {
      ...spriteState,
      rotation: spriteState.rotation + 360,
      sayMessage: null,
    };
  };

  const moveXY50Action = (spriteId, spriteState) => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const divWidthInPixels = viewportWidth * (3 / 5);
    if (
      spriteState.y + 50 + 200 > viewportHeight ||
      spriteState.x + 50 + 100 > divWidthInPixels
    )
      return { ...spriteState, x: 0, y: 0, sayMessage: null };
    return {
      ...spriteState,
      x: spriteState.x + 50,
      y: spriteState.y + 50,
      sayMessage: null,
    };
  };

  const goToRandomPositionAction = (spriteId, spriteState) => {
    const xPos = Math.floor(Math.random() * 300) - 150;
    const yPos = Math.floor(Math.random() * 300) - 150;
    return { ...spriteState, x: xPos, y: yPos, sayMessage: null };
  };

  const sayHelloAction = (spriteId, spriteState) => {
    return { ...spriteState, sayMessage: "Hello!" };
  };

  const sayHelloFor1SecAction = (spriteId, spriteState) => {
    return {
      ...spriteState,
      sayMessage: "Hello!",
      sayDuration: 1000,
    };
  };

  const increaseSizeAction = (spriteId, spriteState) => {
    return { ...spriteState, size: spriteState.size + 10, sayMessage: null };
  };

  const decreaseSizeAction = (spriteId, spriteState) => {
    return {
      ...spriteState,
      size: Math.max(10, spriteState.size - 10),
      sayMessage: null,
    };
  };

  const repeatWholeAnimationAction = (spriteId, spriteState) => {
    return {
      ...spriteState,
      sayMessage: null,
      _shouldRepeat: true,
      _spriteToRepeat: spriteId,
    };
  };

  const actionMap = {
    moveXBy50: moveXBy50Action,
    moveYBy50: moveYBy50Action,
    turnAnticlockwise45: turnAnticlockwise45Action,
    turnClockwise45: turnClockwise45Action,
    goToOrigin: goToOriginAction,
    rotate360: rotate360Action,
    moveXY50: moveXY50Action,
    goToRandomPosition: goToRandomPositionAction,
    sayHello: sayHelloAction,
    sayHelloFor1Sec: sayHelloFor1SecAction,
    increaseSize: increaseSizeAction,
    decreaseSize: decreaseSizeAction,
    repeatWholeAnimation: repeatWholeAnimationAction,
  };

  const getFixedPosition = (index) => {
    return { x: index * 100, y: 0 };
  };

  const preCalculateSteps = (flow) => {
    if (!flow) return [];

    const initialStates = {};
    sprites.forEach((sprite, index) => {
      const position = getFixedPosition(index);
      initialStates[sprite.id] = {
        x: position.x,
        y: position.y,
        rotation: 0,
        size: 100,
        sayMessage: null,
        visible: true,
      };
    });

    const spriteBlocks = {};
    sprites.forEach((sprite) => {
      spriteBlocks[sprite.id] = flow.blocks.filter(
        (block) => block.targetSpriteId === sprite.id
      );
    });

    const maxSteps = Math.max(
      ...Object.values(spriteBlocks).map((blocks) => blocks.length),
      0
    );
    if (maxSteps === 0) return [];

    const steps = [];
    let lastActions = {};

    steps.push({ ...initialStates });

    for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
      const prevStepStates = steps[steps.length - 1];
      const currentStepStates = { ...prevStepStates };
      currentStepStates.spritesToRepeat = new Set();

      sprites.forEach((sprite) => {
        const blocks = spriteBlocks[sprite.id];
        if (blocks && blocks[stepIndex]) {
          const block = blocks[stepIndex];

          if (actionMap[block.action]) {
            const prevState = currentStepStates[sprite.id];
            const lastAction = lastActions[sprite.id];

            const newState = actionMap[block.action](
              sprite.id,
              prevState,
              lastAction
            );

            currentStepStates[sprite.id] = newState;

            if (block.action === "repeatWholeAnimation") {
              currentStepStates.spritesToRepeat.add(sprite.id);
            }

            lastActions[sprite.id] = {
              spriteId: sprite.id,
              action: block.action,
            };
          }
        }
      });

      steps.push({ ...currentStepStates });
    }

    return steps;
  };

  const executeFlow = async () => {
    const activeFlow = flows.find((f) => f.id === activeFlowId);
    if (!activeFlow || isExecuting) return;

    const steps = preCalculateSteps(activeFlow);
    if (steps.length === 0) return;

    setIsExecuting(true);
    setCurrentBlockIndex(-1);
    setAnimationRepeatCount(0);

    sprites.forEach((sprite) => {
      updateSpriteState(sprite.id, steps[0][sprite.id]);
    });

    await executeAnimationSequence(steps, 1, 0, activeFlow);
  };

  const executeAnimationSequence = async (
    steps,
    startStep,
    repeatCount,
    flow
  ) => {
    let currentStep = startStep;

    const runNextStep = async () => {
      if (currentStep < steps.length) {
        setCurrentBlockIndex(currentStep - 1);

        const time = [];
        sprites.forEach((sprite) => {
          if (steps[currentStep][sprite.id]) {
            updateSpriteState(sprite.id, steps[currentStep][sprite.id]);
            time.push(steps[currentStep][sprite.id]);
          }
        });

        const maxTime = Math.max(...time.map((t) => t.sayDuration || 0));

        await new Promise((resolve, _) => {
          setTimeout(() => {
            resolve();
          }, maxTime);
        });

        const spritesToRepeat = steps[currentStep].spritesToRepeat || new Set();

        currentStep++;

        if (spritesToRepeat.size > 0) {
          executionTimeoutRef.current = setTimeout(() => {
            const newRepeatCount = repeatCount + 1;
            setAnimationRepeatCount(newRepeatCount);

            setRepeatingSpriteIds(new Set(spritesToRepeat));

            const currentSpriteStates = {};
            sprites.forEach((sprite) => {
              const currentStepIndex = currentStep - 1;
              if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
                currentSpriteStates[sprite.id] = steps[currentStepIndex][
                  sprite.id
                ] || {
                  x: sprite.state.x,
                  y: sprite.state.y,
                  rotation: sprite.state.rotation,
                  size: sprite.state.size,
                  sayMessage: sprite.state.sayMessage,
                  visible: sprite.state.visible,
                };
              }
            });

            const repeatingFlow = { ...flow };
            repeatingFlow.blocks = flow.blocks.filter((block) =>
              spritesToRepeat.has(block.targetSpriteId)
            );

            const newSteps = recalculateStepsFromCurrentState(
              repeatingFlow,
              currentSpriteStates,
              spritesToRepeat
            );

            executeAnimationSequence(
              newSteps,
              1,
              newRepeatCount,
              repeatingFlow
            );
          }, 800);
        } else {
          executionTimeoutRef.current = setTimeout(runNextStep, 500);
        }
      } else {
        setIsExecuting(false);
        setCurrentBlockIndex(-1);
      }
    };

    await runNextStep();
  };
  const recalculateStepsFromCurrentState = (
    flow,
    currentSpriteStates,
    spritesToRepeat
  ) => {
    if (!flow) return [];

    const initialStates = { ...currentSpriteStates };

    const spriteBlocks = {};
    sprites.forEach((sprite) => {
      if (!spritesToRepeat || spritesToRepeat.has(sprite.id)) {
        spriteBlocks[sprite.id] = flow.blocks.filter(
          (block) => block.targetSpriteId === sprite.id
        );
      }
    });

    const maxSteps = Math.max(
      ...Object.values(spriteBlocks).map((blocks) => blocks.length),
      0
    );
    if (maxSteps === 0) return [];

    const steps = [];
    let lastActions = {};

    steps.push({ ...initialStates });

    for (let stepIndex = 0; stepIndex < maxSteps; stepIndex++) {
      const prevStepStates = steps[steps.length - 1];
      const currentStepStates = { ...prevStepStates };
      currentStepStates.spritesToRepeat = new Set();

      sprites.forEach((sprite) => {
        if (!spritesToRepeat || spritesToRepeat.has(sprite.id)) {
          const blocks = spriteBlocks[sprite.id];
          if (blocks && blocks[stepIndex]) {
            const block = blocks[stepIndex];

            if (block.action === "repeatWholeAnimation") {
              currentStepStates.spritesToRepeat.add(sprite.id);
            }

            if (actionMap[block.action]) {
              const prevState = currentStepStates[sprite.id];
              const lastAction = lastActions[sprite.id];

              const newState = actionMap[block.action](
                sprite.id,
                prevState,
                lastAction
              );

              currentStepStates[sprite.id] = newState;

              lastActions[sprite.id] = {
                spriteId: sprite.id,
                action: block.action,
              };
            }
          }
        }
      });

      steps.push({ ...currentStepStates });
    }

    return steps;
  };

  const stopExecution = () => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = null;
    }
    setIsExecuting(false);
    setCurrentBlockIndex(-1);
    setRepeatingSpriteIds(new Set());
  };

  const handleOpenAddSpriteModal = () => {
    if (!isExecuting) {
      setIsAddingSpriteModalOpen(true);
      setNewSpriteName(`Sprite ${sprites.length + 1}`);
      setNewSpriteType("cat");
    }
  };

  const handleCloseAddSpriteModal = () => {
    setIsAddingSpriteModalOpen(false);
  };

  const handleAddSprite = () => {
    const spriteIndex = sprites.length;
    const position = getFixedPosition(spriteIndex);
    const id = addSprite(newSpriteType, newSpriteName, position.x, position.y);
    handleCloseAddSpriteModal();
  };

  const handleOpenEditSpriteModal = (e, spriteId) => {
    e.stopPropagation();
    if (!isExecuting) {
      const sprite = getSprite(spriteId);
      if (sprite) {
        setEditingSpriteId(spriteId);
        setEditingSpriteName(sprite.name);
        setIsEditingSpriteModalOpen(true);
      }
    }
  };

  const handleCloseEditSpriteModal = () => {
    setIsEditingSpriteModalOpen(false);
    setEditingSpriteId(null);
  };

  const handleUpdateSpriteName = () => {
    if (editingSpriteId && editingSpriteName) {
      updateSpriteName(editingSpriteId, editingSpriteName);
      handleCloseEditSpriteModal();
    }
  };

  const handleRemoveSprite = (e, spriteId) => {
    e.stopPropagation();
    if (!isExecuting) {
      removeSprite(spriteId);
    }
  };

  const activeFlow = flows.find((f) => f.id === activeFlowId);

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 w-full">
      <div className="flex justify-between mb-2 border-b pb-2">
        <div className="flex space-x-2 overflow-x-auto">
          {sprites.map((sprite) => (
            <div
              key={sprite.id}
              className={`px-3 py-1 rounded cursor-pointer flex items-center bg-blue-500 text-white`}
            >
              <span>{sprite.name}</span>
              <button
                className="ml-2 text-xs bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                onClick={(e) => handleOpenEditSpriteModal(e, sprite.id)}
                disabled={isExecuting}
              >
                ✎
              </button>
              {sprites.length > 1 && (
                <button
                  className="ml-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                  onClick={(e) => handleRemoveSprite(e, sprite.id)}
                  disabled={isExecuting}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          onClick={handleOpenAddSpriteModal}
          disabled={isExecuting}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="flex-1 relative bg-white rounded-lg mb-4 overflow-hidden w-full min-h-[400px] p-4">
        {sprites.map((sprite, index) => (
          <div
            key={sprite.id}
            className="absolute"
            style={{
              cursor: isExecuting ? "default" : "pointer",
              pointerEvents: isExecuting ? "none" : "auto",
            }}
            onClick={() => handleSpriteClick(sprite.id)}
          >
            <Sprite
              id={sprite.id}
              type={sprite.type}
              x={sprite.state.x}
              y={sprite.state.y}
              updateSpriteState={updateSpriteState}
              sayDuration={sprite.state.sayDuration}
              rotation={sprite.state.rotation}
              size={sprite.state.size}
              sayMessage={sprite.state.sayMessage}
              visible={sprite.state.visible}
            />
          </div>
        ))}

        {isExecuting &&
          animationRepeatCount > 0 &&
          repeatingSpriteIds.size === 0 && (
            <div className="absolute top-2 right-2 bg-red-100 border border-red-400 text-red-800 px-2 py-1 rounded-md text-xs">
              Repeat: {animationRepeatCount}
            </div>
          )}
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 justify-center mb-2">
          <button
            onClick={executeFlow}
            disabled={
              isExecuting || !activeFlow || activeFlow.blocks.length === 0
            }
            className={`px-4 py-2 rounded ${
              isExecuting || !activeFlow || activeFlow.blocks.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white"
            }`}
          >
            ▶ Play Flow
          </button>
          {isExecuting && (
            <button
              onClick={stopExecution}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              ■ Stop
            </button>
          )}
          <button
            onClick={() => {
              sprites.forEach((sprite, index) => {
                updateSpriteState(sprite.id, {
                  x: getFixedPosition(index).x,
                  y: getFixedPosition(index).y,
                  rotation: 0,
                  size: 100,
                  sayMessage: null,
                });
              });
            }}
            className="px-4 py-2 rounded bg-blue-500 text-white"
            disabled={isExecuting}
          >
            Reset Sprites
          </button>
        </div>
      </div>

      {lastActionRef.current && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Last action: {lastActionRef.current.actionName}
        </div>
      )}

      {isAddingSpriteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Add New Sprite</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprite Name
              </label>
              <input
                type="text"
                value={newSpriteName}
                onChange={(e) => setNewSpriteName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprite Type
              </label>
              <select
                value={newSpriteType}
                onChange={(e) => setNewSpriteType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="cat">Cat</option>
                <option value="baseball">Baseball</option>
                <option value="bear">Bear</option>
                <option value="person">Person</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseAddSpriteModal}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSprite}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Sprite
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingSpriteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Edit Sprite</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sprite Name
              </label>
              <input
                type="text"
                value={editingSpriteName}
                onChange={(e) => setEditingSpriteName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseEditSpriteModal}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSpriteName}
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
