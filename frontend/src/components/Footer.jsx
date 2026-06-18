const Footer = () => {
  return (
    <footer className="border-t py-6 px-8 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <p>© 2024 SHORTLINK, THE DIGITAL ARCHITECT.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a href="#" className="hover:text-gray-600">PRIVACY POLICY</a>
          <a href="#" className="hover:text-gray-600">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-gray-600">API DOCUMENTATION</a>
          <a href="#" className="hover:text-gray-600">SUPPORT</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;