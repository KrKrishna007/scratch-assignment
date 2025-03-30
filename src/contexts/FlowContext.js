import React, { createContext, useContext, useState } from "react";

const FlowContext = createContext();

export const useFlowContext = () => useContext(FlowContext);

export const FlowProvider = ({ children }) => {
  const [flows, setFlows] = useState([{ id: "flow-1", name: "Flow 1", blocks: [] }]);

  const [activeFlowId, setActiveFlowId] = useState("flow-1");

  const addFlow = () => {
    const newFlowId = `flow-${flows.length + 1}`;
    const newFlow = {
      id: newFlowId,
      name: `Flow ${flows.length + 1}`,
      blocks: [],
    };

    setFlows((prevFlows) => [...prevFlows, newFlow]);
    setActiveFlowId(newFlowId);
    return newFlowId;
  };

  const deleteFlow = (flowId) => {
    if (flows.length <= 1) return;

    if (activeFlowId === flowId) {
      const newActiveFlow = flows.find((flow) => flow.id !== flowId);
      if (newActiveFlow) {
        setActiveFlowId(newActiveFlow.id);
      }
    }

    setFlows((prevFlows) => prevFlows.filter((flow) => flow.id !== flowId));
  };

  const addBlockToFlow = (flowId, block) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) => {
        if (flow.id === flowId) {
          return {
            ...flow,
            blocks: [
              ...flow.blocks,
              {
                ...block,
                id: `block-${flow.blocks.length + 1}`,
                targetSpriteId: block.targetSpriteId || null,
              },
            ],
          };
        }
        return flow;
      })
    );
  };

  const removeBlockFromFlow = (flowId, blockId) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) => {
        if (flow.id === flowId) {
          return {
            ...flow,
            blocks: flow.blocks.filter((block) => block.id !== blockId),
          };
        }
        return flow;
      })
    );
  };

  const moveBlockInFlow = (flowId, startIndex, endIndex) => {
    const flow = flows.find((f) => f.id === flowId);
    if (!flow) return;

    const newBlocks = [...flow.blocks];
    const [removed] = newBlocks.splice(startIndex, 1);
    newBlocks.splice(endIndex, 0, removed);

    setFlows((prevFlows) =>
      prevFlows.map((f) => (f.id === flowId ? { ...f, blocks: newBlocks } : f))
    );
  };

  const updateFlowName = (flowId, name) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) => {
        if (flow.id === flowId) {
          return {
            ...flow,
            name,
          };
        }
        return flow;
      })
    );
  };

  return (
    <FlowContext.Provider
      value={{
        flows,
        activeFlowId,
        setActiveFlowId,
        addFlow,
        deleteFlow,
        addBlockToFlow,
        removeBlockFromFlow,
        moveBlockInFlow,
        updateFlowName,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
