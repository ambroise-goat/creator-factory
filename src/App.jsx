import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Join from "./pages/Join";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ServerDetail from "./pages/ServerDetail";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join" element={<Join />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/servers/:id" element={<ServerDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
