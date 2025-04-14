import Navbar from "./Components/Navbar";
import Banner from "./Components/Banner";
import Sidebar from "./Components/Sidebar";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import FAQ from "./Components/FAQ";
import Chatbot from "./Components/Chatbot";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Banner Section */}
      <Banner />

      {/* Main Content Wrapper */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar className="w-64" />

        {/* Content */}
        <div className="flex-1 p-4 container">
          <Content />
        </div>
      </div>
      <FAQ/>
      <Chatbot/>
    
      {/* Footer Outside Main Content */}
      <Footer />
    </div>
  );
}

export default App;

