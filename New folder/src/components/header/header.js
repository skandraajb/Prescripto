import { Drawer, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CiCircleInfo } from "react-icons/ci";
import { FaSearch, FaHome } from "react-icons/fa";
import { IoIosContact, IoIosMenu, IoMdArrowDropup } from "react-icons/io";
import { RiDashboardFill, RiCustomerService2Fill } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import { AiOutlineUser } from 'react-icons/ai';
import axios from "axios";
import './header.css';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser?.role || null);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUserRole(null);
    }
  }, []);

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setOpen(false);
      navigate('/Signin');
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  const renderRoleBasedLinks = () => {
    if (userRole === "doctor") {
      return (
        <>
          <Link to="/DoctorDashboard">
            <button className="dashboard">
              <RiDashboardFill style={{ marginRight: "10px" }} /> Dashboard
            </button>
          </Link>
          <Link to="/docPrescriptions">
            <button className="categories">
              <MdCategory style={{ marginRight: "10px" }} /> Prescriptions
            </button>
          </Link>
          <Link to="/docAppointment">
            <button className="categories">
              <FaRegCalendarAlt style={{ marginRight: "10px" }} /> Appointments
            </button>
          </Link>
          <Link to="/DocProfile">
            <button className="aboutbutton">
              <AiOutlineUser style={{ marginRight: "10px" }} /> Profile
            </button>
          </Link>
        </>
      );
    } else if (userRole === "patient") {
      return (
        <>
          <Link to="/dashboard">
            <button className="dashboard">
              <RiDashboardFill style={{ marginRight: "10px" }} /> Dashboard
            </button>
          </Link>
          <Link to="/prescriptions">
            <button className="categories">
              <MdCategory style={{ marginRight: "10px" }} /> Prescriptions
            </button>
          </Link>
          <Link to="/Appointment">
            <button className="categories">
              <FaRegCalendarAlt style={{ marginRight: "10px" }} /> Appointments
            </button>
          </Link>
          <Link to="/PatientProfile">
            <button className="aboutbutton">
              <AiOutlineUser style={{ marginRight: "10px" }} /> Profile
            </button>
          </Link>
        </>
      );
    }
    return null; // No role? No private links
  };

  return (
    <header>
      <div className="navbar">
        <div className="sidemenu">
          <IconButton onClick={toggleDrawer(true)}>
            <IoIosMenu className="menu" />
          </IconButton>
          <Drawer className="draw-sidebar" anchor="left" open={open} onClose={toggleDrawer(false)}>
            <center>
              <h2 style={{ color: "#004c8c", marginTop: "10px", marginBottom: "30px" }}>CONTENTS</h2>
            </center>
            <div className="top-button">
              <Link to="/">
                <button className="homebutton">
                  <FaHome style={{ marginRight: "10px" }} /> Home
                </button>
              </Link>

              {renderRoleBasedLinks()}

              <Link to="/about">
                <button className="aboutbutton">
                  <CiCircleInfo style={{ marginRight: "10px" }} /> About
                </button>
              </Link>
              <Link to="/ContactUs">
                <button className="contactus">
                  <RiCustomerService2Fill style={{ marginRight: "10px" }} /> Contact Us
                </button>
              </Link>
            </div>

            <div className="bottom-button">
              <button className="logoutbutton" onClick={handleLogout}>
                <BiLogOut style={{ marginRight: "10px" }} /> Logout
              </button>
            </div>
          </Drawer>
        </div>

        <div className="navbar-logo">
          <Link to="/"><div className="logo"></div></Link>
        </div>

        <div className="nav-search">
          <input
            type="text"
            placeholder="Search prescription or find a doctor"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
                setSearchQuery('');
              }
            }}
          />
          <div className="search-icon" onClick={() => {
            if (searchQuery.trim() !== '') {
              navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
              setSearchQuery('');
            }
          }}>
            <FaSearch />
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-login">
            <button className="login">
              <IoIosContact className="contact" />
              <p>Account</p>
            </button>
            <div className="nav-submenu">
              <IoMdArrowDropup className="nav-submenu-arrowup" />
              <label>
                <div className="submenu-signin">
                  <Link to="/Signin">
                    <button>Sign in</button>
                  </Link>
                  <p>New customer? Start here.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="nav-about">
            <Link to="/About">
              <button className="about">
                <CiCircleInfo className="ab-info" />
                <p>About us</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
