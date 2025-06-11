import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Calls from "./components/Calls";
import Tags from "./components/Tags";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App h-screen">
          <Navbar>
            <div className="h-full overflow-auto bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/calls"
                  element={
                    <ProtectedRoute>
                      <Calls />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/tags"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Tags />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Navbar>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
