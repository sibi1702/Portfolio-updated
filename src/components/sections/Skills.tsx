import React from 'react';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  const skills = [
    // Programming & Data
    { name: 'Python', icon: 'devicon-python-plain' },
    { name: 'R', icon: 'devicon-r-plain' },
    { name: 'SQL', icon: 'devicon-mysql-plain' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
    { name: 'NoSQL', icon: 'devicon-mongodb-plain' },
    { name: 'KQL', icon: 'devicon-azuresqldatabase-plain' },

    // Data Engineering & Big Data
    { name: 'PySpark', icon: 'devicon-apachespark-original' },
    { name: 'Hadoop', icon: 'devicon-hadoop-plain' },
    { name: 'Airflow', icon: 'devicon-apacheairflow-plain' },
    { name: 'ETL Pipelines', icon: 'devicon-databricks-original' },
    { name: 'Databricks', icon: 'devicon-databricks-original' },
    { name: 'Microsoft Fabric', icon: 'devicon-azure-plain' },
    { name: 'Snowflake', icon: 'devicon-snowflake-original' },

    // Cloud Platforms
    { name: 'AWS', icon: 'devicon-amazonwebservices-original' },
    { name: 'S3', icon: 'devicon-amazonwebservices-original' },
    { name: 'Redshift', icon: 'devicon-amazonwebservices-original' },
    { name: 'Lambda', icon: 'devicon-amazonwebservices-original' },
    { name: 'Glue', icon: 'devicon-amazonwebservices-original' },

    // Visualization & Analytics
    { name: 'Power BI', icon: 'devicon-powerbi-plain' },
    { name: 'Tableau', icon: 'devicon-tableau-original' },
    { name: 'Matplotlib', icon: 'devicon-numpy-original' },
    { name: 'Pandas', icon: 'devicon-pandas-original' },
    { name: 'NumPy', icon: 'devicon-numpy-original' },

    // DevOps & Tools
    { name: 'Docker', icon: 'devicon-docker-plain' },
    { name: 'Git', icon: 'devicon-git-plain' },
    { name: 'GitHub', icon: 'devicon-github-original' },
    { name: 'Linux', icon: 'devicon-linux-plain' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-gray-300">
            A comprehensive list of my technical skills and expertise
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 px-4 max-w-5xl mx-auto"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={item}
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:bg-white/20 transition-all duration-300 transform hover:scale-110 w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center"
            >
              <i className={`${skill.icon} colored text-3xl sm:text-4xl mb-1 sm:mb-2`}></i>
              <span className="text-xs sm:text-sm text-center text-white font-medium mt-1">{skill.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;