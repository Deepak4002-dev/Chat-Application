import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PublicLayout from "./layout/PublicLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./components/user/Dashboard";
import { Toaster } from "sonner";
import PublicRoute from "./components/common/PublicRoute";
import FriendSuggestions from "./pages/user/FriendSuggestions";
import FriendRequests from "./pages/user/FriendRequests";
import PrivateChats from "./pages/user/PrivateChats";
import ChatRoom from "./pages/user/ChatRoom";
import CreateGroup from "./pages/user/CreateGroup";
import GroupChats from "./pages/user/GroupChats";

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
          <Route path="suggestions" element={<FriendSuggestions />} />
          <Route path="requests" element={<FriendRequests />} />
          <Route path="private-chats" element={<PrivateChats />} />
          <Route path="create-group" element={<CreateGroup />} />
          <Route path="group-chats" element={<GroupChats />} />
          <Route path=":id" element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
