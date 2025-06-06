const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-20 w-full text-center bg-base-300 py-1 border-t-2 border-primary/50 mt-4">
      Paweł Chudecki &copy; {year}
    </footer>
  );
};
export default Footer;
