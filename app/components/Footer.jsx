const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className=" w-full text-center bg-orange-800 text-white py-1 ">
      Paweł Chudecki &copy; {year}
    </footer>
  );
};
export default Footer;
