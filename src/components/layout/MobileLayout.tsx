import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import MobileSidebar from "@/components/common/MobileSidebar";

const MobileLayout = ({ children }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Menu
        width={"100%"}
        isOpen={isMenuOpen}
        onStateChange={(state) => setIsMenuOpen(state.isOpen)}
        right
      >
        <MobileSidebar setIsMenuOpen={setIsMenuOpen} />
      </Menu>
      {children}{" "}
    </>
  );
};

export default MobileLayout;
