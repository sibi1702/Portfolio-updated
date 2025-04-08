import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import LightBulbAnimation from '../3d/LightBulbAnimation';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const now = new Date();
      const formElement = formRef.current!;

      if (!formElement.querySelector('input[name="time"]')) {
        const timeInput = document.createElement('input');
        timeInput.type = 'hidden';
        timeInput.name = 'time';
        timeInput.value = now.toLocaleString();
        formElement.appendChild(timeInput);
      }

      const serviceId = 'Portfolio_Contact'; 
      const templateId = 'template_tuluzph'; 
      const publicKey = 'ICOkxeyKUsfBRMfFf'; 

      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current!,
        publicKey
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-transparent min-h-screen md:h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-300">
            Feel free to reach out for collaborations or just a friendly hello
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left side - Contact Form */}
          <motion.div
            className="w-full md:w-1/2 lg:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-white mb-4">
                    Thank you for your message! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white mb-4">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white backdrop-blur-sm"
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>

                {/* Hidden field for recipient email */}
                <input type="hidden" name="to_email" value="sibisekar0307@gmail.com" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-white/20 text-white rounded-lg font-medium backdrop-blur-sm shadow-sm hover:bg-white/30 transition-all duration-200 hover:scale-105 w-full border border-white/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div className="flex justify-center space-x-8 mt-6">
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
          </motion.div>

          {/* Right side - Light Bulb Animation */}
          <motion.div
            className="w-full md:w-1/2 lg:w-3/5 h-[400px] md:h-[600px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
              <LightBulbAnimation />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
