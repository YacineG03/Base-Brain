import React, { useState, useEffect } from "react";
import { Chip } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import BrainIcon from "@mui/icons-material/Psychology";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(124, 77, 255, 0.4)",
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Set animation complete after initial render
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data } = await login(email, password);
      console.log("Réponse complète de l'API :", data);
      
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      console.log("Rôle stocké dans localStorage :", data.user.role);
      
      // Add a small delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion. Veuillez vérifier vos identifiants.");
      console.error("Erreur lors de la connexion :", err.response?.data);
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        background: "linear-gradient(135deg, #1C2526 0%, #2C3E50 100%)",
      }}
    >
      <Grid container sx={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
        {/* Partie gauche */}
        <Grid
          item
          xs={12}
          md={6}
          component={motion.div}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          sx={{
            backgroundColor: "rgba(28, 37, 38, 0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: 3, md: 6 },
            height: "100%",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.3)",
            zIndex: 1,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "radial-gradient(circle at 30% 20%, rgba(124, 77, 255, 0.1) 0%, rgba(28, 37, 38, 0) 70%)",
              zIndex: -1,
            }
          }}
        >
          <Container maxWidth="sm">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={logoVariants}
                animate={animationComplete ? "pulse" : "visible"}
                className="logo"
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    mb: 4
                  }}
                >
                  <BrainIcon 
                    sx={{ 
                      fontSize: 50, 
                      color: "#7C4DFF",
                      filter: "drop-shadow(0px 0px 10px rgba(124, 77, 255, 0.5))"
                    }} 
                  />
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h3"
                  color="#FFFFFF"
                  gutterBottom
                  sx={{ 
                    textAlign: "center", 
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                    fontWeight: "bold",
                    mb: 1,
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  Connexion
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  color="#B0BEC5"
                  gutterBottom
                  sx={{ 
                    textAlign: "center", 
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    mb: 4
                  }}
                >
                  Entrez vos identifiants pour accéder à votre espace
                </Typography>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                        color: "#ff5252",
                        border: "1px solid rgba(211, 47, 47, 0.2)",
                        "& .MuiAlert-icon": {
                          color: "#ff5252"
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#7C4DFF" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ 
                      style: { color: "#B0BEC5" },
                      shrink: true
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { 
                          borderColor: "rgba(176, 190, 197, 0.3)",
                          borderWidth: "2px",
                          borderRadius: "12px"
                        },
                        "&:hover fieldset": { 
                          borderColor: "rgba(124, 77, 255, 0.5)" 
                        },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#7C4DFF",
                          boxShadow: "0px 0px 8px rgba(124, 77, 255, 0.3)"
                        },
                        backgroundColor: "rgba(44, 47, 51, 0.7)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                      },
                      "& .MuiInputBase-input": { 
                        color: "#FFFFFF",
                        padding: "16px 14px",
                        "&::placeholder": {
                          color: "rgba(176, 190, 197, 0.5)",
                          opacity: 1
                        }
                      },
                    }}
                    required
                    placeholder="Entrez votre email"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Mot de passe"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#7C4DFF" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: "#B0BEC5" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ 
                      style: { color: "#B0BEC5" },
                      shrink: true
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { 
                          borderColor: "rgba(176, 190, 197, 0.3)",
                          borderWidth: "2px",
                          borderRadius: "12px"
                        },
                        "&:hover fieldset": { 
                          borderColor: "rgba(124, 77, 255, 0.5)" 
                        },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#7C4DFF",
                          boxShadow: "0px 0px 8px rgba(124, 77, 255, 0.3)"
                        },
                        backgroundColor: "rgba(44, 47, 51, 0.7)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                      },
                      "& .MuiInputBase-input": { 
                        color: "#FFFFFF",
                        padding: "16px 14px",
                        "&::placeholder": {
                          color: "rgba(176, 190, 197, 0.5)",
                          opacity: 1
                        }
                      },
                    }}
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ 
                      textAlign: "right", 
                      color: "#7C4DFF",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                  >
                    Mot de passe oublié ?
                  </Typography>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? null : <LoginIcon />}
                    sx={{ 
                      mt: 2, 
                      py: 1.8,
                      backgroundColor: "#7C4DFF",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: "0px 4px 10px rgba(124, 77, 255, 0.3)",
                      "&:hover": {
                        backgroundColor: "#6a3de8",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(124, 77, 255, 0.5)",
                        color: "rgba(255, 255, 255, 0.7)"
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body2"
                    color="#B0BEC5"
                    sx={{ mt: 3, textAlign: "center" }}
                  >
                    Vous n'avez pas de compte ?{" "}
                    <Link
                      component={motion.a}
                      whileHover={{ color: "#a17aff" }}
                      href="/register"
                      underline="hover"
                      color="#7C4DFF"
                      sx={{ 
                        fontWeight: "bold",
                        transition: "color 0.3s ease"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/register");
                      }}
                    >
                      Inscrivez-vous !
                    </Link>
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>
          </Container>
        </Grid>

        {/* Partie droite */}
        <Grid
          item
          xs={12}
          md={6}
          component={motion.div}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          sx={{
            background: "linear-gradient(135deg, #7C4DFF 0%, #5e35b1 100%)",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: 2, md: 6 },
            height: "100%",
            textAlign: "center",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(124, 77, 255, 0) 70%)",
              zIndex: 0,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "20%",
              right: "10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
              zIndex: 0,
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  color="#FFFFFF"
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: "1.8rem", md: "3rem" },
                    fontWeight: "bold",
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    mb: 3
                  }}
                >
                  Welcome to the BaseBrain's Portal
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  color="#E0E0E0"
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: "0.9rem", md: "1.2rem" },
                    mb: 6,
                    maxWidth: "80%",
                    mx: "auto",
                    lineHeight: 1.6
                  }}
                >
                  Connectez-vous pour accéder à votre espace personnel et suivre vos performances en temps réel
                </Typography>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
              >
                <Box
                  component={Paper}
                  elevation={10}
                  sx={{ 
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                    transform: "perspective(1000px) rotateY(-5deg)",
                    maxWidth: "90%",
                    mx: "auto",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                      zIndex: 1,
                      pointerEvents: "none"
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="src/assets/telechargement.jpg"
                    alt="Illustration BaseBrain"
                    sx={{ 
                      width: "100%",
                      display: "block",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)"
                      }
                    }}
                  />
                </Box>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 1,
                    duration: 0.5
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 6
                  }}
                >
                  {["Sécurisé", "Rapide", "Intuitif"].map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        fontWeight: "bold",
                        backdropFilter: "blur(10px)",
                        px: 1,
                        "& .MuiChip-label": {
                          px: 2
                        }
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;