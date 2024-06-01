'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import Image from 'next/image';
import { Helmet } from 'react-helmet';

const App = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleContact = () => {
    // Placeholder - Replace this with actual navigation or modal popup for contact
    console.log('Contact Us action triggered');
  };

  const handleLearnMore = () => {
    // Placeholder - Replace with actual navigation or a method to show more information
    console.log('Learn More action triggered');
  };

  return (
    <div className={styles.container}>

      <Image
        src='/images/background-lowres.jpg'
        height={1000}
        width={1000}
        className={styles.background}
      />
      <section className={styles.headerSection}>
        <nav className={styles.navbar}>
          <a href='/'>
            <div className={styles.navbarHome}>
              <strong>AgentBond.ai</strong>
            </div>
          </a>
          <a href='/login'>Login</a>
        </nav>
      </section>
      <section className={styles.heroSectionContainer}>
        <div className={styles.heroSection}>
          <Image 
            src='/images/logo.svg'
            height={144}
            width={144}
            className={styles.logo}
          />
          <div className={styles.titleContainer}>
            <p className={styles.welcome}>Welcome to</p>
            <h1>AgentBond.ai</h1>
          </div>
          <div className={styles.subtitleContainer}>
            <h2 className={styles.subtitle}>The evolution of tech consulting <br/><strong>has arrived</strong></h2>
            <div className={styles.subtitleContent}>
              <p> At AgentBond.ai, we are redefining the boundaries of technology consulting.</p>
              <p> Imagine having an advisor who is not only the fastest and the smartest but also the most cost-effective solution you've ever worked with.</p>
              <p> That's AgentBond.ai, your future technology consultancy companion.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.whatIsBondContainer}>
          <h2>What is AgentBond.ai?</h2>
          <div className={styles.whatIsBond}>
            <p>
            AgentBond.ai stands at the forefront of a new era where "people" at your company might not be human in the traditional sense.
            They are AI-powered agents capable of advising and completing tasks on your behalf.
            </p>
            <p>
            AgentBond isn't just a consultant; it's an evolution in how we implement and optimize technology across businesses.
            </p>
          </div>
        </div>

        <div className={styles.powerOfBondContainer}>
          <h2>The Power of Bond</h2>
          <div className={styles.powerOfBond}>
            <div>
              <h3>Certified Excellence</h3>
              <p>
              With 30 HubSpot certifications and an average exam score of 98%, 
              AgentBond.ai showcases unparalleled capability and expertise, 
              surpassing human consultants significantly.
              </p>
            </div>
            <div>
              <h3>Optimized Tech Stack Implementation</h3>
              <p>
              Our legacy with SonaMation speaks for itself. 
              Over three years, we have led the charge in tech stack optimization, 
              particularly in HubSpot implementations. 
              AgentBond.ai is our next step in revolutionizing tech implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2>Bond's Edge</h2>
        <div className={styles.features}>
          <div className={styles.featureTitle}>
            <h3>Speed</h3>
            <p className={styles.featureText}>
            Engage in near real-time conversations and get instant actions on your behalf, 
            accelerating your business operations like never before.
            </p>
          </div>
          <div className={styles.featureTitle}>
            <h3>Intelligence</h3>
            <p className={styles.featureText}>
            Armed with an unfailing memory and knowledge about your tech stack 
            that's 20 times more than what any human consultant can offer, 
            AgentBond ensures your business gets the smart solution it deserves.
            </p>
          </div>
          <div className={styles.featureTitle}>
            <h3>Cost-Effectiveness</h3>
            <p className={styles.featureText}>
            Why spend more when you can obtain superior consultancy services 
            at less than 25% of the cost of traditional consultants? 
            AgentBond is the prudent choice for your bottom line.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.whyUsSection}>
        <h2>Why Choose AgentBond.ai?</h2>
        <p>Faster, Smarter, and More Affordable Than Any Alternative</p>
        <p>
        Choosing AgentBond.ai means not just stepping into the future of tech consultancy but leaping ahead. 
        Our AI-powered platform is designed to transform the way businesses like yours implement and optimize their tech stacks, 
        delivering efficiency, intelligence, and affordability at unprecedented levels.
        </p>
        <p>
        Prepare to Elevate your business with AgentBond.ai — 
        the smartest, fastest, and most cost-effective technology consultant you'll ever work with.
        </p>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to Experience the Future?</h2>
        <button onClick={handleLogin}>Login</button>
      </section>
    </div>
  );
};

export default App;