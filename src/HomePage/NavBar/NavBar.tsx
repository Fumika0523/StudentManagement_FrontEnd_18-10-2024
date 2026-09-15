import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

import { FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { MdMenu } from "react-icons/md";

import "../NavBar/NavBar.css";


// ========================================
// COMPONENT PROPS
// ========================================

interface NavBarProps {
  /*
   * App.tsx controls the mobile sidebar.
   * Clicking the hamburger button calls this function.
   */
  toggleSidebar: () => void;
}


// ========================================
// USER TYPES
// ========================================

/*
 * The Google/profile response may contain different
 * user fields depending on how the user signed in.
 *
 * They are optional because not every login method
 * necessarily returns all of them.
 */
interface NavBarUser {
  firstName?: string;
  name?: string;
  email?: string;
}


interface GoogleProfileResponse {
  loggedIn: boolean;
  user?: NavBarUser;
}


// ========================================
// NAVBAR COMPONENT
// ========================================

export default function NavBar({
  toggleSidebar,
}: NavBarProps) {
  const navigate = useNavigate();


  /*
   * User starts as null because the profile request
   * has not completed when the component first renders.
   */
  const [user, setUser] = useState<NavBarUser | null>(null);


  /*
   * The existing application stores the user's first
   * name in sessionStorage for display in the navbar.
   */
  const firstName =
    sessionStorage.getItem("firstName") ?? "";


  // ========================================
  // LOAD GOOGLE PROFILE
  // ========================================

  const getGoogleProfile = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8001/",
        {
          method: "GET",
          credentials: "include",
        }
      );


      /*
       * fetch().json() does not automatically know
       * the response shape, so we give it our
       * GoogleProfileResponse type.
       */
      const data =
        (await response.json()) as GoogleProfileResponse;


      if (data.loggedIn && data.user) {
        setUser(data.user);
      }
    } catch (error: unknown) {
      /*
       * TypeScript catch values are unknown.
       * We don't need to assume a particular error shape.
       */
      console.error(
        "Error fetching Google profile:",
        error
      );
    }
  };


  // ========================================
  // LOAD PROFILE ON FIRST RENDER
  // ========================================

  useEffect(() => {
    void getGoogleProfile();
  }, []);


  // ========================================
  // DISPLAY NAME
  // ========================================

  /*
   * Prefer the first name stored by the existing app.
   *
   * If it is unavailable, use the fetched profile as
   * a fallback.
   */
  const displayName =
    firstName ||
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";


  // ========================================
  // USER MENU DISPLAY
  // ========================================

  const userMenu = (
    <span className="d-flex flex-row align-items-center text-secondary">
      {displayName}

      <Image
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        alt="User profile"
        roundedCircle
        style={{
          width: "35px",
        }}
        className="ms-2"
      />
    </span>
  );


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogOut = (): void => {
    /*
     * Preserve the current logout behaviour by clearing
     * authentication data from both storage locations.
     */
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");

    localStorage.removeItem("token");
    localStorage.removeItem("role");


    navigate("/");
  };


  // ========================================
  // UI
  // ========================================

  return (
    <Navbar
      expand="lg"
      sticky="top"
      bg="light"
      className="shadow-sm"
    >
      <Container
        fluid
        className="d-flex align-items-center flex-nowrap justify-content-between"
      >
        {/* ========================================
            MOBILE SIDEBAR BUTTON
        ======================================== */}

        <MdMenu
          className="d-flex d-sm-block d-md-none"
          size={30}
          style={{
            cursor: "pointer",
            color: "#4e73df",
            position: "absolute",
            left: "15px",
          }}
          onClick={toggleSidebar}
        />


        {/* ========================================
            RIGHT SIDE USER MENU
        ======================================== */}

        <Nav className="d-flex flex-row align-items-center gap-3 ms-auto">
          <NavDropdown
            align="end"
            id="basic-nav-dropdown"
            title={userMenu}
            className="text-center user-dropdown"
          >
            {/* Profile */}

            <NavDropdown.Item
              href="/profile"
              className="d-flex align-items-center gap-2"
            >
              <FaUser className="fs-5 iconStyle" />

              Profile
            </NavDropdown.Item>


            <NavDropdown.Divider />


            {/* Sign out */}

            <NavDropdown.Item
              as="button"
              className="d-flex align-items-center gap-2"
              onClick={handleLogOut}
            >
              <PiSignOutBold className="fs-5 iconStyle" />

              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}