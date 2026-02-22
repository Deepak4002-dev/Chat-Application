import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PublicLayout from "./layout/PublicLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./components/user/Dashboard";
import { Toaster } from "sonner";
import PublicRoute from "./components/common/PublicRoute";
import Friends from "./pages/user/Friends";
import GroupChats from "./pages/user/GroupChats";
import SuggestionFriends from "./pages/user/SuggestionFriends";
import ChatRoom from "./pages/user/ChatRoom";
import Profile from "./pages/user/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" duration={3000} />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route
            index
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        {/*Protected ROutes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="friends" element={<Friends />} />
          <Route path="group-chats" element={<GroupChats />} />
          <Route path="find" element={<SuggestionFriends />} />
          <Route path="profile" element={<Profile />} />
          <Route path=":id" element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
