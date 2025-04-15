import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, UserX } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState("welcome"); // welcome, details, questions
  const [userDetails, setUserDetails] = useState({
    name: "",
    preferredJewelry: "",
    budget: ""
  });
  const chatEndRef = useRef(null);
  
  // Auth context for user status
  const auth = useAuth() || { currentUser: null, isAuthenticated: false };
  const { currentUser, isAuthenticated } = auth;

  // Predefined responses for different jewelry questions
  const predefinedResponses = {
    pricing: "Our jewelry ranges from ₹500 for simple pieces to ₹25,000+ for premium collections. We offer flexible payment options and occasional discounts.",
    materials: "We use high-quality materials including sterling silver, gold plating, and authentic gemstones. All our jewelry is nickel-free and hypoallergenic.",
    shipping: "We offer free shipping on orders above ₹1500. Standard delivery takes 3-5 business days, while express shipping (₹200 extra) delivers in 1-2 business days.",
    returns: "We have a 14-day return policy. Items must be unworn, in original packaging with tags attached. Contact our customer service team to initiate a return.",
    care: "To maintain your jewelry, clean with a soft cloth, avoid contact with perfumes, lotions and water. Store in a cool, dry place in separate pouches.",
    trending: "Currently trending items include our Anti-Tarnish Collection, Layered Necklaces, and our Minimalist Gold Earrings set.",
    discount: "We run seasonal sales and offer a 10% discount for first-time customers. Join our newsletter to stay updated on promotions.",
    gift: "Yes, we offer gift wrapping for ₹150 extra. We can include a personalized message and ship directly to the recipient.",
    help: "I can help you with questions about our products, pricing, materials, shipping, returns, jewelry care, and current trends. What would you like to know?",
    default: "Thank you for your question. For specialized assistance, please contact our customer service at support@jewelrystore.com or visit our FAQ section."
  };

  // Auto-welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true);
      setTimeout(() => {
        const welcomeMessage = isAuthenticated
          ? `Hello ${currentUser?.email || "there"}! Welcome to our jewelry shop assistant. I'll help you find the perfect piece. Could you tell me your name?`
          : "Hello! Welcome to our jewelry shop assistant. I'll help you find the perfect piece. Could you tell me your name?";

        setMessages([{ sender: "bot", text: welcomeMessage }]);
        setTyping(false);
      }, 1000);
    }
  }, [open, isAuthenticated, currentUser, messages.length]);

  const handleResponse = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Handle based on conversation stage
    setTimeout(() => {
      let botResponse = "";

      if (stage === "welcome") {
        // User has provided their name
        setUserDetails({ ...userDetails, name: input.trim() });
        botResponse = `Nice to meet you, ${input.trim()}! What type of jewelry are you interested in? (Earrings, Necklaces, Rings, Bracelets, etc.)`;
        setStage("jewelry_type");
      } 
      else if (stage === "jewelry_type") {
        // User has provided jewelry preference
        setUserDetails({ ...userDetails, preferredJewelry: input.trim() });
        botResponse = `Great choice! ${input.trim()} are very popular. What's your budget range for this purchase?`;
        setStage("budget");
      } 
      else if (stage === "budget") {
        // User has provided budget
        setUserDetails({ ...userDetails, budget: input.trim() });
        botResponse = `Thank you for sharing that information. Now I can better assist you. What would you like to know about our ${userDetails.preferredJewelry}? (pricing, materials, trending styles, etc.)`;
        setStage("questions");
      } 
      else if (stage === "questions") {
        // User is asking questions, provide predefined responses
        const userQuery = input.toLowerCase();
        
        if (userQuery.includes("price") || userQuery.includes("cost") || userQuery.includes("how much")) {
          botResponse = predefinedResponses.pricing;
        } 
        else if (userQuery.includes("material") || userQuery.includes("made of") || userQuery.includes("quality")) {
          botResponse = predefinedResponses.materials;
        } 
        else if (userQuery.includes("ship") || userQuery.includes("delivery")) {
          botResponse = predefinedResponses.shipping;
        } 
        else if (userQuery.includes("return") || userQuery.includes("refund")) {
          botResponse = predefinedResponses.returns;
        } 
        else if (userQuery.includes("care") || userQuery.includes("clean") || userQuery.includes("maintain")) {
          botResponse = predefinedResponses.care;
        } 
        else if (userQuery.includes("trend") || userQuery.includes("popular") || userQuery.includes("new")) {
          botResponse = predefinedResponses.trending;
        } 
        else if (userQuery.includes("discount") || userQuery.includes("sale") || userQuery.includes("offer")) {
          botResponse = predefinedResponses.discount;
        } 
        else if (userQuery.includes("gift") || userQuery.includes("present") || userQuery.includes("wrap")) {
          botResponse = predefinedResponses.gift;
        } 
        else if (userQuery.includes("help") || userQuery.includes("assist") || userQuery.includes("what can you")) {
          botResponse = predefinedResponses.help;
        } 
        else {
          botResponse = predefinedResponses.default;
        }
        
        // Add personalized recommendation based on user details
        if (userDetails.name && userDetails.preferredJewelry && userDetails.budget) {
          const personalNote = `Based on your interest in ${userDetails.preferredJewelry} with a budget of ${userDetails.budget}, I recommend checking out our "${userDetails.preferredJewelry} Collection" section on our website.`;
          botResponse += ` ${personalNote}`;
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      setTyping(false);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleResponse();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#8B5E3C] text-white p-3 rounded-full shadow-lg hover:bg-[#6F4428] transition-colors duration-300"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {open && (
        <div className="w-96 bg-[#FDF4E7] shadow-2xl rounded-2xl border border-[#8B5E3C] p-2 flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between bg-[#8B5E3C] text-white p-3 rounded-t-lg">
            <div className="flex items-center gap-2">
              <span className="font-bold">Jewelry Shop Assistant</span>
              {isAuthenticated ? (
                <User size={16} className="text-green-300" />
              ) : (
                <UserX size={16} className="text-red-300" />
              )}
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-3 space-y-3 bg-[#FDF4E7]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm max-w-[90%] ${
                  msg.sender === "user"
                    ? "bg-[#8B5E3C] text-white ml-auto"
                    : "bg-[#F5E1C8] text-[#5A3E2B]"
                } shadow-sm`}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="bg-[#F5E1C8] text-[#5A3E2B] p-3 rounded-lg text-sm max-w-[90%] shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="flex items-center border-t border-amber-200 p-2 mt-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={stage === "questions" ? "Ask about our jewelry..." : "Type your response..."}
              className="flex-1 text-sm p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none max-h-16"
              rows="1"
            />
            <button
              onClick={handleResponse}
              disabled={!input.trim() || typing}
              className={`ml-2 p-3 ${
                !input.trim() || typing ? "bg-amber-400" : "bg-[#8B5E3C] hover:bg-[#6F4428]"
              } rounded-md text-white transition-colors duration-300`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          
          {stage === "questions" && (
            <div className="px-3 py-2 border-t border-amber-200">
              <p className="text-xs text-amber-800 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-1">
                {["Pricing", "Materials", "Trending", "Care tips", "Shipping"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setInput(`Tell me about ${topic.toLowerCase()}`);
                    }}
                    className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-md hover:bg-amber-300"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-center text-amber-700 p-1">
            {isAuthenticated ? 
              `Logged in as ${currentUser?.email}` : 
              "You're not logged in. Log in for personalized assistance."}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
