import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';

interface ProjectData {
  id: number;
  title: string;
  period: string;
  description: string[];
  technologies: string[];
  repoUrl: string;
  publicationUrl?: string;
}

const Projects: React.FC = () => {
  const projectsData: ProjectData[] = [
    {
      id: 1,
      title: 'Air Quality Analytics',
      period: 'Jan 2025 - May 2025',
      description: [
        'Architected a pipeline using Eventstream and Eventhouse to capture and process real-time air quality data from IoT sensors and open datasets.',
        'Developed analytical models in Synapse and built interactive dashboards in Power BI to visualize pollutant levels, temporal trends, and health impact indicators.',
        'Improved data processing and reporting efficiency by 25%, enabling faster insights and more accurate forecasting for air quality monitoring.'
      ],
      technologies: ['Python', 'Pandas', 'Eventstream', 'Eventhouse', 'Synapse', 'Power BI', 'Data Factory'],
      repoUrl: ''
    },
    {
      id: 2,
      title: 'Fraud Detection in Bitcoin Transactions',
      period: 'January 2024 - April 2024',
      description: [
        'Developed a pioneering framework for fraud detection in Bitcoin transactions using machine learning, specifically leveraging the XGBoost algorithm.',
        'Integrated blockchain technology with ensemble stacking models to combat illegal transactions such as money laundering, dark web transactions, and ransomware payments.',
        'Created a system to proactively identify anomalies and deviations from normal transaction behavior, enabling timely intervention to prevent fraudulent activities.'
      ],
      technologies: ['XGBoost', 'Ensemble Stacking', 'Bagging', 'Gradient Boosting', 'Machine Learning', 'Blockchain'],
      repoUrl: 'https://github.com/sibi1702/bitcoin-fraud-detection',
      publicationUrl: 'https://www.irjweb.com/viewarticle.php?aid=A-New-Framework-for-Fraud-Detection-in-Bitcoin-Transactions-Through-Ensemble-Stacking-Model-in-Smart-Cities'
    },
    {
      id: 3,
      title: 'Marine Ship Oil Management System',
      period: 'September 2023 - January 2024',
      description: [
        'Developed a comprehensive solution for shipping companies to optimize fuel consumption, improve efficiency, and enhance profitability.',
        'Implemented tracking of oil usage, trips, revenue, and other key metrics to enable data-driven decision making.',
        'Created a system that leads to significant cost savings and operational enhancements for shipping companies worldwide.'
      ],
      technologies: ['DBMS', 'Cloud Computing', 'Python', 'Machine Learning', 'Deep Learning'],
      repoUrl: 'https://github.com/sibi1702/marine-ship-oil-management'
    },
    {
      id: 4,
      title: 'Autonomous Driving Using Computer Vision',
      period: 'February 2023 - May 2023',
      description: [
        'Utilized computer vision techniques, particularly the YOLO object detection algorithm, along with blur conversion and corner detection methods to identify roads and detect surface defects.',
        'Developed a real-time system using geometric image processing to identify pathways in off-road environments and provide navigational guidance to autonomous vehicles.',
        'Presented a paper on this project at an international conference organized by SAEINDIA and chaired by Amritha Vishwa Vidyapeetham.'
      ],
      technologies: ['R Programming', 'LCD', 'YOLO', 'Machine Learning', 'Computer Vision'],
      repoUrl: 'https://github.com/sibi1702/autonomous-driving-cv'
    },
  ];

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Projects
          </h2>
          <p className="text-lg text-gray-300">
            Here are some of the projects I've worked on
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4"
        >
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              variants={item}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer h-72 sm:h-80 flex flex-col text-left w-full"
                onClick={() => openModal(`project-${project.id}`)}
              >

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>

                <div className="text-gray-300 mb-4 flex-grow overflow-hidden text-sm sm:text-base">
                  {project.description[0].length > 120
                    ? `${project.description[0].substring(0, 120)}...`
                    : project.description[0]}
                </div>

                <div className="mt-auto">
                  <div className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-xs sm:text-sm font-medium">
                    {project.period}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Modals */}
        {projectsData.map((project) => (
          <Modal
            key={`modal-project-${project.id}`}
            isOpen={activeModal === `project-${project.id}`}
            onClose={closeModal}
            title={project.title}
          >
            <div className="space-y-6">
              <div>
                {project.description.map((paragraph, idx) => (
                  <p key={`desc-${project.id}-${idx}`} className="text-gray-300 mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={`tech-${tech}`} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm shadow-sm flex items-center gap-2 hover:bg-white/30 transition-colors border border-white/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  View on GitHub
                </a>
                {project.publicationUrl && (
                  <a
                    href={project.publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm shadow-sm flex items-center gap-2 hover:bg-white/30 transition-colors border border-white/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Show Publication
                  </a>
                )}
              </div>
            </div>
          </Modal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
