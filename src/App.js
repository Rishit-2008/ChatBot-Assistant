import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDf0h3ghgfHYM300Jp8cEcMOan9Ki-xQLQ";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setMessages([...messages, { user: true, text: userInput }]);
    setUserInput("");

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response.text();
      
      setMessages(prevMessages => [
        ...prevMessages,
        { user: false, text: response }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { user: false, text: "Sorry, something went wrong." }
      ]);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="main-container">
      <div className="chat-interface">
        <header className="app-header">
          <h1 className="app-title">ChatBot Assistant</h1>
        </header>
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.user ? "user" : "bot"}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="user-input">
          <textarea
            placeholder="Type your message..."
            value={userInput}
            onChange={handleUserInput}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            disabled={!userInput.trim()}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
