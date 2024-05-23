import React from "react";
import Dropdown, { Option } from "react-dropdown";
import "react-dropdown/style.css";

interface DropdownProps {
  onSelect: (arg: Option) => void;
  options: Option[];
  defaultOption?: Option;
  style?: string;
}

const DropdownComp = ({
  onSelect,
  options,
  defaultOption,
  style = "",
}: DropdownProps) => {
  const defaultOptionSelected = defaultOption || options[0];
  return (
    <div className={`w-full relative ${style}`}>
      <Dropdown
        options={options}
        onChange={onSelect}
        value={defaultOptionSelected}
        placeholder="Select an option"
        menuClassName="border border-primaryPurple"
        controlClassName="border !border-b-primaryPurple !p-1"
      />
    </div>
  );
};

export default DropdownComp;
