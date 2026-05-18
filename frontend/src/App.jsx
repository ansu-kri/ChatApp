import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";

import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";

function App() {

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/chatpage" element={ <ChatPage />} />
        <Route path="/" element={ <LoginPage />} />
        <Route path="/signup" element={ <SignUpPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;



// import Navbar from "./components/Navbar";

// import HomePage from "./pages/ChatPage";
// import SignUpPage from "./pages/SignUpPage";
// import LoginPage from "./pages/LoginPage";
// import SettingsPage from "./pages/SettingsPage";
// import ProfilePage from "./pages/ProfilePage";

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuthStore } from "./store/useAuthStore";
// import { useThemeStore } from "./store/useThemeStore";
// import { useEffect } from "react";

// import { Loader } from "lucide-react";
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
//   const { theme } = useThemeStore();

//   console.log({ onlineUsers });

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   console.log({ authUser });

//   if (isCheckingAuth && !authUser)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );

//   return (
//     <div data-theme={theme}>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
//         <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
//         <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
//         <Route path="/settings" element={<SettingsPage />} />
//         <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
//       </Routes>

//       <Toaster />
//     </div>
//   );
// };
// export default App;

