// const express = require('express');
// const nodemailer = require('nodemailer');
// const mysql = require('mysql2');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const authRoutes = require("./routes/authRoutes");
// const productRoutes = require("./routes/productRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const orderRoutes = require("./routes/orderRoutes");




// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const db = require('./models/db');

// app.post('/register', async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
    
//     const [checkResult] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
//     if (checkResult.length > 0) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    
//     res.status(201).json({ message: 'Registered successfully' });
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

//     if (results.length === 0) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     res.json({ message: 'Welcome to the page' });
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// app.post('/subscribe', async (req, res) => {
//   const { email } = req.body;
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Welcome!',
//     text: 'Thank you for subscribing!',
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send({ message: 'Welcome email sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send({ message: 'Failed to send email.', error });
//   }
// });


// const chatbotResponses = [
//   {
//     keywords: ["hello", "hi", "hey", "greetings"],
//     response: "Hello! Welcome to our jewelry store. How can I assist you today?"
//   },
//   {
//     keywords: ["morning"],
//     response: "Good morning! 🌞 Hope you have a great day! How can I assist you?"
//   },
//   {
//     keywords: ["afternoon"],
//     response: "Good afternoon! ☀️ Let me know if you need any help finding the perfect jewelry."
//   },
//   {
//     keywords: ["evening"],
//     response: "Good evening! 🌙 How can I assist you today?"
//   },
//   {
//     keywords: ["how are you", "how's it going", "what's up", "yo"],
//     response: "I'm great! Thanks for asking. 😊 How can I assist you today?"
//   },
//   {
//     keywords: ["gold", "gold jewelry", "sell gold"],
//     response: "Yes! We have a variety of gold jewelry, including rings, necklaces, and bracelets. Our gold pieces range from 14k to 24k gold with various designs."
//   },
//   {
//     keywords: ["discount", "offer", "sale", "deals", "promotion"],
//     response: "Yes! We frequently offer discounts. You can check our 'Deals' section for ongoing offers. We also have a loyalty program for returning customers!"
//   },
//   {
//     keywords: ["custom", "customize", "design", "personalize", "bespoke"],
//     response: "Yes! We provide custom design services. You can share your design ideas, and we'll craft a unique piece for you. Our designers have over 20 years of experience!"
//   },
//   {
//     keywords: ["care", "maintain", "clean", "polish", "maintenance"],
//     response: "To maintain your jewelry: 1) Avoid water exposure 2) Store in a dry place 3) Clean with a soft cloth 4) Remove before physical activities 5) Polish occasionally with appropriate jewelry cleaner."
//   },
//   {
//     keywords: ["track", "order", "shipping", "delivery", "package"],
//     response: "You can track your order by logging into your account and checking the 'My Orders' section. Alternatively, provide your order number, and we'll check the status for you."
//   },
//   {
//     keywords: ["return", "refund", "exchange", "policy"],
//     response: "Our return policy allows returns within 14 days of purchase with the original receipt. Items must be in original condition with all packaging. Store credit or exchanges are always available."
//   },
//   {
//     keywords: ["location", "store", "shop", "visit", "address"],
//     response: "Our main store is located at 123 Jewelry Lane, Downtown. We're open Monday-Saturday from 10am to 7pm, and Sunday from 12pm to 5pm."
//   },
//   {
//     keywords: ["warranty", "guarantee"],
//     response: "All our jewelry comes with a 1-year warranty against manufacturing defects. Premium collections include an extended 3-year warranty."
//   },
//   {
//     keywords: ["diamond", "diamonds", "certification"],
//     response: "All our diamonds are certified by GIA or IGI. Each piece comes with authentication certificates detailing the 4Cs - cut, clarity, color, and carat."
//   },
//   {
//     keywords: ["price", "cost", "expensive", "cheap", "affordable"],
//     response: "Our jewelry ranges from affordable everyday pieces to luxury collections. We have something for every budget, starting from $50 up to exquisite pieces worth several thousand."
//   },
//   {
//     keywords: ["bye", "goodbye", "see you", "thanks", "thank you"],
//     response: "Thank you for visiting! Have a wonderful day! Feel free to reach out if you have any more questions. 😊"
//   }
// ];

// // Updated chatbot endpoint handler
// app.post("/api/chatbot", (req, res) => {
//   const userMessage = req.body.message.toLowerCase().trim();
  
//   // Try to find a matching response from our defined responses
//   for (const item of chatbotResponses) {
//     if (item.keywords.some(keyword => userMessage.includes(keyword))) {
//       return res.json({ reply: item.response });
//     }
//   }
  
//   // Default response if no match is found
//   res.json({ 
//     reply: "I'm not sure how to respond to that. Could you rephrase your question? You can ask about our gold jewelry, custom designs, care instructions, or return policy." 
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use('/uploads', express.static('uploads'));
// app.use("/api/products", productRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/orders", orderRoutes);

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });






const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require("axios");
const jwt = require('jsonwebtoken'); // Make sure this is installed
const cookieParser = require('cookie-parser'); // Add this package with npm install cookie-parser
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Updated CORS config to allow credentials
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie parser middleware

const db = require('./models/db');

// JWT secret key - move to .env file in production
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const [checkResult] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
    
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [results] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with user info
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    });

    // Return token and user data in response for client-side storage
    res.json({ 
      message: 'Welcome to the page',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Add logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Add user info to request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Example protected route
app.get('/api/user-profile', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Protected data retrieved successfully',
    user: req.user
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome!',
    text: 'Thank you for subscribing!',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send email.', error });
  }
});

app.post("/gemini-chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

    const response = await axios.post(
      geminiEndpoint,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Internal server error while processing chatbot message.",
      details: error.response?.data || error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});