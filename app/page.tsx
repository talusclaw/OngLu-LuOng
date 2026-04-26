import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Timeline from "@/app/components/Timeline";
import Gallery from "@/app/components/Gallery";
import Messages from "@/app/components/Messages";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Timeline />
      <Gallery />
      <Messages />
      <Footer />
    </main>
  );
}
