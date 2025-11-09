import Image from "next/image";
import Container from "../container/container";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <div className="relative flex flex-row h-[50px]  justify-between items-center">
        <Container>
          <div className="relative flex flex-row   justify-between items-center text-white">
            <div className="z-10 flex flex-row items-center gap-3">
              <Image
                alt="site_logo"
                src={"/logo.svg"}
                width={30}
                height={30}
                quality={100}
              />
              <div className="hidden sm:block">
                <i>Dev</i>Events
              </div>
            </div>
            <ul className="flex flex-row gap-3 z-10">
              <Link href={"/"}>Home</Link>
              <Link href={"/events"}>Events</Link>
              <Link href={"/create-events"}>Create Events</Link>
            </ul>
          </div>
        </Container>
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
      </div>
    </nav>
  );
}
