// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../../context/ThemeContext";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import DescriptionIcon from "@mui/icons-material/Description";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import LogoutIcon from "@mui/icons-material/Logout";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import { getUserInfo, getExercises, getSubmissions } from "../../services/api";
// import TraiterSujet from "./TraiterSujet";
// import ConsulterCorrection from "./ConsulterCorrection";
// import SuivrePerformance from "./SuivrePerformance";

// function StudentDashboard() {
//   const navigate = useNavigate();
//   const { mode, toggleTheme } = useContext(ThemeContext);
//   const [activeSection, setActiveSection] = useState("Traiter un sujet");
//   const [userName, setUserName] = useState("Étudiant");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const { data } = await getUserInfo();
//         setUserName(`${data.first_name || data.email.split('@')[0]} ${data.last_name || ''}`);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des informations de l'utilisateur :", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserInfo();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   const handleNavigation = (section) => {
//     setActiveSection(section);
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
//       {/* Sidebar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: 240,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: 240,
//             boxSizing: "border-box",
//             backgroundColor: (theme) => theme.palette.background.sidebar,
//             color: (theme) => theme.palette.text.primary,
//             display: "flex",
//             flexDirection: "column",
//           },
//         }}
//       >
//         <Box sx={{ p: 3, textAlign: "left" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Base Brain
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             Salut, {userName}
//           </Typography>
//         </Box>
//         <Divider sx={{ backgroundColor: (theme) => theme.palette.text.secondary + "33", mx: 2 }} />
//         <List sx={{ px: 2 }}>
//           <ListItem
//             button
//             selected={activeSection === "Traiter un sujet"}
//             onClick={() => handleNavigation("Traiter un sujet")}
//             sx={{
//               borderRadius: 1,
//               mb: 1,
//               "&.Mui-selected": {
//                 backgroundColor: (theme) => theme.palette.secondary.main,
//                 "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main },
//               },
//               "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main + "80" },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <AssignmentIcon sx={{ color: (theme) => theme.palette.text.primary }} />
//             </ListItemIcon>
//             <ListItemText primary="Traiter un sujet" />
//           </ListItem>
//           <ListItem
//             button
//             selected={activeSection === "Consulter la correction"}
//             onClick={() => handleNavigation("Consulter la correction")}
//             sx={{
//               borderRadius: 1,
//               mb: 1,
//               "&.Mui-selected": {
//                 backgroundColor: (theme) => theme.palette.secondary.main,
//                 "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main },
//               },
//               "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main + "80" },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <DescriptionIcon sx={{ color: (theme) => theme.palette.text.primary }} />
//             </ListItemIcon>
//             <ListItemText primary="Consulter la correction" />
//           </ListItem>
//           <ListItem
//             button
//             selected={activeSection === "Suivre sa performance"}
//             onClick={() => handleNavigation("Suivre sa performance")}
//             sx={{
//               borderRadius: 1,
//               mb: 1,
//               "&.Mui-selected": {
//                 backgroundColor: (theme) => theme.palette.secondary.main,
//                 "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main },
//               },
//               "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main + "80" },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <BarChartIcon sx={{ color: (theme) => theme.palette.text.primary }} />
//             </ListItemIcon>
//             <ListItemText primary="Suivre sa performance" />
//           </ListItem>
//         </List>
//         <Box sx={{ flexGrow: 1 }} />
//         <List sx={{ px: 2, pb: 2 }}>
//           <ListItem
//             button
//             onClick={toggleTheme}
//             sx={{
//               borderRadius: 1,
//               mb: 1,
//               "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main + "80" },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               {mode === "light" ? (
//                 <Brightness4Icon sx={{ color: (theme) => theme.palette.text.primary }} />
//               ) : (
//                 <Brightness7Icon sx={{ color: (theme) => theme.palette.text.primary }} />
//               )}
//             </ListItemIcon>
//             <ListItemText primary={mode === "light" ? "Mode sombre" : "Mode clair"} />
//           </ListItem>
//           <ListItem
//             button
//             onClick={handleLogout}
//             sx={{
//               borderRadius: 1,
//               "&:hover": { backgroundColor: (theme) => theme.palette.secondary.main + "80" },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               <LogoutIcon sx={{ color: (theme) => theme.palette.text.primary }} />
//             </ListItemIcon>
//             <ListItemText primary="Déconnexion" />
//           </ListItem>
//         </List>
//       </Drawer>

//       {/* Contenu principal */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           backgroundColor: (theme) => theme.palette.background.default,
//           height: "100%",
//           overflow: "auto",
//         }}
//       >
//         {activeSection === "Traiter un sujet" && <TraiterSujet />}
//         {activeSection === "Consulter la correction" && <ConsulterCorrection />}
//         {activeSection === "Suivre sa performance" && <SuivrePerformance />}
//       </Box>
//     </Box>
//   );
// }

// export default StudentDashboard;

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Slide,
} from "@mui/material";
import { motion } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { getUserInfo } from "../../services/api";
import TraiterSujet from "./TraiterSujet";
import ConsulterCorrection from "./ConsulterCorrection";
import SuivrePerformance from "./SuivrePerformance";

// Animation variants for framer-motion
const sidebarItemVariants = {
  initial: { x: -20, opacity: 0 },
  animate: (index) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3 
    }
  }
};

const logoVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Define the theme colors based on the image
const sidebarColors = {
  background: "#5D4294", // Deep purple as in the image
  selectedItem: "#6F51A8", // Slightly lighter purple for selected items
  hoverItem: "#6F51A8B0", // Semi-transparent version for hover effect
  text: "#FFFFFF", // White text
  divider: "#FFFFFF33", // Semi-transparent white for dividers
};

// Increased sidebar width
const SIDEBAR_WIDTH = 280; // Increased from 240px

function StudentDashboard() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState("Traiter un sujet");
  const [userName, setUserName] = useState("Étudiant");
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await getUserInfo();
        setUserName(`${data.first_name || data.email.split('@')[0]} ${data.last_name || ''}`);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur :", err);
      } finally {
        setLoading(false);
        // Slight delay to ensure smooth animation sequence
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    // Add exit animation before logout
    setContentLoaded(false);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }, 400);
  };

  const handleNavigation = (section) => {
    // Add transition between sections
    setContentLoaded(false);
    setTimeout(() => {
      setActiveSection(section);
      setContentLoaded(true);
    }, 300);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress />
        </motion.div>
      </Box>
    );
  }

  const menuItems = [
    { text: "Traiter un sujet", icon: <AssignmentIcon />, section: "Traiter un sujet" },
    { text: "Consulter la correction", icon: <DescriptionIcon />, section: "Consulter la correction" },
    { text: "Suivre sa performance", icon: <BarChartIcon />, section: "Suivre sa performance" }
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Sidebar with animation and matched colors */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            backgroundColor: sidebarColors.background, // Using the defined purple color
            color: sidebarColors.text, // White text
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Slide direction="right" in={true} timeout={600}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              <Box sx={{ p: 3, textAlign: "left", display: "flex", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
                  Base Brain
                </Typography>
                <Box component="span" sx={{ fontSize: 20 }}>🧠</Box>
              </Box>
              <Typography variant="body2" sx={{ px: 3, pb: 2 }}>
                Salut, {userName}
              </Typography>
            </motion.div>
            <Divider sx={{ backgroundColor: sidebarColors.divider, mx: 2 }} />
            <List sx={{ px: 2, mt: 1, flex: 1 }}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.section}
                  custom={index}
                  variants={sidebarItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <ListItem
                    onClick={() => handleNavigation(item.section)}
                    sx={{
                      borderRadius: 1,
                      mb: 2,
                      py: 1.8, // More vertical padding
                      transition: "background-color 0.3s, transform 0.2s",
                      "&.Mui-selected": {
                        backgroundColor: sidebarColors.selectedItem,
                        "&:hover": { backgroundColor: sidebarColors.selectedItem },
                      },
                      "&:hover": { 
                        backgroundColor: sidebarColors.hoverItem,
                      },
                      backgroundColor:
                        activeSection === item.section
                          ? sidebarColors.selectedItem
                          : "transparent",
                      cursor: "pointer", // Add pointer cursor for all items
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{ color: sidebarColors.text }}>
                        {item.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        "& .MuiListItemText-primary": { 
                          fontWeight: activeSection === item.section ? "bold" : "normal",
                          fontSize: "0.95rem",
                        } 
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
            
            {/* Bottom Fixed Section for Theme Toggle and Logout */}
            <Box sx={{ mt: "auto" }}>
              <Divider sx={{ backgroundColor: sidebarColors.divider, mx: 2, mb: 2 }} />
              <List sx={{ px: 2, pb: 2 }}>
                <motion.div
                  variants={sidebarItemVariants}
                  custom={4}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <ListItem
                    onClick={toggleTheme}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      py: 1.5,
                      transition: "background-color 0.3s",
                      "&:hover": { backgroundColor: sidebarColors.hoverItem },
                      cursor: "pointer", // Add pointer cursor
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {mode === "light" ? (
                        <Brightness4Icon sx={{ color: sidebarColors.text }} />
                      ) : (
                        <Brightness7Icon sx={{ color: sidebarColors.text }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={mode === "light" ? "Mode sombre" : "Mode clair"}
                      sx={{ 
                        "& .MuiListItemText-primary": { 
                          fontSize: "0.95rem",
                        } 
                      }}
                    />
                  </ListItem>
                </motion.div>
                <motion.div
                  variants={sidebarItemVariants}
                  custom={5}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <ListItem
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      py: 1.5,
                      transition: "background-color 0.3s",
                      "&:hover": { backgroundColor: sidebarColors.hoverItem },
                      cursor: "pointer", // Add pointer cursor
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LogoutIcon sx={{ color: sidebarColors.text }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Déconnexion"
                      sx={{ 
                        "& .MuiListItemText-primary": { 
                          fontSize: "0.95rem",
                        } 
                      }}
                    />
                  </ListItem>
                </motion.div>
              </List>
            </Box>
          </Box>
        </Slide>
      </Drawer>

      {/* Main content with animation */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.background.default,
          height: "100%",
          overflow: "auto",
        }}
      >
        <motion.div
          key={activeSection}
          variants={contentVariants}
          initial="initial"
          animate={contentLoaded ? "animate" : "exit"}
          style={{ height: "100%" }}
        >
          {activeSection === "Traiter un sujet" && <TraiterSujet />}
          {activeSection === "Consulter la correction" && <ConsulterCorrection />}
          {activeSection === "Suivre sa performance" && <SuivrePerformance />}
        </motion.div>
      </Box>
    </Box>
  );
}

export default StudentDashboard;