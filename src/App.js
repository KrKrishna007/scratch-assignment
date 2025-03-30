import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { FlowProvider } from "./contexts/FlowContext";
import { SpritesProvider } from "./contexts/SpritesContext";

export default function App() {
  return (
    <SpritesProvider>
      <FlowProvider>
        <div className="bg-blue-100 pt-6 font-sans">
          <div className="h-screen overflow-hidden flex flex-row  ">
            <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
              <Sidebar /> <MidArea />
            </div>
            <div className="w-3/5 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
              <PreviewArea />
            </div>
          </div>
        </div>
      </FlowProvider>
    </SpritesProvider>
  );
}
