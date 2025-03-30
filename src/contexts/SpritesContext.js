import React, { createContext, useContext, useState } from "react";

const SpritesContext = createContext();

export const useSpritesContext = () => useContext(SpritesContext);

export const SpritesProvider = ({ children }) => {
  const [sprites, setSprites] = useState([
    {
      id: "sprite-1",
      name: "Cat",
      type: "cat",
      state: {
        x: 0,
        y: 0,
        rotation: 0,
        size: 100,
        sayMessage: null,
        sayDuration: null,
        visible: true,
      },
    },
  ]);

  const [activeSprite, setActiveSprite] = useState("sprite-1");

  const addSprite = (type, name, initialX = 0, initialY = 0) => {
    const newId = `sprite-${sprites.length + 1}`;
    const defaultName = name || `Sprite ${sprites.length + 1}`;

    const newSprite = {
      id: newId,
      name: defaultName,
      type: type || "cat",
      state: {
        x: initialX,
        y: initialY,
        rotation: 0,
        size: 100,
        sayMessage: null,
        sayDuration: null,
        visible: true,
      },
    };

    setSprites((prevSprites) => [...prevSprites, newSprite]);
    setActiveSprite(newId);
    return newId;
  };

  const removeSprite = (spriteId) => {
    if (sprites.length <= 1) return;

    setSprites((prevSprites) => prevSprites.filter((sprite) => sprite.id !== spriteId));

    if (activeSprite === spriteId) {
      setActiveSprite(sprites.find((sprite) => sprite.id !== spriteId)?.id);
    }
  };

  const updateSpriteState = (spriteId, newState) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => {
        if (sprite.id === spriteId) {
          return {
            ...sprite,
            state: {
              ...sprite.state,
              ...newState,
            },
          };
        }
        return sprite;
      })
    );
  };

  const updateSpriteName = (spriteId, newName) => {
    setSprites(
      sprites.map((sprite) => {
        if (sprite.id === spriteId) {
          return {
            ...sprite,
            name: newName,
          };
        }
        return sprite;
      })
    );
  };

  const getSprite = (spriteId) => {
    return sprites.find((sprite) => sprite.id === spriteId);
  };

  const getActiveSprite = () => {
    return sprites.find((sprite) => sprite.id === activeSprite);
  };

  return (
    <SpritesContext.Provider
      value={{
        sprites,
        activeSprite,
        setActiveSprite,
        addSprite,
        removeSprite,
        updateSpriteState,
        updateSpriteName,
        getSprite,
        getActiveSprite,
      }}
    >
      {children}
    </SpritesContext.Provider>
  );
};
