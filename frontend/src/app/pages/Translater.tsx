"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Button = ({ children, className, ...props }: any) => (
  <button
    className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Select = ({ children, className, ...props }: any) => (
  <select
    className={`p-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ className, ...props }: any) => (
  <textarea
    className={`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${className}`}
    rows="4"
    {...props}
  ></textarea>
);

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null); // State to hold the Audio object

  // Set dark mode initially
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Initialize AudioContext for playing PCM audio
  useEffect(() => {
    if (typeof window !== "undefined" && !audioPlayer) {
      setAudioPlayer(new Audio());
    }
  }, [audioPlayer]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Helper function to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: any) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Helper function to convert PCM to WAV Blob
  const pcmToWav = (pcmData: any, sampleRate: any) => {
    const pcm16 = new Int16Array(pcmData);
    const numChannels = 1; // Mono audio
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // RIFF chunk
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + pcm16.byteLength, true); // ChunkSize
    writeString(view, 8, "WAVE");

    // fmt sub-chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample

    // data sub-chunk
    writeString(view, 36, "data");
    view.setUint32(40, pcm16.byteLength, true); // Subchunk2Size

    const blob = new Blob([wavHeader, pcm16], { type: "audio/wav" });
    return blob;
  };

  const writeString = (view: any, offset: any, string: any) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Function to simulate speech input and trigger translation
  //   const handleMicrophoneClick = async () => {
  //     const speechInput = prompt(
  //       "Please type what you want to 'speak' for translation:"
  //     );
  //     if (!speechInput) return;

  //     setSourceText(speechInput);
  //     setIsLoading(true);
  //     setError("");
  //     setTranslatedText(""); // Clear previous translation

  //     let chatHistory = [];
  //     chatHistory.push({
  //       role: "user",
  //       parts: [{ text: `Translate "${speechInput}" into Spanish.` }],
  //     }); // Example prompt for translation
  //     const payload = { contents: chatHistory };
  //     const apiKey = "";
  //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  //     try {
  //       let response;
  //       let retries = 0;
  //       const MAX_RETRIES = 5;
  //       const BASE_DELAY = 1000; // 1 second

  //       while (retries < MAX_RETRIES) {
  //         response = await fetch(apiUrl, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(payload),
  //         });

  //         if (response.ok) {
  //           break; // Success
  //         } else if (response.status === 429) {
  //           // Too Many Requests - implement exponential backoff
  //           const delay = BASE_DELAY * Math.pow(2, retries);
  //           console.warn(`Rate limit exceeded. Retrying in ${delay / 1000}s...`);
  //           await new Promise((resolve) => setTimeout(resolve, delay));
  //           retries++;
  //         } else {
  //           // Other errors
  //           throw new Error(
  //             `API error: ${response.status} ${response.statusText}`
  //           );
  //         }
  //       }

  //       if (!response.ok) {
  //         throw new Error("Failed to get response after multiple retries.");
  //       }

  //       const result = await response.json();
  //       if (
  //         result.candidates &&
  //         result.candidates.length > 0 &&
  //         result.candidates[0].content &&
  //         result.candidates[0].content.parts &&
  //         result.candidates[0].content.parts.length > 0
  //       ) {
  //         const text = result.candidates[0].content.parts[0].text;
  //         setTranslatedText(text);
  //       } else {
  //         setError("No translation found or unexpected API response structure.");
  //       }
  //     } catch (err) {
  //       console.error("Error during translation:", err);
  //       setError(`Failed to translate: ${err.message}`);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  // Function to handle Text-to-Speech
  //   const handlePlayTranslatedText = async () => {
  //     if (!translatedText) {
  //       setError("No translated text to play.");
  //       return;
  //     }

  //     setIsLoading(true);
  //     setError("");

  //     const payload = {
  //       contents: [
  //         {
  //           parts: [{ text: translatedText }],
  //         },
  //       ],
  //       generationConfig: {
  //         responseModalities: ["AUDIO"],
  //         speechConfig: {
  //           voiceConfig: {
  //             prebuiltVoiceConfig: { voiceName: "Kore" }, // You can choose other voices like 'Zephyr', 'Puck', etc.
  //           },
  //         },
  //       },
  //       model: "gemini-2.5-flash-preview-tts",
  //     };
  //     const apiKey = "";
  //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

  //     try {
  //       let response;
  //       let retries = 0;
  //       const MAX_RETRIES = 5;
  //       const BASE_DELAY = 1000; // 1 second

  //       while (retries < MAX_RETRIES) {
  //         response = await fetch(apiUrl, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(payload),
  //         });

  //         if (response.ok) {
  //           break; // Success
  //         } else if (response.status === 429) {
  //           // Too Many Requests - implement exponential backoff
  //           const delay = BASE_DELAY * Math.pow(2, retries);
  //           console.warn(`Rate limit exceeded. Retrying in ${delay / 1000}s...`);
  //           await new Promise((resolve) => setTimeout(resolve, delay));
  //           retries++;
  //         } else {
  //           // Other errors
  //           throw new Error(
  //             `API error: ${response.status} ${response.statusText}`
  //           );
  //         }
  //       }

  //       if (!response.ok) {
  //         throw new Error("Failed to get response after multiple retries.");
  //       }

  //       const result = await response.json();
  //       const part = result?.candidates?.[0]?.content?.parts?.[0];
  //       const audioData = part?.inlineData?.data;
  //       const mimeType = part?.inlineData?.mimeType;

  //       if (audioData && mimeType && mimeType.startsWith("audio/")) {
  //         const sampleRateMatch = mimeType.match(/rate=(\d+)/);
  //         const sampleRate = sampleRateMatch
  //           ? parseInt(sampleRateMatch[1], 10)
  //           : 16000; // Default to 16kHz if not found

  //         const pcmData = base64ToArrayBuffer(audioData);
  //         const wavBlob = pcmToWav(pcmData, sampleRate);
  //         const audioUrl = URL.createObjectURL(wavBlob);

  //         if (audioPlayer) {
  //           audioPlayer.src = audioUrl;
  //           audioPlayer.play();
  //         } else {
  //           console.error("Audio player not initialized.");
  //           setError("Audio player not ready.");
  //         }
  //       } else {
  //         setError("No audio data found or unexpected API response structure.");
  //       }
  //     } catch (err) {
  //       console.error("Error during TTS:", err);
  //       setError(`Failed to generate speech: ${err.message}`);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter">
      {/* Real-time Translator Section */}
      <motion.section
        className="py-16 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-purple-300">
            Real-time Translator
          </h1>

          {/* Language Selection */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
            <div className="flex flex-col items-start">
              <label
                htmlFor="source-language"
                className="text-gray-300 text-lg mb-2"
              >
                Source Language
              </label>
              <Select id="source-language" className={undefined}>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </Select>
            </div>
            <div className="flex flex-col items-start">
              <label
                htmlFor="target-language"
                className="text-gray-300 text-lg mb-2"
              >
                Target Language
              </label>
              <Select id="target-language" className={undefined}>
                <option value="spanish">Spanish</option>
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </Select>
            </div>
          </div>

          {/* Microphone Button */}
          <motion.div
            className="flex flex-col items-center mb-12"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center flex-col shadow-xl hover:bg-blue-700 transition-colors"
              //   onClick={handleMicrophoneClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white mb-2"
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
              )}
              <span className="text-white text-sm font-semibold">
                {isLoading ? "Processing..." : "Tap to Speak"}
              </span>
            </Button>
          </motion.div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Transcription and Translation Areas */}
          <div className="max-w-3xl mx-auto space-y-6">
            <Textarea
              placeholder="Your speech will appear here for transcription..."
              value={sourceText}
              onChange={(e: any) => setSourceText(e.target.value)} // Allow typing for simulation
              disabled={isLoading}
            />
            <div className="relative">
              <Textarea
                placeholder="Translated text will be displayed here..."
                value={translatedText}
                readOnly
              />
              <button
                className="absolute bottom-4 right-4 text-gray-400 hover:text-purple-400 transition-colors"
                // onClick={handlePlayTranslatedText}
                disabled={isLoading || !translatedText}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464A5 5 0 0117 12h-2a3 3 0 00-3-3V7a5 5 0 015.536 1.464z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 20h9a2 2 0 002-2V4a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2h9z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Translator;
