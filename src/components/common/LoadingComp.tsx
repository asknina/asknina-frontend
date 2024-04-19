import Image from "next/image";
import React from "react";
import PulseLoader from "react-spinners/PulseLoader";
import askNinaLogo from "../../../public/logos/with-ask-nina-813x300.png";
import MainContainer from "./MainContainer";

const LoadingComp = () => {
  return (
    <MainContainer>
      <div className="flex relative w-1/2">
        <Image src={askNinaLogo} alt={"ask-nina"} priority />
      </div>
      <PulseLoader color={"#423EEE"} size={12} />
    </MainContainer>
  );
};

export default LoadingComp;
