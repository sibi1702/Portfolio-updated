import React from 'react';
import { motion } from 'framer-motion';

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 md:mb-4">
            About Me
          </h2>
          <p className="text-base md:text-lg text-gray-300">
            Get to know me better
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-6 md:p-8 md:pt-10 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-lg flex-shrink-0">
              <img
                src="/images/profile.jpg"
                alt="Sibi"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/200?text=Sibi';
                }}
              />
            </div>

            <div className="text-white text-center md:text-left">
              <div className="mb-6 md:mb-4">
                <a
                  href="https://drive.google.com/file/d/1jdolG9C_7S-MwJB-V5l-eocR8jkNIdxE/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/40 text-white rounded-full text-lg font-bold backdrop-blur-sm shadow-xl hover:bg-white/50 transition-all duration-200 hover:scale-105 border-2 border-white/60 inline-flex items-center gap-4 min-w-[140px] justify-center"
                  aria-label="View Resume on Google Drive"
                >
                  <i className="fas fa-file-alt text-xl"></i>
                  <span className="whitespace-nowrap font-bold">Resume</span>
                </a>
              </div>
              <p className="mb-4 text-gray-200 text-sm md:text-base leading-relaxed">
                Full Stack Developer and AI specialist, crafting intelligent solutions at the intersection of web development and artificial intelligence. Expert in React, TypeScript, and Node.js for robust web applications, while leveraging Python and TensorFlow for advanced AI implementations.
              </p>
              <p className="mb-4 text-gray-200 text-sm md:text-base leading-relaxed">
                Deeply involved in Generative AI development, specializing in Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and AI agents. Experienced in building custom LLM applications, knowledge-based chatbots, and intelligent automation systems that transform business processes.
              </p>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                Currently exploring multi-modal AI models, vector databases, and enterprise AI integration patterns to create next-generation software solutions that combine human expertise with artificial intelligence.
              </p>

              <div className="mt-4 md:mt-6 flex gap-6 justify-center md:justify-start">
                <a
                  href="https://github.com/sibi1702"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110"
                  aria-label="GitHub Profile"
                >
                  <i className="fab fa-github text-xl md:text-2xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/sibichandrasekar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110"
                  aria-label="LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in text-xl md:text-2xl"></i>
                </a>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutMe;
