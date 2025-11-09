import AppButton from "../appButton/appButton";
import Container from "../container/container";


export default function Header() {
  return (
    <Container>
      <div className={`flex  flex-col justify-center  pt-20`}>
        <h1 className="title text-4xl sm:text-5xl text-center">
          The Hub for Every Dev <br /> Event You Can’t Miss
        </h1>
      </div>
      <p className="text-white mx-auto text-center my-5  text-sm sm:text-lg block">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <div className="mt-4">
        <AppButton />
      </div>
    </Container>
  );
}
