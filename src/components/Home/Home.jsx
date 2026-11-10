import React from "react";
import HeroSection from "../../subComponents/HeroSection";
import TopVillas from "../../subComponents/TopVillas";
import Regions from "../../subComponents/Regions";
import OurSpecialities from "../../subComponents/OurSpecialities";
import Host from "../../subComponents/Host";
import About from "../../subComponents/About";
import Contact from "../../subComponents/Contact";
import { useVillasData } from "../../hooks/useVillasData";
import PageContainer from "../Layout/PageContainer";

const Home = () => {
  const { villas, isLoading, error, retry } = useVillasData();

  return (
    <article className="space-y-10 md:space-y-14" aria-label="Home page content">
      <HeroSection />
      <PageContainer className="space-y-10 md:space-y-14">
        <TopVillas villas={villas} isLoading={isLoading} error={error} onRetry={retry} />
        <Regions villas={villas} isLoading={isLoading} />
        <OurSpecialities />
      </PageContainer>
      <Host />
      <PageContainer className="space-y-10 pb-4 md:space-y-14 md:pb-8">
        <About />
        <Contact />
      </PageContainer>
    </article>
  );
};

export default Home;
