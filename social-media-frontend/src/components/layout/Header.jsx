// src/components/layout/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            SocialApp
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/create-post">
                  <Button variant="primary">Create Post</Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline">Search</Button>
                </Link>
                <Link to="/profile">
                  <Avatar src={user.avatar} alt={user.name} size="small" />
                </Link>
                <Button onClick={() => logout()} variant="secondary">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="outline">
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
