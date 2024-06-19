import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/common/Sidebar";

const DesktopLayout = ({ children }: any) => {
  return (
    <PanelGroup autoSaveId="example" direction="horizontal">
      <Panel defaultSize={30} maxSize={40} minSize={20}>
        <Sidebar />
      </Panel>
      <PanelResizeHandle />
      <Panel>{children}</Panel>
    </PanelGroup>
  );
};

export default DesktopLayout;
