import React from 'react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-300">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">Contact Information</h3>
                <p className="text-gray-300">I'd love to hear from you! Here's how you can reach me.</p>
              </div>

              <div className="flex justify-center space-x-8">
                <a href="mailto:sibisekar0307@gmail.com" className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110">
                  <i className="far fa-envelope text-3xl"></i>
                </a>
                <a href="https://www.linkedin.com/in/sibichandrasekar/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110">
                  <i className="fab fa-linkedin-in text-3xl"></i>
                </a>
                <a href="https://github.com/sibi1702" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-all duration-200 hover:scale-110">
                  <i className="fab fa-github text-3xl"></i>
                </a>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="sibisekar0307@gmail.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium backdrop-blur-sm shadow-sm hover:bg-white/30 transition-all duration-200 hover:scale-105 w-full border border-white/30"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
