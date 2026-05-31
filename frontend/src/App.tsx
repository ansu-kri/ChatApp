import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

      {/* <Route path="/chat" element={<Chat />} /> */}
    </Routes>
  );
}

export default App;
