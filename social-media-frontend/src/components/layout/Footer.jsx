// src/components/layout/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500">
            © {new Date().getFullYear()} SocialApp. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="/terms" className="text-gray-500 hover:text-primary">
              Terms
            </a>
            <a href="/privacy" className="text-gray-500 hover:text-primary">
              Privacy
            </a>
            <a href="/contact" className="text-gray-500 hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
