import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error getting reply!" },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#8B5E3C] text-white p-3 rounded-full shadow-lg hover:bg-[#6F4428]"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {open && (
        <div className="w-80 bg-[#FDF4E7] shadow-2xl rounded-2xl border border-[#8B5E3C] p-2 flex flex-col">
          <div className="flex items-center justify-between bg-[#8B5E3C] text-white p-3 rounded-t-lg">
            <span className="font-bold">Gemini Chatbot</span>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md text-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-[#8B5E3C] text-white ml-auto"
                    : "bg-[#F5E1C8] text-[#5A3E2B]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center border-t p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 text-sm p-2 border rounded-md focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-[#8B5E3C] rounded-md text-white"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
