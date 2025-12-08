import Container from "../container/container";
import SkeletonEventCard from "../skeletons/eventCard";

export default function FallBack() {
  return (
    <>   {[...Array(6)].map((_, i) => (
        <SkeletonEventCard key={i} />
      ))}</>
   
   
  );
}
