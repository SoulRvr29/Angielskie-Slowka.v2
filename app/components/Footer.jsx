const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className=" w-full text-center bg-base-300 py-1 border-t-2 border-primary/50">
      Paweł Chudecki &copy; {year}
    </footer>
  );
};
export default Footer;
