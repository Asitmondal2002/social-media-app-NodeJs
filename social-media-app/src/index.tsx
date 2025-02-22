import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import OtherProfile from './pages/Otherprofile';
import Friends from './pages/friends';
import Search from './pages/search';
import EditProfile from './pages/edit_profile_page';
import CreateUserProfile from './pages/create_user_profile';
import ChangePassword from './pages/change-password';
import PasswordSuccess from './pages/password_success';
import AddPost from './pages/add_post';
import UpdatePost from './pages/update_post';
import DeletePost from './pages/delete_post';
import AddComment from './pages/add_comment';
import PageNotFound from './pages/404';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="profile/:userId" element={<OtherProfile />} />
              <Route path="friends" element={<Friends />} />
              <Route path="search" element={<Search />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="create-profile" element={<CreateUserProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="password-success" element={<PasswordSuccess />} />
              <Route path="add-post" element={<AddPost />} />
              <Route path="update-post/:postId" element={<UpdatePost />} />
              <Route path="delete-post/:postId" element={<DeletePost />} />
              <Route path="add-comment/:postId" element={<AddComment />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("⚠️ Root element with ID 'root' not found.");
}
