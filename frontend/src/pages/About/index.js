import React, { useEffect } from "react";
import './about.css';

const About = () => {
  
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Prescripto</h1>
        <p>Where Care Meets Convenience</p>
      </section>

      <section className="about-content">
        <h2>My Mission</h2>
        <p>
          Prescripto is my vision to revolutionize healthcare by digitizing prescriptions, 
          making them easily accessible for both doctors and patients.
        </p>

        <h2>Why Prescripto?</h2>
        <ul>
          <li>✔️ Secure & encrypted medical records</li>
          <li>✔️ Seamless doctor-patient interaction</li>
          <li>✔️ Easy appointment booking</li>
          <li>✔️ Cloud-based prescription storage</li>
        </ul>

        <h2>About the Developer</h2>
        <p>
          Prescripto is built solely by me, driven by my passion for technology and 
          healthcare innovation. With a keen interest in software development, I 
          created this platform to bring efficiency to digital prescriptions.
        </p>
      </section>
    </div>
  );
};

export default About;
