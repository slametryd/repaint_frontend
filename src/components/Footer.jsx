import mainLogo from "../assets/logo-putih.png";

const Footer = () => {
  return (
    <div className=" bg-black  py-4 ">
      <div className="container mx-auto px-4">
        <div className=" flex flex-col md:flex-row justify-between items-center gap-4 ">
          <div className="logo ">
            <img src={mainLogo} className="w-[102px] h-[62px]" alt="" />
          </div>
          <ul className="flex flex-col md:flex-row md:gap-8 justify-center text-white gap-4 text-center">
            <li>
              <a href="#">
                {" "}
                repaintbodymengkilat@gmail.com <span>|</span>
              </a>
            </li>
            <li className="">
              <a href="#">repaintbodymengkilat©copyright@2025</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
