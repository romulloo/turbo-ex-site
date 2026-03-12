import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import CatalogPreview from "@/components/CatalogPreview";
import Reviews from "@/components/Reviews";
import Sellers from "@/components/Sellers";
import Location from "@/components/Location";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <CatalogPreview />
      <Reviews />
      <Sellers />
      <Location />
    </>
  );
}
