import Container from "@/components/container/container";
import CreateEventForm from "@/components/createForm/createForm";
import FormInput from "@/components/formInput/formInput";

export default function Page() {
  return (
    <div className="py-10  w-full bg-linear-to-t from-black to-header-gradient-top -mt-[50px]">
      <Container>
        <section>
          <div className="flex flex-row justify-center pt-10 pb-2">
            <h1 className="title text-4xl sm:text-5xl text-center mx-auto">
              Create an Event
            </h1>
          </div>
        </section>
        <section className="pt-10">
          <CreateEventForm/>
        </section>
      </Container>
    </div>
  );
}
