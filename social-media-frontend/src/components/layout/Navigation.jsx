// src/components/layout/Navigation.jsx
import Header from "./Header";
import Footer  from "./Footer";
import Sidebar from "./Sidebar";

const Navigation = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Navigation;
