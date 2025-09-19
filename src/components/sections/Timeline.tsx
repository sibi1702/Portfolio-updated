import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';


const Timeline: React.FC = () => {
  const educationData = [
    {
      id: 1,
      institution: 'Illinois Institute of Technology, Chicago, IL',
      degree: 'Master of Science, Computer Science',
      gpa: 'GPA 3.3',
      period: 'August 2024 - December 2025',
    },
    {
      id: 2,
      institution: 'Anna University, Chennai, India',
      degree: 'Bachelor of Technology, Computer Science',
      gpa: 'GPA 3.6',
      period: 'July 2020 - May 2024',
    },
  ];

  const experienceData = [
    {
      id: 1,
      role: 'Data Engineer Intern',
      company: 'SkyIT Services | Subsidiary of GBCS Group',
      website: 'https://www.skyit.services',
      period: 'September 2024 – February 2025',
      responsibilities: [
        'Designed and optimized cloud-native data pipelines in AWS Glue and Lambda, automating proposal file ingestion and processing, which cut manual handling by 60% and improved document versioning/access speed by 35%.',
        'Integrated proposal and activity datasets into AWS S3 and Redshift, enabling scalable storage and efficient analytics with Athena queries.',
        'Implemented data validation and quality checks using Python, AWS Glue jobs, and CloudWatch alerts, ensuring accuracy and consistency for automated reporting pipelines.',
      ],
    },
    {
      id: 2,
      role: 'Data Engineer',
      company: 'Ardhas Technology India Private Limited, India',
      website: 'https://www.ardhas.com',
      period: 'May 2023 - July 2024',
      duration: '1 Year & 2 months',
      responsibilities: [
        'Built ETL pipelines using Python, integrating multi-country embassy data into Snowflake and Oracle to support internal reporting and analytics for 60+ Indian embassies.',
        'Developed data workflows with AWS Glue and S3, processing 100K+ embassy records/day across multiple reporting pipelines.',
        'Orchestrated end-to-end embassy data workflows using Apache Airflow, improving reliability and monitoring of daily reporting tasks.',
        'Automated data ingestion from embassy portals and global datasets via API Gateway, increasing reporting update frequency by 40%.',
      ],
    },
    {
      id: 3,
      role: 'Data Analyst',
      company: 'Biztech Softsys Pte Ltd, Singapore',
      website: 'https://www.neoehs.com',
      period: 'January 2023 - April 2023',
      responsibilities: [
        'Analyzed and integrated EHS datasets (incidents, risks, permits, inspections) using SQL and Python, generating insights that improved compliance reporting accuracy by 30%.',
        'Designed dashboards in Power BI and Excel to visualize incident trends, audit outcomes, and permit statuses, reducing manual reporting time by 40% and enabling faster decision-making.',
        'Performed data validation and cleansing across NeoEHS web and mobile modules using SQL and Excel, improving data reliability by 25% for compliance and safety analytics.'
      ],
    },
    {
      id: 4,
      role: 'Software Engineer',
      company: 'Vetronics Future Tech, India',
      period: 'July 2022 - October 2022',
      responsibilities: [
        'Integrated APIs for Facebook, Twitter, Instagram, LinkedIn, and YouTube into a unified web portal, enabling simultaneous content posting across multiple social media platforms.',
        'Developed front-end and established MongoDB connectivity, creating a user-friendly dashboard for managing social media accounts. I used NodeJS for handling API requests, routing, and middleware.',
      ],
    },
  ];

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section id="timeline" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Timeline Header */}
        <div className="grid grid-cols-2 mb-8 px-4 md:px-16 lg:px-24">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white">Work Experience</h3>
          </div>
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white">Education</h3>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-white/30 z-0"></div>

          {/* Timeline Content */}
          <div className="relative">
            {/* Combined Timeline Entries */}
            <div>
              {/* First Entry - Most Recent */}
              <div className="relative mb-16 md:mb-20">
                <div className="flex flex-col md:flex-row">
                  {/* Mobile View - Stacked */}
                  <div className="md:hidden mb-8 space-y-8">
                    {/* Work Experience */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="mb-6"
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 cursor-pointer min-h-[180px] sm:min-h-[200px]"
                        onClick={() => openModal(`exp-${experienceData[0].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[0].id}`)}
                      >

                        <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
                          {experienceData[0].company}
                        </h4>
                        <div className="mb-2">
                          <p className="text-white/80 text-sm sm:text-base">
                            {experienceData[0].role}
                            {experienceData[0].duration && <span className="ml-2 text-xs sm:text-sm text-gray-400">({experienceData[0].duration})</span>}
                          </p>
                        </div>
                        <div className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-xs sm:text-sm font-medium">
                          {experienceData[0].period}
                        </div>
                      </div>
                    </motion.div>

                    {/* Education */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[180px] sm:min-h-[200px]"
                      >

                        <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                          {educationData[0].institution}
                        </h4>
                        <p className="text-purple-300 mb-1 text-sm sm:text-base">{educationData[0].degree}</p>
                        <p className="text-gray-400 mb-3 text-xs sm:text-sm">{educationData[0].gpa}</p>
                        <div className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-xs sm:text-sm font-medium">
                          {educationData[0].period}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Desktop View - Side by Side */}
                  <div className="hidden md:flex items-start w-full">
                    {/* Left Content (Work Experience) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pr-4"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-right cursor-pointer min-h-[180px] sm:min-h-[200px]"
                        onClick={() => openModal(`exp-${experienceData[0].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[0].id}`)}
                      >

                        <h4 className="text-xl font-bold text-white mb-1">
                          {experienceData[0].company}
                        </h4>
                        <div className="mb-2">
                          <p className="text-white/80">
                            {experienceData[0].role}
                            {experienceData[0].duration && <span className="ml-2 text-sm text-gray-400">({experienceData[0].duration})</span>}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {experienceData[0].period}
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Timeline Elements */}
                    <div className="flex flex-col items-center mx-4 relative z-10">
                      {/* Timeline Dot */}
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/30 z-10"></div>
                      <div className="h-full w-0.5 bg-white/30 z-0"></div>
                    </div>

                    {/* Right Content (Education) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pl-4"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 min-h-[180px]"
                      >

                        <h4 className="text-xl font-bold text-white mb-2">
                          {educationData[0].institution}
                        </h4>
                        <p className="text-white/80 mb-1">{educationData[0].degree}</p>
                        <p className="text-gray-400 mb-3">{educationData[0].gpa}</p>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {educationData[0].period}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Second Entry */}
              <div className="relative mb-16 md:mb-20">
                <div className="flex flex-col md:flex-row">
                  {/* Mobile View - Stacked */}
                  <div className="md:hidden mb-8 space-y-8">
                    {/* Work Experience */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[180px] sm:min-h-[200px]"
                        onClick={() => openModal(`exp-${experienceData[1].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[1].id}`)}
                      >
                        <div className="text-center mb-2">
                          <span className="px-3 py-1 text-sm bg-white/30 backdrop-blur-sm rounded-full text-white inline-block font-medium">
                            {experienceData[1].period}
                          </span>
                        </div>
                        <div className="text-white">
                          <h4 className="text-xl font-bold mb-1 text-center">
                            {experienceData[1].role}
                          </h4>
                          <div className="mb-2 text-center">
                            <p className="text-white/90 font-medium">
                              {experienceData[1].company}
                              {experienceData[1].duration && <span className="ml-2 text-sm text-gray-300">({experienceData[1].duration})</span>}
                            </p>
                          </div>
                          {experienceData[1].website && (
                            <a
                              href={experienceData[1].website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-300 hover:text-white transition-colors mb-2 block text-center"
                            >
                              {experienceData[1].website}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Education */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[180px] sm:min-h-[200px]"
                      >
                        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">
                          {educationData[1].institution}
                        </h4>
                        <p className="text-white/80 mb-1 text-sm sm:text-base text-center">{educationData[1].degree}</p>
                        <p className="text-gray-400 mb-3 text-xs sm:text-sm text-center">{educationData[1].gpa}</p>
                        <div className="flex justify-center">
                          <div className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-xs sm:text-sm font-medium">
                            {educationData[1].period}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Desktop View - Side by Side */}
                  <div className="hidden md:flex items-start w-full">
                    {/* Left Content (Work Experience) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pr-4"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-right cursor-pointer min-h-[180px]"
                        onClick={() => openModal(`exp-${experienceData[1].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[1].id}`)}
                      >

                        <h4 className="text-xl font-bold text-white mb-1">
                          {experienceData[1].company}
                        </h4>
                        <div className="mb-2">
                          <p className="text-white/80">
                            {experienceData[1].role}
                            {experienceData[1].duration && <span className="ml-2 text-sm text-gray-400">({experienceData[1].duration})</span>}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {experienceData[1].period}
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Timeline Elements */}
                    <div className="flex flex-col items-center mx-4 relative z-10">
                      {/* Timeline Dot */}
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/30 z-10"></div>
                      <div className="h-full w-0.5 bg-white/30 z-0"></div>
                    </div>

                    {/* Right Content (Education) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pl-4"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-48"
                      >

                        <h4 className="text-xl font-bold text-white mb-2">
                          {educationData[1].institution}
                        </h4>
                        <p className="text-white/80 mb-1">{educationData[1].degree}</p>
                        <p className="text-gray-400 mb-3">{educationData[1].gpa}</p>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {educationData[1].period}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Third Entry - Only Work Experience */}
              <div className="relative mb-16 md:mb-20">
                <div className="flex flex-col md:flex-row">
                  {/* Mobile View */}
                  <div className="md:hidden mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[180px] sm:min-h-[200px]"
                        onClick={() => openModal(`exp-${experienceData[2].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[2].id}`)}
                      >
                        <div className="text-center mb-2">
                          <span className="px-3 py-1 text-sm bg-white/30 backdrop-blur-sm rounded-full text-white inline-block font-medium">
                            {experienceData[2].period}
                          </span>
                        </div>
                        <div className="text-white">
                          <h4 className="text-xl font-bold mb-1 text-center">
                            {experienceData[2].role}
                          </h4>
                          <div className="mb-2 text-center">
                            <p className="text-white/90 font-medium">
                              {experienceData[2].company}
                              {experienceData[2].duration && <span className="ml-2 text-sm text-gray-300">({experienceData[2].duration})</span>}
                            </p>
                          </div>
                          {experienceData[2].website && (
                            <a
                              href={experienceData[2].website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-300 hover:text-white transition-colors mb-2 block text-center"
                            >
                              {experienceData[2].website}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:flex items-start w-full">
                    {/* Left Content (Work Experience) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pr-4"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-right cursor-pointer min-h-[180px]"
                        onClick={() => openModal(`exp-${experienceData[2].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[2].id}`)}
                      >

                        <h4 className="text-xl font-bold text-white mb-1">
                          {experienceData[2].company}
                        </h4>
                        <div className="mb-2">
                          <p className="text-white/80">
                            {experienceData[2].role}
                            {experienceData[2].duration && <span className="ml-2 text-sm text-gray-400">({experienceData[2].duration})</span>}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {experienceData[2].period}
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Timeline Elements */}
                    <div className="flex flex-col items-center mx-4 relative z-10">
                      {/* Timeline Dot */}
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/30 z-10"></div>
                      <div className="h-full w-0.5 bg-white/30 z-0"></div>
                    </div>

                    {/* Right Content (Empty) */}
                    <div className="w-[calc(50%-20px)] pl-4"></div>
                  </div>
                </div>
              </div>

              {/* Fourth Entry - Only Work Experience */}
              <div className="relative">
                <div className="flex flex-col md:flex-row">
                  {/* Mobile View */}
                  <div className="md:hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/20 border-2 border-white/30 rounded-xl p-4 sm:p-5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[180px] sm:min-h-[200px]"
                        onClick={() => openModal(`exp-${experienceData[3].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[3].id}`)}
                      >
                        <div className="text-center mb-2">
                          <span className="px-3 py-1 text-sm bg-white/30 backdrop-blur-sm rounded-full text-white inline-block font-medium">
                            {experienceData[3].period}
                          </span>
                        </div>
                        <div className="text-white">
                          <h4 className="text-xl font-bold mb-1 text-center">
                            {experienceData[3].role}
                          </h4>
                          <div className="mb-2 text-center">
                            <p className="text-white/90 font-medium">
                              {experienceData[3].company}
                              {experienceData[3].duration && <span className="ml-2 text-sm text-gray-300">({experienceData[3].duration})</span>}
                            </p>
                          </div>
                          {experienceData[3].website && (
                            <a
                              href={experienceData[3].website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-300 hover:text-white transition-colors mb-2 block text-center"
                            >
                              {experienceData[3].website}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:flex items-start w-full">
                    {/* Left Content (Work Experience) */}
                    <motion.div
                      className="w-[calc(50%-20px)] pr-4"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-right cursor-pointer min-h-[180px]"
                        onClick={() => openModal(`exp-${experienceData[3].id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(`exp-${experienceData[3].id}`)}
                      >

                        <h4 className="text-xl font-bold text-white mb-1">
                          {experienceData[3].company}
                        </h4>
                        <div className="mb-2">
                          <p className="text-white/80">
                            {experienceData[3].role}
                            {experienceData[3].duration && <span className="ml-2 text-sm text-gray-400">({experienceData[3].duration})</span>}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block text-sm font-medium">
                          {experienceData[3].period}
                        </div>
                      </div>
                    </motion.div>

                    {/* Center Timeline Elements */}
                    <div className="flex flex-col items-center mx-4 relative z-10">
                      {/* Timeline Dot */}
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg shadow-white/30 z-10"></div>
                      <div className="h-full w-0.5 bg-white/30 z-0"></div>
                    </div>

                    {/* Right Content (Empty) */}
                    <div className="w-[calc(50%-20px)] pl-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Modals */}
      {experienceData.map((exp) => (
        <Modal
          key={`modal-exp-${exp.id}`}
          isOpen={activeModal === `exp-${exp.id}`}
          onClose={closeModal}
          title={exp.company}
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <p className="text-white/80 text-lg font-medium">{exp.role}</p>
                {exp.website && (
                  <a
                    href={exp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors inline-block"
                  >
                    {exp.website}
                  </a>
                )}
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white inline-block font-medium self-start">
                {exp.period}
                {exp.duration && <span className="ml-2 text-sm">({exp.duration})</span>}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Responsibilities:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={`modal-resp-${exp.id}-${idx}`}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      ))}

      {/* Education Modals Removed */}
    </section>
  );
};

export default Timeline;
