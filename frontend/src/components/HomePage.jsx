import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dashboard from "./Dashboard";
import BidPage from "./BidPage";
import Faq from "./Faq";
import AdminPage from "./AdminPage";
import Profile from "./Profile";
import Paper from "@mui/material/Paper";
import NavbarPhone from "./NavbarPhone";

function HomePage() {
  const { isLoggedIn, logout, isLoading, role } = useAuth();
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const navigate = useNavigate();

  const changeTab = (e, tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return (
    !isLoading &&
    isLoggedIn && (
      <div className="flex flex-col min-h-screen">
        <div className="hidden md:block">
          <Tabs
            value={selectedTab}
            onChange={changeTab}
            aria-label="mui tab bar"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Dashboard" value="Dashboard" />
            <Tab label="My Bid" value="My Bid" />
            <Tab label="FAQ" value="FAQ" />
            {role === "admin" && <Tab label="Admin" value="Admin" />}
            <Box sx={{ flexGrow: 1 }} />
            <Tab value="Profile" label="Profile" />
            <Tab label="Logout" value="Log out" onClick={logout} />
          </Tabs>
        </div>
        <Box>
          <div className="max-w-[800px] min-w-[300px] p-8 mx-auto md:mt-4 mb-12">
            <Paper elevation={3} className="p-8">
              {selectedTab === "Dashboard" && <Dashboard />}
              {selectedTab === "My Bid" && <BidPage />}
              {selectedTab === "FAQ" && <Faq />}
              {selectedTab === "Admin" && <AdminPage />}
              {selectedTab === "Profile" && <Profile />}
            </Paper>
          </div>
        </Box>
        <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
          <NavbarPhone
            activeTab={selectedTab}
            setActiveTab={setSelectedTab}
            handleClick={logout}
          />
        </div>
      </div>
    )
  );
}

export default HomePage;
