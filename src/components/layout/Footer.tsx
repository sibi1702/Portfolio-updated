import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8
      }
    }
  };
  return (
    <motion.footer
      className="relative backdrop-blur-lg bg-white/10 border-t border-white/20 text-white py-8 overflow-hidden mt-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Get in touch</h3>
            <p className="text-gray-300">Let's work together</p>
          </div>

          <div className="flex space-x-6">
            <a href="https://github.com/sibi1702" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
              <i className="fab fa-github text-2xl"></i>
            </a>
            <a href="https://www.linkedin.com/in/sibichandrasekar/" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a href="mailto:sibisekar0307@gmail.com" className="hover:text-white/80 transition-colors">
              <i className="fas fa-envelope text-2xl"></i>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Sibi Chandrasekar. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
