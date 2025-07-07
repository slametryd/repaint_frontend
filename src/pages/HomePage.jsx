import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import { useRef } from "react";

const HomePage = () => {
  const berandaRef = useRef(null);
  const tentangKamiRef = useRef(null);
  const layananKamiRef = useRef(null);
  const galeriRef = useRef(null);
  const faqRef = useRef(null);

  return (
    <div>
      <Navbar
        scrollRefs={{
          berandaRef,
          tentangKamiRef,
          layananKamiRef,
          galeriRef,
          faqRef,
        }}
      />
      <Home
        sectionRefs={{
          berandaRef,
          tentangKamiRef,
          layananKamiRef,
          galeriRef,
          faqRef,
        }}
      />
      <Footer />
    </div>
  );
};

export default HomePage;
