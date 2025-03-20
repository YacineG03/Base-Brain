// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Button,
//   CircularProgress,
//   Modal,
//   Alert,
// } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DescriptionIcon from "@mui/icons-material/Description";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import {
//   getSubmissions,
//   getStudentSubmissionFile,
//   getCorrectionsForExercise,
//   getCorrectionFileForStudent,
// } from "../../services/api";

// const ConsulterCorrection = () => {
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [corrections, setCorrections] = useState([]);
//   const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
//   const [loadingSubmissions, setLoadingSubmissions] = useState(true);
//   const [loadingCorrections, setLoadingCorrections] = useState(false);
//   const [loadingPdf, setLoadingPdf] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const { data } = await getSubmissions();
//         console.log("Soumissions reçues:", data); // Log pour débogage
//         setSubmissions(data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des soumissions :", err);
//         setError("Erreur lors de la récupération des soumissions.");
//       } finally {
//         setLoadingSubmissions(false);
//       }
//     };
//     fetchSubmissions();
//   }, []);

//   useEffect(() => {
//     const fetchCorrections = async () => {
//       if (selectedSubmission) {
//         setLoadingCorrections(true);
//         try {
//           const response = await getCorrectionsForExercise(selectedSubmission.exercise_id);
//           console.log("Corrections reçues:", response.data.corrections); // Log pour débogage
//           setCorrections(response.data.corrections || []);
//         } catch (err) {
//           console.error("Erreur lors de la récupération des corrections :", err);
//           setError("Erreur lors de la récupération des corrections : " + err.message);
//         } finally {
//           setLoadingCorrections(false);
//         }
//       }
//     };
//     fetchCorrections();
//   }, [selectedSubmission]);

//   const handleViewSubmissionFile = async (fileUrl) => {
//     setLoadingPdf(true);
//     setError("");
//     try {
//       const fileName = fileUrl.split("/").pop();
//       console.log("Tentative de récupération du fichier de soumission:", fileName);
//       const fileBlob = await getStudentSubmissionFile(fileName);
//       const blobUrl = URL.createObjectURL(fileBlob);
//       console.log("URL du blob générée:", blobUrl);
//       setSelectedPdfUrl(blobUrl);
//     } catch (err) {
//       console.error("Erreur lors de la récupération du fichier soumis:", err);
//       setError("Impossible de charger le fichier PDF soumis : " + err.message);
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   const handleViewCorrectionFile = async (fileUrl) => {
//     setLoadingPdf(true);
//     setError("");
//     try {
//       const fileName = fileUrl.split("/").pop();
//       console.log("Tentative de récupération du fichier de correction:", fileName);
//       const fileBlob = await getCorrectionFileForStudent(fileName);
//       const blobUrl = URL.createObjectURL(fileBlob);
//       console.log("URL du blob générée:", blobUrl);
//       setSelectedPdfUrl(blobUrl);
//     } catch (err) {
//       console.error("Erreur lors de la récupération du fichier de correction:", err);
//       setError("Impossible de charger le fichier PDF de correction : " + err.message);
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (selectedPdfUrl) {
//       URL.revokeObjectURL(selectedPdfUrl);
//     }
//     setSelectedPdfUrl(null);
//     setLoadingPdf(false);
//     setError("");
//   };

//   if (loadingSubmissions) return <CircularProgress />;

//   return (
//     <Box sx={{ p: 3 }}>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       {selectedSubmission ? (
//         <Box>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => setSelectedSubmission(null)}
//             sx={{
//               mb: 2,
//               bgcolor: "#5b21b6",
//               color: "#fff",
//               "&:hover": { bgcolor: "#44276b" },
//               borderRadius: "8px",
//               padding: "8px 16px",
//             }}
//           >
//             Retour
//           </Button>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <DescriptionIcon sx={{ fontSize: 32, color: "#5b21b6", mr: 1 }} />
//             <Typography variant="h4" fontWeight="bold">
//               Les notes et corrections
//             </Typography>
//           </Box>
//           <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#5b21b6" }}>
//             {selectedSubmission.exercise_title || "Sujet inconnu"}
//           </Typography>
//           <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold", color: "#333" }}>
//             Votre note sur 20 :{" "}
//             <span style={{ color: "#2e7d32" }}>
//               {selectedSubmission.note || "Non évaluée"}
//             </span>
//           </Typography>
//           <Button
//             variant="outlined"
//             startIcon={<VisibilityIcon />}
//             onClick={() => handleViewSubmissionFile(selectedSubmission.file_path)}
//             sx={{ mt: 2, mb: 2, color: "#5b21b6", borderColor: "#5b21b6" }}
//             disabled={loadingPdf}
//           >
//             Voir votre soumission
//           </Button>
//           <Paper
//             sx={{
//               p: 3,
//               mt: 2,
//               borderRadius: "10px",
//               bgcolor: "#f3e8ff",
//               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#5b21b6" }}>
//               Feedback
//             </Typography>
//             <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
//               {selectedSubmission.feedback ? (
//                 selectedSubmission.feedback
//                   .split(".")
//                   .filter((sentence) => sentence.trim().length > 0)
//                   .map((sentence, index) => (
//                     <Box key={index} sx={{ mb: 1 }}>
//                       <Typography
//                         component="span"
//                         sx={{ fontWeight: "bold", color: "#5b21b6" }}
//                       >
//                         {`Question ${index + 1}`}:
//                       </Typography>{" "}
//                       {sentence.trim()}.
//                     </Box>
//                   ))
//               ) : (
//                 "Aucune correction disponible."
//               )}
//             </Typography>
//           </Paper>

//           <Paper
//             sx={{
//               p: 3,
//               mt: 3,
//               borderRadius: "10px",
//               bgcolor: "#f3e8ff",
//               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#5b21b6" }}>
//               Corrections de l'exercice
//             </Typography>
//             {loadingCorrections ? (
//               <CircularProgress />
//             ) : corrections.length > 0 ? (
//               <List>
//                 {corrections.map((correction) => (
//                   <ListItem
//                     key={correction.id}
//                     divider
//                     sx={{
//                       backgroundColor: "#e0d4f7",
//                       borderRadius: "5px",
//                       mb: 1,
//                     }}
//                   >
//                     <ListItemText
//                       primary={correction.title}
//                       secondary={correction.description}
//                     />
//                     {correction.models && correction.models.length > 0 ? (
//                       <Box sx={{ display: "flex", gap: 1 }}>
//                         {correction.models.map((model, index) => (
//                           <Button
//                             key={index}
//                             variant="outlined"
//                             startIcon={<VisibilityIcon />}
//                             onClick={() => handleViewCorrectionFile(model.file_url)}
//                             sx={{ color: "#5b21b6", borderColor: "#5b21b6" }}
//                             disabled={loadingPdf}
//                           >
//                             Fichier {index + 1}
//                           </Button>
//                         ))}
//                       </Box>
//                     ) : (
//                       <Typography sx={{ color: "#666" }}>
//                         Aucun fichier de correction associé.
//                       </Typography>
//                     )}
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography sx={{ color: "#666" }}>
//                 Aucune correction disponible pour cet exercice.
//               </Typography>
//             )}
//           </Paper>
//         </Box>
//       ) : (
//         <Box>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             Liste des exercices traités
//           </Typography>
//           <Paper sx={{ p: 2, borderRadius: "10px" }}>
//             <List>
//               {submissions.length > 0 ? (
//                 submissions.map((submission) => (
//                   <ListItem
//                     key={submission.id}
//                     divider
//                     sx={{
//                       backgroundColor: "#553883",
//                       color: "white",
//                       borderRadius: "5px",
//                       mb: 1,
//                       "&:hover": { backgroundColor: "#44276B" },
//                       cursor: "pointer",
//                     }}
//                     onClick={() => setSelectedSubmission(submission)}
//                   >
//                     <ListItemText
//                       primary={submission.exercise_title || `Soumission #${submission.id}`}
//                     />
//                     <IconButton sx={{ color: "white" }}>
//                       <ArrowForwardIosIcon />
//                     </IconButton>
//                   </ListItem>
//                 ))
//               ) : (
//                 <Typography sx={{ textAlign: "center", color: "#666" }}>
//                   Aucune soumission trouvée.
//                 </Typography>
//               )}
//             </List>
//           </Paper>
//         </Box>
//       )}

//       <Modal
//         open={!!selectedPdfUrl || loadingPdf}
//         onClose={handleCloseModal}
//         disableEnforceFocus
//         aria-labelledby="modal-pdf-title"
//         aria-describedby="modal-pdf-description"
//         sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//       >
//         <Box
//           sx={{
//             position: "relative",
//             width: "80%",
//             height: "80%",
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//             overflow: "auto",
//           }}
//         >
//           <Button onClick={handleCloseModal} sx={{ mb: 2, color: "#5b21b6" }}>
//             Fermer
//           </Button>
//           {loadingPdf ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//               <CircularProgress />
//             </Box>
//           ) : selectedPdfUrl ? (
//             <iframe
//               src={selectedPdfUrl}
//               title="PDF Viewer"
//               style={{ width: "100%", height: "100%", border: "none" }}
//               onError={(e) => {
//                 console.error("Erreur iframe:", e);
//                 setError("Erreur lors du chargement du PDF.");
//                 handleCloseModal();
//               }}
//             />
//           ) : (
//             <Typography>Erreur lors du chargement du PDF.</Typography>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default ConsulterCorrection;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  CircularProgress,
  Modal,
  Alert,
  Container,
  Backdrop,
  Fade,
  Divider,
  Chip,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GradeIcon from "@mui/icons-material/Grade";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  getSubmissions,
  getStudentSubmissionFile,
  getCorrectionsForExercise,
  getCorrectionFileForStudent,
} from "../../services/api";

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
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    backgroundColor: "#44276B",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 * index,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const ConsulterCorrection = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [loadingCorrections, setLoadingCorrections] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setContentLoaded(false);
      try {
        const { data } = await getSubmissions();
        console.log("Soumissions reçues:", data);
        setSubmissions(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des soumissions :", err);
        setError("Erreur lors de la récupération des soumissions.");
      } finally {
        setLoadingSubmissions(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const fetchCorrections = async () => {
      if (selectedSubmission) {
        setLoadingCorrections(true);
        setContentLoaded(false);
        try {
          const response = await getCorrectionsForExercise(selectedSubmission.exercise_id);
          console.log("Corrections reçues:", response.data.corrections);
          setCorrections(response.data.corrections || []);
        } catch (err) {
          console.error("Erreur lors de la récupération des corrections :", err);
          setError("Erreur lors de la récupération des corrections : " + err.message);
        } finally {
          setLoadingCorrections(false);
          setTimeout(() => setContentLoaded(true), 300);
        }
      }
    };
    fetchCorrections();
  }, [selectedSubmission]);

  const handleViewSubmissionFile = async (fileUrl) => {
    setLoadingPdf(true);
    setError("");
    try {
      const fileName = fileUrl.split("/").pop();
      console.log("Tentative de récupération du fichier de soumission:", fileName);
      const fileBlob = await getStudentSubmissionFile(fileName);
      const blobUrl = URL.createObjectURL(fileBlob);
      console.log("URL du blob générée:", blobUrl);
      setSelectedPdfUrl(blobUrl);
    } catch (err) {
      console.error("Erreur lors de la récupération du fichier soumis:", err);
      setError("Impossible de charger le fichier PDF soumis : " + err.message);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleViewCorrectionFile = async (fileUrl) => {
    setLoadingPdf(true);
    setError("");
    try {
      const fileName = fileUrl.split("/").pop();
      console.log("Tentative de récupération du fichier de correction:", fileName);
      const fileBlob = await getCorrectionFileForStudent(fileName);
      const blobUrl = URL.createObjectURL(fileBlob);
      console.log("URL du blob générée:", blobUrl);
      setSelectedPdfUrl(blobUrl);
    } catch (err) {
      console.error("Erreur lors de la récupération du fichier de correction:", err);
      setError("Impossible de charger le fichier PDF de correction : " + err.message);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleCloseModal = () => {
    if (selectedPdfUrl) {
      URL.revokeObjectURL(selectedPdfUrl);
    }
    setSelectedPdfUrl(null);
    setLoadingPdf(false);
    setError("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loadingSubmissions && !contentLoaded) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress sx={{ color: "#5b21b6" }} />
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box
            component={Paper}
            elevation={3}
            sx={{ 
              p: 4, 
              mt: 4, 
              mb: 4,
              borderRadius: 3, 
              bgcolor: "#fff", 
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
              overflow: "hidden"
            }}
          >
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
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                    action={
                      <IconButton
                        color="inherit"
                        size="small"
                        onClick={() => setError("")}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSubmission ? "detail" : "list"}
                variants={containerVariants}
                initial="hidden"
                animate={contentLoaded ? "visible" : "exit"}
                exit="exit"
              >
                {selectedSubmission ? (
                  <Box>
                    <motion.div variants={itemVariants}>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={() => {
                            setContentLoaded(false);
                            setTimeout(() => {
                              setSelectedSubmission(null);
                              setContentLoaded(true);
                            }, 300);
                          }}
                          sx={{
                            mb: 3,
                            bgcolor: "#5b21b6",
                            color: "#fff",
                            "&:hover": { bgcolor: "#44276b" },
                            borderRadius: 2,
                            padding: "10px 20px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          Retour à la liste
                        </Button>
                      </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <DescriptionIcon sx={{ fontSize: 36, color: "#5b21b6", mr: 2 }} />
                        <Typography 
                          variant="h4" 
                          fontWeight="bold"
                          sx={{
                            color: "#5b21b6",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: -8,
                              left: 0,
                              width: "80px",
                              height: "3px",
                              backgroundColor: "#5b21b6",
                              borderRadius: "2px"
                            }
                          }}
                        >
                          Détails de votre évaluation
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div 
                      custom={0}
                      variants={cardVariants}
                    >
                      <Box
                        sx={{
                          p: 3,
                          mb: 4,
                          borderRadius: 3,
                          bgcolor: "#f3e8ff",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #e9d5ff",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <AssignmentIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: "bold", 
                              color: "#5b21b6" 
                            }}
                          >
                            {selectedSubmission.exercise_title || "Sujet inconnu"}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 2, borderColor: "#d8b4fe" }} />
                        
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <GradeIcon sx={{ color: "#5b21b6", mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "medium", color: "#333" }}>
                              Votre note :
                            </Typography>
                          </Box>
                          
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              duration: 0.5,
                              repeat: 2,
                              repeatType: "reverse"
                            }}
                          >
                            {selectedSubmission.note ? (
                              <Chip 
                                icon={<CheckCircleIcon sx={{ color: "#4ade80 !important" }} />}
                                label={`${selectedSubmission.note}/20`} 
                                sx={{ 
                                  bgcolor: "rgba(74, 222, 128, 0.2)",
                                  color: "#166534",
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                  py: 2,
                                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                                }} 
                              />
                            ) : (
                              <Chip 
                                icon={<HourglassEmptyIcon sx={{ color: "#fbbf24 !important" }} />}
                                label="Non évaluée" 
                                sx={{ 
                                  bgcolor: "rgba(251, 191, 36, 0.2)",
                                  color: "#92400e",
                                  fontWeight: "bold",
                                  py: 1.5,
                                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                                }} 
                              />
                            )}
                          </motion.div>
                          
                          {selectedSubmission.submitted_at && (
                            <Chip 
                              label={`Soumis le ${formatDate(selectedSubmission.submitted_at)}`} 
                              size="medium" 
                              sx={{ 
                                bgcolor: "#e9d5ff",
                                color: "#5b21b6",
                                ml: "auto"
                              }} 
                            />
                          )}
                        </Box>
                        
                        <Box sx={{ mt: 3 }}>
                          <motion.div
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                          >
                            <Button
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewSubmissionFile(selectedSubmission.file_path)}
                              sx={{ 
                                color: "#5b21b6", 
                                borderColor: "#5b21b6",
                                "&:hover": { 
                                  borderColor: "#7c3aed",
                                  backgroundColor: "rgba(124, 58, 237, 0.04)"
                                },
                                borderRadius: 2,
                                px: 3
                              }}
                              disabled={loadingPdf}
                            >
                              {loadingPdf ? (
                                <CircularProgress size={24} sx={{ color: "#5b21b6", mr: 1 }} />
                              ) : (
                                "Voir votre soumission"
                              )}
                            </Button>
                          </motion.div>
                        </Box>
                      </Box>
                    </motion.div>

                    {selectedSubmission.feedback && (
                      <motion.div 
                        custom={1}
                        variants={cardVariants}
                      >
                        <Box
                          sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 3,
                            bgcolor: "#fff",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #e9d5ff",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <FeedbackIcon sx={{ color: "#5b21b6", mr: 1 }} />
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: "bold", 
                                color: "#5b21b6",
                                position: "relative",
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  bottom: -4,
                                  left: 0,
                                  width: "40px",
                                  height: "2px",
                                  backgroundColor: "#5b21b6",
                                  borderRadius: "2px"
                                }
                              }}
                            >
                              Feedback du professeur
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            bgcolor: "#f8f5ff",
                            border: "1px solid #e9d5ff"
                          }}>
                            {selectedSubmission.feedback ? (
                              selectedSubmission.feedback
                                .split(".")
                                .filter((sentence) => sentence.trim().length > 0)
                                .map((sentence, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ 
                                      opacity: 1, 
                                      y: 0,
                                      transition: { delay: 0.1 * index, duration: 0.4 }
                                    }}
                                  >
                                    <Box 
                                      sx={{ 
                                        mb: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#fff",
                                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                                        border: "1px solid #e9d5ff"
                                      }}
                                    >
                                      <Typography
                                        component="span"
                                        sx={{ fontWeight: "bold", color: "#5b21b6", display: "block", mb: 1 }}
                                      >
                                        {`Question ${index + 1}`}
                                      </Typography>
                                      <Typography sx={{ color: "#333", lineHeight: 1.6 }}>
                                        {sentence.trim()}.
                                      </Typography>
                                    </Box>
                                  </motion.div>
                                ))
                            ) : (
                              <Typography sx={{ color: "#666", fontStyle: "italic", textAlign: "center" }}>
                                Aucun feedback disponible.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </motion.div>
                    )}

                    <motion.div 
                      custom={2}
                      variants={cardVariants}
                    >
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: "#fff",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #e9d5ff",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                          <DescriptionIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: "bold", 
                              color: "#5b21b6",
                              position: "relative",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -4,
                                left: 0,
                                width: "40px",
                                height: "2px",
                                backgroundColor: "#5b21b6",
                                borderRadius: "2px"
                              }
                            }}
                          >
                            Corrections de l'exercice
                          </Typography>
                        </Box>
                        
                        {loadingCorrections ? (
                          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress sx={{ color: "#5b21b6" }} />
                          </Box>
                        ) : corrections.length > 0 ? (
                          <List sx={{ 
                            p: 0,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e9d5ff",
                          }}>
                            <AnimatePresence>
                              {corrections.map((correction, index) => (
                                <motion.div
                                  key={correction.id}
                                  custom={index}
                                  variants={listItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  <ListItem
                                    divider
                                    sx={{
                                      p: 3,
                                      backgroundColor: index % 2 === 0 ? "#f3e8ff" : "#faf5ff",
                                      borderBottom: "1px solid #e9d5ff",
                                      transition: "all 0.3s ease",
                                      display: "flex",
                                      flexDirection: { xs: "column", md: "row" },
                                      alignItems: { xs: "flex-start", md: "center" },
                                      gap: 2
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography variant="h6" sx={{ color: "#5b21b6", fontWeight: "bold" }}>
                                          {correction.title}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="body1" sx={{ color: "#666", mt: 1 }}>
                                          {correction.description}
                                        </Typography>
                                      }
                                      sx={{ flex: 1 }}
                                    />
                                    
                                    <Box sx={{ 
                                      display: "flex", 
                                      gap: 1,
                                      flexWrap: "wrap",
                                      justifyContent: { xs: "flex-start", md: "flex-end" },
                                      width: { xs: "100%", md: "auto" }
                                    }}>
                                      {correction.models && correction.models.length > 0 ? (
                                        correction.models.map((model, idx) => (
                                          <motion.div
                                            key={idx}
                                            whileHover="hover"
                                            whileTap="tap"
                                            variants={buttonVariants}
                                          >
                                            <Button
                                              variant="contained"
                                              startIcon={<VisibilityIcon />}
                                              onClick={() => handleViewCorrectionFile(model.file_url)}
                                              sx={{ 
                                                bgcolor: "#5b21b6", 
                                                "&:hover": { 
                                                  bgcolor: "#4c1d95",
                                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                                },
                                                borderRadius: 2,
                                                px: 3
                                              }}
                                              disabled={loadingPdf}
                                            >
                                              Correction {idx + 1}
                                            </Button>
                                          </motion.div>
                                        ))
                                      ) : (
                                        <Typography sx={{ color: "#666", fontStyle: "italic" }}>
                                          Aucun fichier de correction associé.
                                        </Typography>
                                      )}
                                    </Box>
                                  </ListItem>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </List>
                        ) : (
                          <Box sx={{ 
                            textAlign: "center", 
                            color: "#666", 
                            py: 6,
                            px: 4,
                            fontStyle: "italic",
                            backgroundColor: "#f8f5ff",
                            borderRadius: 2,
                            border: "1px dashed #d8b4fe"
                          }}>
                            <Typography>
                              Aucune correction disponible pour cet exercice.
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </motion.div>
                  </Box>
                ) : (
                  <Box>
                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <AssignmentIcon sx={{ fontSize: 36, color: "#5b21b6", mr: 2 }} />
                        <Typography 
                          variant="h4" 
                          fontWeight="bold"
                          sx={{
                            color: "#5b21b6",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: -8,
                              left: 0,
                              width: "80px",
                              height: "3px",
                              backgroundColor: "#5b21b6",
                              borderRadius: "2px"
                            }
                          }}
                        >
                          Liste des exercices traités
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Box
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #e9d5ff",
                        }}
                      >
                        <List sx={{ p: 0 }}>
                          {submissions.length > 0 ? (
                            submissions.map((submission, index) => (
                              <motion.div
                                key={submission.id}
                                custom={index}
                                variants={listItemVariants}
                                whileHover="hover"
                              >
                                <ListItem
                                  divider
                                  sx={{
                                    backgroundColor: "#553883",
                                    color: "white",
                                    p: 0,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                    "&:last-child": {
                                      borderBottom: "none"
                                    }
                                  }}
                                  onClick={() => {
                                    setContentLoaded(false);
                                    setTimeout(() => {
                                      setSelectedSubmission(submission);
                                      setContentLoaded(true);
                                    }, 300);
                                  }}
                                >
                                  <Box sx={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    width: "100%",
                                    p: 3
                                  }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <AssignmentIcon sx={{ mr: 2, fontSize: 24 }} />
                                      <Box>
                                        <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                          {submission.exercise_title || `Soumission #${submission.id}`}
                                        </Typography>
                                        {submission.submitted_at && (
                                          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                            Soumis le {formatDate(submission.submitted_at)}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                      {submission.note !== null ? (
                                        <Chip 
                                          label={`${submission.note}/20`} 
                                          sx={{ 
                                            bgcolor: "rgba(255, 255, 255, 0.2)",
                                            color: "white",
                                            fontWeight: "bold"
                                          }} 
                                        />
                                      ) : (
                                        <Chip 
                                          label="Non évalué" 
                                          sx={{ 
                                            bgcolor: "rgba(255, 255, 255, 0.2)",
                                            color: "white",
                                            fontWeight: "bold"
                                          }}
                                        />
                                      )}
                                      <IconButton sx={{ color: "white" }}>
                                        <ArrowForwardIosIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </ListItem>
                              </motion.div>
                            ))
                          ) : (
                            <Box sx={{ 
                              textAlign: "center", 
                              color: "#666", 
                              py: 6,
                              px: 4,
                              fontStyle: "italic",
                              backgroundColor: "#f8f5ff",
                              borderRadius: 2,
                              border: "1px dashed #d8b4fe"
                            }}>
                              <Typography>
                                Aucune soumission trouvée.
                              </Typography>
                            </Box>
                          )}
                        </List>
                      </Box>
                    </motion.div>
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        </motion.div>
      </Container>

      {/* Modal for PDF viewer */}
      <Modal
        open={!!selectedPdfUrl || loadingPdf}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={!!selectedPdfUrl || loadingPdf}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "85%",
              height: "85%",
              bgcolor: "background.paper",
              boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
              p: 4,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #d8b4fe",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#5b21b6", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                <VisibilityIcon sx={{ mr: 1 }} />
                Visualisation du document
              </Typography>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  onClick={handleCloseModal} 
                  variant="outlined"
                  sx={{ 
                    color: "#5b21b6", 
                    borderColor: "#5b21b6",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#7c3aed",
                      backgroundColor: "rgba(124, 58, 237, 0.04)"
                    }
                  }}
                >
                  Fermer
                </Button>
              </motion.div>
            </Box>
            <Box sx={{ 
              flexGrow: 1, 
              borderRadius: 2, 
              overflow: "hidden",
              border: "1px solid #e9d5ff",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)"
            }}>
              {loadingPdf ? (
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "center", 
                  alignItems: "center",
                  height: "100%" 
                }}>
                  <CircularProgress sx={{ color: "#5b21b6", mb: 2 }} />
                  <Typography sx={{ color: "#5b21b6" }}>Chargement du document...</Typography>
                </Box>
              ) : selectedPdfUrl ? (
                <iframe
                  src={selectedPdfUrl}
                  title="PDF Viewer"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  onError={(e) => {
                    console.error("Erreur iframe:", e);
                    setError("Erreur lors du chargement du PDF.");
                    handleCloseModal();
                  }}
                />
              ) : (
                <Typography sx={{ textAlign: "center", color: "#666", py: 4 }}>
                  Erreur lors du chargement du PDF.
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </motion.div>
  );
};

export default ConsulterCorrection;