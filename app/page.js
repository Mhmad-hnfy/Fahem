import Hero from "../Components/Hero";
import Team from "../Components/Team";
import Courses from "../Components/Courses";
import LearningJourney from "../Components/LearningJourney";
import NotificationsDisplay from "../Components/NotificationsDisplay";

export default function Home() {
  return (
    <>
      <Hero />
      <NotificationsDisplay />
      <LearningJourney />
      <Courses />
      <Team />
    </>
  );
}
