import Image from "next/image";
import askNinaLogo from "../../public/logos/with-ask-nina-813x300.png";
import MainExplore from "../components/explore/MainExplore";
export default function Home() {
  return (
    <main className="flex bg-white h-screen flex-col items-center justify-between p-8">
      <div className="relative w-3/5">
        <Image src={askNinaLogo} alt={"ask-nina"} />
      </div>
      <div className="flex-1">
        <MainExplore />
      </div>
    </main>
  );
}
