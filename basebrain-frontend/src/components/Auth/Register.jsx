// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../../services/api";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   Link,
//   MenuItem,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import PhoneIcon from "@mui/icons-material/Phone";
// import EmailIcon from "@mui/icons-material/Email";
// import LockIcon from "@mui/icons-material/Lock";

// function Register() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "student",
//     nom: "",
//     prenom: "",
//     telephone: "",
//     sexe: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await register(formData);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.user.role);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.error || "Erreur d’inscription");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         width: "100vw",
//         margin: 0,
//         padding: 0,
//         position: "absolute",
//         top: 0,
//         left: 0,
//         overflow: "hidden",
//       }}
//     >
//       <Grid
//         container
//         sx={{
//           height: "100%",
//           width: "100%",
//           margin: 0,
//           padding: 0,
//         }}
//       >
//         {/* Section gauche : Formulaire d'inscription */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             backgroundColor: "#1C2526",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: { xs: 2, md: 4 },
//             height: "100%",
//             boxSizing: "border-box",
//           }}
//         >
//           <Typography
//             variant="h2"
//             color="#FFFFFF"
//             gutterBottom
//             sx={{ textAlign: "center", fontSize: { xs: "1.5rem", md: "2rem" } }}
//           >
//             Inscription
//           </Typography>
//           <Typography
//             variant="body1"
//             color="#B0BEC5"
//             gutterBottom
//             sx={{ textAlign: "center", fontSize: { xs: "0.875rem", md: "1rem" } }}
//           >
//             Entrez vos identifiants
//           </Typography>
//           {error && (
//             <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
//               {error}
//             </Typography>
//           )}
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{
//               width: "100%",
//               maxWidth: 400,
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//             }}
//           >
//             <TextField
//               fullWidth
//               label="Prénom *"
//               variant="outlined"
//               name="prenom"
//               value={formData.prenom}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <PersonIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             />
//             <TextField
//               fullWidth
//               label="Nom *"
//               variant="outlined"
//               name="nom"
//               value={formData.nom}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <PersonIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             />
//             <TextField
//               fullWidth
//               label="Téléphone"
//               variant="outlined"
//               name="telephone"
//               value={formData.telephone}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <PhoneIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//             />
//             <TextField
//               fullWidth
//               label="Email *"
//               variant="outlined"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <EmailIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             />
//             <TextField
//               fullWidth
//               label="Mot de passe *"
//               variant="outlined"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <LockIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             />
//             <TextField
//               fullWidth
//               label="Confirmer le mot de passe *"
//               variant="outlined"
//               type="password"
//               InputProps={{
//                 startAdornment: <LockIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             />
//             <TextField
//               fullWidth
//               select
//               label="Sexe *"
//               name="sexe"
//               value={formData.sexe}
//               onChange={handleChange}
//               InputProps={{
//                 startAdornment: <PersonIcon sx={{ color: "#B0BEC5", mr: 1 }} />,
//               }}
//               InputLabelProps={{ style: { color: "#B0BEC5" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#4A4A4A" },
//                   "&:hover fieldset": { borderColor: "#7C4DFF" },
//                   "&.Mui-focused fieldset": { borderColor: "#7C4DFF" },
//                   backgroundColor: "#2C2F33",
//                 },
//                 "& .MuiInputBase-input": { color: "#FFFFFF" },
//               }}
//               required
//             >
//               <MenuItem value="">Sélectionner</MenuItem>
//               <MenuItem value="M">Masculin</MenuItem>
//               <MenuItem value="F">Féminin</MenuItem>
//             </TextField>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2, py: 1.5, backgroundColor: "#7C4DFF" }}
//             >
//               Connexion
//             </Button>
//             <Typography
//               variant="body2"
//               color="#B0BEC5"
//               sx={{ mt: 2, textAlign: "center" }}
//             >
//               Vous avez déjà un compte ?{" "}
//               <Link
//                 href="/login"
//                 underline="hover"
//                 color="#7C4DFF"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   navigate("/login");
//                 }}
//               >
//                 Connectez-vous !
//               </Link>
//             </Typography>
//           </Box>
//         </Grid>

//         {/* Section droite : Illustration et slogan */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             backgroundColor: "#7C4DFF",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: { xs: 2, md: 4 },
//             height: "100%",
//             textAlign: "center",
//             boxSizing: "border-box",
//           }}
//         >
//           <Typography
//             variant="h1"
//             color="#FFFFFF"
//             gutterBottom
//             sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" } }}
//           >
//             Welcome to the BaseBrain's Portal
//           </Typography>
//           <Typography
//             variant="body1"
//             color="#E0E0E0"
//             gutterBottom
//             sx={{ fontSize: { xs: "0.75rem", md: "1rem" } }}
//           >
//             Inscrivez-vous pour accéder à votre espace personnel
//           </Typography>
//           <Box
//             component="img"
//             src="https://via.placeholder.com/400x300" // Remplace par ton illustration
//             alt="Illustration BaseBrain"
//             sx={{ maxWidth: "100%", mt: 2 }}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// export default Register;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WcIcon from "@mui/icons-material/Wc";
import BrainIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    nom: "",
    prenom: "",
    telephone: "",
    sexe: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = ['Informations personnelles', 'Identifiants'];

  useEffect(() => {
    // Set animation complete after initial render
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateStep = () => {
    if (activeStep === 0) {
      if (!formData.prenom.trim()) {
        setError("Le prénom est requis");
        return false;
      }
      if (!formData.nom.trim()) {
        setError("Le nom est requis");
        return false;
      }
      if (!formData.sexe) {
        setError("Le sexe est requis");
        return false;
      }
      return true;
    } else if (activeStep === 1) {
      if (!formData.email.trim()) {
        setError("L'email est requis");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Format d'email invalide");
        return false;
      }
      if (!formData.password) {
        setError("Le mot de passe est requis");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return false;
      }
      return true;
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError("");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...dataToSend } = formData;
      
      const { data } = await register(dataToSend);
      
      setCompleted(true);
      
      // Store token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      
      // Add a small delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription. Veuillez réessayer.");
      console.error("Erreur lors de l'inscription :", err.response?.data);
      setLoading(false);
    }
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
                  Inscription
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
                  Créez votre compte en quelques étapes
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel
                  sx={{ 
                    mb: 4,
                    "& .MuiStepLabel-root .Mui-completed": {
                      color: "#7C4DFF"
                    },
                    "& .MuiStepLabel-root .Mui-active": {
                      color: "#7C4DFF"
                    },
                    "& .MuiStepLabel-label": {
                      color: "#B0BEC5"
                    },
                    "& .MuiStepLabel-label.Mui-active": {
                      color: "#FFFFFF",
                      fontWeight: "bold"
                    },
                    "& .MuiStepLabel-label.Mui-completed": {
                      color: "#FFFFFF"
                    },
                    "& .MuiStepConnector-line": {
                      borderColor: "rgba(176, 190, 197, 0.3)"
                    }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
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
                <AnimatePresence mode="wait">
                  {completed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem"
                      }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          fontSize: 80, 
                          color: "#4CAF50",
                          mb: 2
                        }} 
                      />
                      <Typography
                        variant="h5"
                        color="#FFFFFF"
                        sx={{ 
                          textAlign: "center", 
                          mb: 2,
                          fontWeight: "bold"
                        }}
                      >
                        Inscription réussie !
                      </Typography>
                      <Typography
                        variant="body1"
                        color="#B0BEC5"
                        sx={{ 
                          textAlign: "center", 
                          mb: 4
                        }}
                      >
                        Vous allez être redirigé vers votre tableau de bord...
                      </Typography>
                      <CircularProgress size={30} sx={{ color: "#7C4DFF" }} />
                    </motion.div>
                  ) : activeStep === 0 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Prénom"
                          variant="outlined"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: "#7C4DFF" }} />
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
                          placeholder="Entrez votre prénom"
                        />
                      </motion.div>

                      <Box sx={{ height: 20 }} />

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Nom"
                          variant="outlined"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: "#7C4DFF" }} />
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
                          placeholder="Entrez votre nom"
                        />
                      </motion.div>

                      <Box sx={{ height: 20 }} />

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Téléphone"
                          variant="outlined"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: "#7C4DFF" }} />
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
                          placeholder="Entrez votre numéro de téléphone"
                        />
                      </motion.div>

                      <Box sx={{ height: 20 }} />

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          select
                          label="Sexe"
                          name="sexe"
                          value={formData.sexe}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WcIcon sx={{ color: "#7C4DFF" }} />
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
                            },
                            "& .MuiMenuItem-root": {
                              color: "#333"
                            }
                          }}
                          required
                        >
                          <MenuItem value="">Sélectionner</MenuItem>
                          <MenuItem value="M">Masculin</MenuItem>
                          <MenuItem value="F">Féminin</MenuItem>
                        </TextField>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Email"
                          variant="outlined"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
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

                      <Box sx={{ height: 20 }} />

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Mot de passe"
                          variant="outlined"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
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
                          placeholder="Créez votre mot de passe"
                        />
                      </motion.div>

                      <Box sx={{ height: 20 }} />

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Confirmer le mot de passe"
                          variant="outlined"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
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
                                  onClick={handleClickShowConfirmPassword}
                                  edge="end"
                                  sx={{ color: "#B0BEC5" }}
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                          placeholder="Confirmez votre mot de passe"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  {activeStep > 0 && !completed && (
                    <motion.div 
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                          color: "#7C4DFF",
                          borderColor: "#7C4DFF",
                          borderRadius: "12px",
                          px: 3,
                          py: 1.2,
                          "&:hover": {
                            borderColor: "#6a3de8",
                            backgroundColor: "rgba(124, 77, 255, 0.04)"
                          }
                        }}
                        variant="outlined"
                      >
                        Retour
                      </Button>
                    </motion.div>
                  )}
                  
                  <Box sx={{ flex: 1 }} />
                  
                  {activeStep < steps.length - 1 && !completed ? (
                    <motion.div 
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          backgroundColor: "#7C4DFF",
                          borderRadius: "12px",
                          px: 3,
                          py: 1.2,
                          color: "#fff",
                          fontWeight: "bold",
                          textTransform: "none",
                          boxShadow: "0px 4px 10px rgba(124, 77, 255, 0.3)",
                          "&:hover": {
                            backgroundColor: "#6a3de8",
                          }
                        }}
                        variant="contained"
                      >
                        Suivant
                      </Button>
                    </motion.div>
                  ) : !completed && (
                    <motion.div 
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? null : <HowToRegIcon />}
                        onClick={handleSubmit}
                        sx={{ 
                          backgroundColor: "#7C4DFF",
                          borderRadius: "12px",
                          px: 3,
                          py: 1.2,
                          color: "#fff",
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
                          "S'inscrire"
                        )}
                      </Button>
                    </motion.div>
                  )}
                </Box>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="body2"
                    color="#B0BEC5"
                    sx={{ mt: 4, textAlign: "center" }}
                  >
                    Vous avez déjà un compte ?{" "}
                    <Link
                      component={motion.a}
                      whileHover={{ color: "#a17aff" }}
                      href="/login"
                      underline="hover"
                      color="#7C4DFF"
                      sx={{ 
                        fontWeight: "bold",
                        transition: "color 0.3s ease"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                      }}
                    >
                      Connectez-vous !
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
                  Inscrivez-vous pour accéder à votre espace personnel et suivre vos performances en temps réel
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
                    src="https://via.placeholder.com/400x300"
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
                  {["Sécurisé", "Personnalisé", "Intuitif"].map((feature, index) => (
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

export default Register;