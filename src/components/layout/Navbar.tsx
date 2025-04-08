import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const SCROLL_THRESHOLD = 100; 

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#timeline' },
    { name: 'Projects', href: '#projects' },
    { name: 'Honors', href: '#honors' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
      setShowScrollTop(window.scrollY > window.innerHeight);

      const sections = navItems.map(item => document.getElementById(item.href.substring(1)));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveItem(navItems[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="w-full py-4 transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <motion.div
              className={`
                relative flex items-center p-2 rounded-full
                transition-all duration-500 ease-in-out
                ${isScrolled ? 'bg-black/50' : 'bg-black/30'}
                backdrop-blur-md border border-white/20 shadow-lg
                ${isScrolled ? 'shadow-lg' : 'shadow-md'}
              `}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.href.substring(1));
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      window.history.replaceState(null, '', item.href);
                    }
                    setActiveItem(item.name);
                  }}
                  className="relative px-8 py-3 text-lg font-medium text-white/90 rounded-full transition-colors duration-200"
                  onMouseEnter={() => setActiveItem(item.name)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  {activeItem === item.name && (
                    <motion.div
                      className="absolute inset-0 bg-white/10 rounded-full"
                      layoutId="navbar-active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                inline-flex items-center justify-center p-2 rounded-full
                transition-all duration-300 ease-in-out
                ${isScrolled ? 'bg-black/50' : 'bg-black/30'}
                backdrop-blur-md shadow-lg text-white
                hover:bg-white/20
              `}
            >
              <span className="sr-only">Open main menu</span>
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-around"
              >
                <motion.span
                  className="w-6 h-0.5 bg-current transform origin-left"
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 45 }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current transform origin-left"
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: -45 }
                  }}
                />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`
                px-2 pt-2 pb-3 space-y-2 rounded-2xl mt-2
                ${isScrolled ? 'bg-black/50' : 'bg-black/30'}
                backdrop-blur-md border border-white/20 shadow-lg
              `}>
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block w-full px-4 py-2 text-lg font-medium text-white/90 rounded-full
                      hover:bg-white/20 transition-all duration-300 ease-in-out"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.href.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                      setIsMenuOpen(false);
                    }}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={`
              fixed bottom-8 right-8 p-3 rounded-full
              bg-black/30 backdrop-blur-md
              border border-white/20 shadow-lg
              text-white/90 hover:bg-white/20
              transition-all duration-300 ease-in-out
              z-50
            `}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
