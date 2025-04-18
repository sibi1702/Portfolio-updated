import React from 'react';
import { motion } from 'framer-motion';
import TypewriterText from '../components/ui/TypewriterText';
import Skills from '../components/sections/Skills';
import Footer from '../components/layout/Footer';
import SpaceScene from '../components/3d/SpaceScene';
import AboutMe from '../components/sections/AboutMe';
import Navbar from '../components/layout/Navbar';
import Contact from '../components/sections/Contact';
import ScrollIndicator from '../components/ui/ScrollIndicator';
import Timeline from '../components/sections/Timeline';
import Projects from '../components/sections/Projects';
import Honors from '../components/sections/Honors';

const Home: React.FC = () => {
  return (
    <main className="relative z-20">
      {/* Hero Section */}
      <motion.section
        id="home"
        className="min-h-screen flex items-center justify-center relative pt-16 pb-8 md:pt-0 md:pb-0 md:h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
            {/* Text content */}
            <motion.div
              className="text-center md:text-left text-white w-full md:w-2/5 lg:w-1/3 md:pr-4 z-10 relative order-2 md:order-1 mt-4 md:mt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg"
              >
                Hi, I'm <span className="text-white font-extrabold">Sibi Chandra Sekar</span>
              </h1>

              <div className="h-16 md:h-20">
                <TypewriterText
                  texts={[
                    "What I do?",
                    "Full Stack Developement. . .",
                    "AI/ML Developement. . .",
                    "Generative AI Development. . .",
                    "Problem Solving. . .",
                    "Tech Enthusiast. . .",
                    "Creative Coding. . ."
                  ]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  delayBetweenTexts={2000}
                />
              </div>
              <motion.div
                className="mt-6 md:mt-8 flex justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <a
                  href="#contact"
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-5 md:py-3 md:px-6 rounded-full
                           transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/30"
                >
                  Get In Touch
                </a>
              </motion.div>
            </motion.div>

            {/* 3D Model */}
            <motion.div
              className="w-full md:w-3/5 lg:w-3/4 xl:w-4/5 h-[250px] sm:h-[300px] md:h-full order-1 md:order-2 md:absolute md:right-0 md:top-0 md:bottom-0 md:z-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="h-full"
              >
                {/* Original space station model */}
                <SpaceScene key="original-space-station" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <ScrollIndicator />
      </motion.section>

      <Navbar />

      {/* About Me Section */}
      <AboutMe />

      {/* Timeline Section */}
      <Timeline />

      {/* Projects Section */}
      <Projects />

      {/* Honors Section */}
      <Honors />

      {/* Skills Section */}
      <motion.section
        id="skills"
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Skills />
      </motion.section>

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;
