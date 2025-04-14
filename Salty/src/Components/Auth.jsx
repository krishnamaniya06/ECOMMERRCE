// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('customer');
//   const [message, setMessage] = useState('');
//   const [isRedirecting, setIsRedirecting] = useState(false);
  
//   const navigate = useNavigate();

//   // Handle redirect after successful login
//   useEffect(() => {
//     if (isRedirecting) {
//       const redirectTimer = setTimeout(() => {
//         navigate('/');  // Redirect to home page
//       }, 1500);
      
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [isRedirecting, navigate]);

//   // Register Handler
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/register', {
//         email,
//         password,
//         role,
//       });
//       setMessage(response.data.message);
//       setIsLogin(true);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Registration error');
//     }
//   };

//   // Login Handler
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/login', {
//         email,
//         password,
//       });
//       setMessage(response.data.message);
//       setIsRedirecting(true);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Login error');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-amber-50 px-4 py-8">
//       <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-md border border-amber-200">
//         <h2 className="text-2xl mb-6 font-serif text-center text-amber-800">
//           {isLogin ? 'Login' : 'Create Account'}
//         </h2>

//         <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
//           <div className="relative">
//             <label htmlFor="email" className="text-sm text-amber-800 block mb-1">Email Address</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
//               required
//             />
//           </div>
          
//           <div className="relative">
//             <label htmlFor="password" className="text-sm text-amber-800 block mb-1">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
//               required
//             />
//           </div>
          
//           {!isLogin && (
//             <div className="relative">
//               <label htmlFor="role" className="text-sm text-amber-800 block mb-1">Account Type</label>
//               <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 appearance-none"
//               >
//                 <option value="customer">Customer</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <div className="absolute right-3 top-10 pointer-events-none">
//                 <svg className="h-4 w-4 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           )}
          
//           <button
//             type="submit"
//             className="w-full p-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-md transition-colors duration-300 shadow-md"
//             disabled={isRedirecting}
//           >
//             {isLogin ? 'Sign In' : 'Create Account'}
//           </button>
//         </form>

//         {message && (
//           <div className="mt-4 p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-md">
//             {message}
//             {isRedirecting && <p className="mt-2 text-sm">Redirecting to homepage...</p>}
//           </div>
//         )}

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setMessage('');
//             }}
//             className="text-amber-700 hover:text-amber-900 font-medium text-sm underline"
//           >
//             {isLogin ? 'New customer? Create an account' : 'Already have an account? Sign in'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;









import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // If already logged in, redirect to home
    }
  }, [navigate]);

  // Handle redirect after successful login
  useEffect(() => {
    if (isRedirecting) {
      const redirectTimer = setTimeout(() => {
        navigate('/');  // Redirect to home page
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isRedirecting, navigate]);

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        email,
        password,
        role,
      });
      setMessage(response.data.message);
      setIsLogin(true); // Switch to login form after successful registration
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration error');
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      }, { withCredentials: true }); // Important for cookies
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Optional: store user info
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Set axios default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setMessage(response.data.message);
      setIsRedirecting(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50 px-4 py-8">
      <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-md border border-amber-200">
        <h2 className="text-2xl mb-6 font-serif text-center text-amber-800">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="text-sm text-amber-800 block mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
              required
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="text-sm text-amber-800 block mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="relative">
              <label htmlFor="role" className="text-sm text-amber-800 block mb-1">Account Type</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 appearance-none"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute right-3 top-10 pointer-events-none">
                <svg className="h-4 w-4 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full p-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-md transition-colors duration-300 shadow-md"
            disabled={isRedirecting}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-amber-100 border border-amber-300 text-amber-800 rounded-md">
            {message}
            {isRedirecting && <p className="mt-2 text-sm">Redirecting to homepage...</p>}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-amber-700 hover:text-amber-900 font-medium text-sm underline"
          >
            {isLogin ? 'New customer? Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;