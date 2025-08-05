"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Button = ({ children, className, ...props }: any) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }: any) => (
  <div className={`p-6 rounded-lg shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const Home = () => {
  // Set dark mode initially
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* Hero Section */}
      <motion.section
        className="relative py-16 md:py-20 text-center overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 text-purple-300"
            variants={fadeInVariants}
          >
            LingoBridge AI
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-10"
            variants={fadeInVariants}
          >
            Speak Freely. Anywhere. Anytime.
          </motion.p>

          <motion.div
            className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
            variants={fadeInVariants}
          >
            {/* Placeholder for the main image */}
            <img
              src="https://placehold.co/1000x400/374151/ffffff?text=Global+Communication"
              alt="Global Communication Illustration"
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://placehold.co/1000x400/374151/ffffff?text=Global+Communication";
              }}
            />
          </motion.div>

          <motion.div variants={fadeInVariants} className="mt-8 md:mt-10">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              Start Translating
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-purple-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={staggerContainerVariants}
          >
            <motion.div variants={fadeInVariants}>
              <Card className="bg-gray-800 border border-gray-700">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 md:h-16 md:w-16 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                  Record Your Voice
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  Simply tap the microphone button to begin speaking in your
                  chosen language.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInVariants}>
              <Card className="bg-gray-800 border border-gray-700">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 md:h-16 md:w-16 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                  Instant Translation
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  Our advanced AI instantly processes and translates your speech
                  into the target language.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInVariants}>
              <Card className="bg-gray-800 border border-gray-700">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 md:h-16 md:w-16 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v14c0 1.105-.895 2-2 2H9zm0 0H5a2 2 0 01-2-2V6a2 2 0 012-2h4v15zm12-15v2m-6-2v2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                  Hear the Result
                </h3>
                <p className="text-sm md:text-base text-gray-400">
                  Play the translated audio or read the displayed text for
                  seamless communication.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Extra Content: Our Mission Section */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-purple-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            Our Mission
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4">
              At LingoBridge AI, our mission is to break down language barriers
              and foster global understanding. We believe that communication
              should be effortless, allowing individuals from diverse
              backgrounds to connect, share ideas, and collaborate without
              limitations.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Through cutting-edge artificial intelligence and intuitive design,
              we empower users to express themselves authentically in any
              language, anywhere in the world. Our commitment is to continuous
              innovation, ensuring our platform remains at the forefront of
              language technology.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
