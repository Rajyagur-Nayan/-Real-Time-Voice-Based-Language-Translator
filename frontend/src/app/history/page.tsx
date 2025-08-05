"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({
  children,
  className,
  variant = "default",
  ...props
}: any) => {
  let baseStyle =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-200";
  if (variant === "destructive") {
    baseStyle += " bg-red-600 text-white hover:bg-red-700";
  } else if (variant === "outline") {
    baseStyle += " border border-gray-600 text-gray-200 hover:bg-gray-700";
  } else {
    baseStyle += " bg-blue-600 text-white hover:bg-blue-700";
  }
  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: any) => (
  <input
    className={`w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  date: string;
};

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]); // { id, text, isUser, timestamp }
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Set dark mode initially
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // //   const sendMessage = async () => {
  //     if (inputMessage.trim() === "") return;

  //     const newMessage = {
  //       id: Date.now(),
  //       text: inputMessage.trim(),
  //       isUser: true,
  //       timestamp: new Date().toLocaleTimeString("en-US", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         hour12: false,
  //       }),
  //       date: new Date().toLocaleDateString("en-US", {
  //         weekday: "long",
  //         month: "long",
  //         day: "numeric",
  //       }),
  //     };

  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     setInputMessage("");
  //     setIsLoading(true);

  //     // Simulate API call for translation
  //     try {
  //       let chatHistory = [];
  //       chatHistory.push({
  //         role: "user",
  //         parts: [
  //           {
  //             text: `Translate "${newMessage.text}" into Spanish. Provide only the Spanish translation.`,
  //           },
  //         ],
  //       });
  //       const payload = { contents: chatHistory };
  //       const apiKey = "";
  //       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

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
  //       let translatedText = "Translation failed.";
  //       if (
  //         result.candidates &&
  //         result.candidates.length > 0 &&
  //         result.candidates[0].content &&
  //         result.candidates[0].content.parts &&
  //         result.candidates[0].content.parts.length > 0
  //       ) {
  //         translatedText = result.candidates[0].content.parts[0].text;
  //       }

  //       const botResponse = {
  //         id: Date.now() + 1, // Ensure unique ID
  //         text: translatedText,
  //         isUser: false,
  //         timestamp: new Date().toLocaleTimeString("en-US", {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: false,
  //         }),
  //         date: new Date().toLocaleDateString("en-US", {
  //           weekday: "long",
  //           month: "long",
  //           day: "numeric",
  //         }),
  //       };
  //       setMessages((prevMessages) => [...prevMessages, botResponse]);
  //     } catch (error) {
  //       console.error("Error during translation:", error);
  //       const errorMessage = {
  //         id: Date.now() + 1,
  //         text: `Error: ${error.message}. Please try again.`,
  //         isUser: false,
  //         timestamp: new Date().toLocaleTimeString("en-US", {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: false,
  //         }),
  //         date: new Date().toLocaleDateString("en-US", {
  //           weekday: "long",
  //           month: "long",
  //           day: "numeric",
  //         }),
  //       };
  //       setMessages((prevMessages) => [...prevMessages, errorMessage]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const clearHistory = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `${msg.date} ${msg.timestamp} - ${
            msg.isUser ? "You" : "Translator"
          }: ${msg.text}`
      )
      .join("\n");
    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    // In a real application, this would involve more complex logic
    // like generating a shareable link or integrating with social media APIs.
    // For this simulation, we'll just copy the chat content to clipboard.
    const chatContent = messages
      .map(
        (msg) =>
          `${msg.date} ${msg.timestamp} - ${
            msg.isUser ? "You" : "Translator"
          }: ${msg.text}`
      )
      .join("\n");
    try {
      document.execCommand("copy"); // Fallback for navigator.clipboard.writeText
      const textarea = document.createElement("textarea");
      textarea.value = chatContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("Chat history copied to clipboard!"); // Using alert for simplicity, replace with custom modal in production
    } catch (err) {
      console.error("Failed to copy chat history: ", err);
      alert("Failed to copy chat history. Please try again."); // Using alert for simplicity
    }
  };

  const getDisplayDate = (
    currentMessageDate: string,
    prevMessageDate: string
  ) => {
    if (!prevMessageDate || currentMessageDate !== prevMessageDate) {
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      if (currentMessageDate === today) return "Today";
      if (currentMessageDate === yesterdayFormatted) return "Yesterday";
      return currentMessageDate;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-inter flex flex-col">
      {/* Main Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        {/* Top Controls */}
        <div className="flex justify-end space-x-4 mb-6">
          <Button variant="destructive" onClick={clearHistory}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear History
          </Button>
          <Button variant="outline" onClick={exportChat} className={undefined}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export
          </Button>
          <Button variant="outline" onClick={shareChat} className={undefined}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const displayDate = getDisplayDate(
                message.date,
                prevMessage?.date
              );
              return (
                <React.Fragment key={message.id}>
                  {displayDate && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-500 text-sm my-4"
                    >
                      {displayDate}
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start mb-4 ${
                      message.isUser ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex flex-col max-w-[70%] ${
                        message.isUser ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg shadow-md ${
                          message.isUser
                            ? "bg-gray-800 text-gray-100 rounded-bl-none"
                            : "bg-blue-700 text-white rounded-br-none"
                        }`}
                      >
                        {message.text}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end mb-4"
              >
                <div className="p-3 rounded-lg bg-blue-700 text-white rounded-br-none shadow-md">
                  <div className="animate-pulse">...</div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </AnimatePresence>
        </div>

        {/* Message Input */}
        <div className="mt-6 flex items-center space-x-4">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e: any) => setInputMessage(e.target.value)}
            onKeyPress={(e: any) => {
              if (e.key === "Enter" && !isLoading) {
                // sendMessage();
              }
            }}
            disabled={isLoading}
            className={undefined}
          />
          <Button
            // onClick={sendMessage}
            disabled={isLoading}
            className={undefined}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
