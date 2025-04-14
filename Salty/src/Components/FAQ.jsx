import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What types of jewelry do you offer in your collection?",
      answer: "We offer a wide range of jewelry including earrings, rings, necklaces, bracelets, and more, crafted with premium materials.",
    },
    {
      question: "What materials are your jewellery pieces made of?",
      answer: "Our pieces are made from high-quality materials like gold, silver, rose gold, and alloy, ensuring both style and durability.",
    },
    {
      question: "What is the price range for your jewellery?",
      answer: "Our jewelry ranges from affordable to premium, with options for every budget.",
    },
    {
      question: "How can I care for my Salty Jewellery pieces?",
      answer: "To care for your jewelry, avoid contact with water, perfumes, and chemicals. Store them in a cool, dry place.",
    },
    {
      question: "Do you offer gift wrapping or gift cards?",
      answer: "Yes, we offer both gift wrapping services and gift cards for special occasions.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="max-w-6xl w-full my-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-300 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center py-3">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <ChevronDown
                  className={`w-6 h-6 text-purple-600 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openIndex === index && (
                <div className="text-gray-600 py-2 transition duration-300 ease-in-out">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

