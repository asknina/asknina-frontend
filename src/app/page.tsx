import Image from "next/image";
import askNinaLogo from "../../public/logos/with-ask-nina-813x300.png";
import MainExplore from "../components/explore/MainExplore";

function Home() {
  return (
    <main className="flex h-screen flex-col items-center px-8">
      <div className="relative w-1/2">
        <Image src={askNinaLogo} alt={"ask-nina"} priority />
      </div>
      <div className="flex-1 flex">
        <MainExplore />
      </div>
    </main>
  );
}

export default Home;
