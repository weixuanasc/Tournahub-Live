import Navbar from "./Navbar";
import NavbarA from "./Applicant/NavbarA";
import NavbarSA from "../components/NavbarSA";
import NavbarTO from "../components/NavbarTO";
import NavbarS from "../components/NavbarS";

const SelectNavbar = () => {
  const loginSA = window.localStorage.getItem("loggedInSA");
  const loginA = window.localStorage.getItem("loggedInA");
  const loginTO = window.localStorage.getItem("loggedInTO");
  const loginS = window.localStorage.getItem("loggedInS");

  if (loginSA) {
    // Modify Navbar for SysAdmin
    return <NavbarSA />;
  } else if (loginA) {
    // Modify Navbar for User
    return <NavbarA />;
  } else if (loginTO) {
    // Modify Navbar for Tournament Organizer
    return <NavbarTO />;
  } else if (loginS) {
    // Modify Navbar for Sponsor
    return <NavbarS />;
  } else {
    // Default Navbar (You can modify this according to your requirements)
    return <Navbar />;
  }
};

export default SelectNavbar;
