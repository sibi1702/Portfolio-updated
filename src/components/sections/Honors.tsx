import React from 'react';
import { motion } from 'framer-motion';

const Honors: React.FC = () => {
  const honorsData = [
    {
      id: 1,
      title: 'Augmented reality headset with advanced visual and interaction capabilities',
      organization: 'Intellectual Property India',
      type: 'Patent'
    },
    {
      id: 2,
      title: 'Contactless sim tray ejection',
      organization: 'Intellectual Property India',
      type: 'Patent'
    }
  ];

  return (
    <section id="honors" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Honors
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Patents and recognitions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {honorsData.map((honor, index) => (
            <motion.div
              key={`honor-${honor.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/20 transition-all duration-300 h-56 flex flex-col">
                <div className="mb-4">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium inline-block">
                    {honor.type}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {honor.title}
                </h3>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-gray-300">
                    {honor.organization}
                  </p>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Honors;
