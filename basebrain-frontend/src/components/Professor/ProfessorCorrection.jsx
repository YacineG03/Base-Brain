// import React, { useCallback, useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import {
//   Container,
//   TextField,
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Alert,
//   CircularProgress,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Modal,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DownloadIcon from "@mui/icons-material/Download";
// import { useNavigate } from "react-router-dom";
// import { getExercisesForProfessor, postCorrection, getCorrectionsByExercise, getSignedFileUrl } from "../../services/api";

// function ProfessorCorrection() {
//   const [exercises, setExercises] = useState([]);
//   const [selectedExerciseId, setSelectedExerciseId] = useState("");
//   const [files, setFiles] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [corrections, setCorrections] = useState([]);
//   const [showCorrections, setShowCorrections] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedPdfUrl, setSelectedPdfUrl] = useState(null); // Changé de blob à URL directe
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExercises = async () => {
//       setLoading(true);
//       try {
//         const { data } = await getExercisesForProfessor();
//         if (Array.isArray(data.exercises) && data.exercises.length > 0) {
//           setExercises(data.exercises);
//         } else {
//           setError("Aucun exercice disponible.");
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération des exercices :", err);
//         setError(`Impossible de charger les exercices (statut: ${err.response?.status}).`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExercises();
//   }, []);

//   const fetchCorrections = async (exerciseId) => {
//     setLoading(true);
//     try {
//       const { data } = await getCorrectionsByExercise(exerciseId);
//       console.log("Réponse API corrections:", data);
//       setCorrections(Array.isArray(data.corrections) ? data.corrections : data);
//     } catch (err) {
//       console.error("Erreur lors de la récupération des corrections :", err);
//       setError(`Erreur lors de la récupération des corrections (statut: ${err.response?.status}).`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     const invalidFiles = acceptedFiles.filter((file) => !file.type.includes("pdf"));
//     if (invalidFiles.length > 0) {
//       setError("Veuillez sélectionner uniquement des fichiers PDF.");
//       return;
//     }

//     if (acceptedFiles.length + files.length > 5) {
//       setError("Vous ne pouvez uploader que 5 fichiers maximum au total.");
//       return;
//     }

//     setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
//     setError("");
//   }, [files]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: { "application/pdf": [".pdf"] },
//     maxFiles: 5,
//   });

//   const removeFile = (fileToRemove) => {
//     setFiles(files.filter((file) => file !== fileToRemove));
//   };

//   const handleSubmit = async () => {
//     if (!selectedExerciseId) {
//       setError("Veuillez sélectionner un exercice.");
//       return;
//     }

//     if (!title || !description) {
//       setError("Le titre et la description sont requis.");
//       return;
//     }

//     if (files.length === 0) {
//       setError("Veuillez uploader au moins un fichier de correction.");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("exercise_id", selectedExerciseId);
//     formData.append("title", title);
//     formData.append("description", description);
//     files.forEach((file) => formData.append("files", file));

//     try {
//       const response = await postCorrection(formData);
//       setSuccess("Correction ajoutée avec succès !");
//       setFiles([]);
//       setTitle("");
//       setDescription("");
//       setTimeout(() => {
//         setSuccess("");
//         fetchCorrections(selectedExerciseId);
//       }, 3000);
//     } catch (err) {
//       console.error("Erreur lors de la soumission :", err);
//       setError(`Erreur lors de l'ajout de la correction (statut: ${err.response?.status}).`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewFile = async (fileUrl) => {
//     try {
//       const fileName = fileUrl.split("/").pop();
//       const { data } = await getSignedFileUrl(fileName);
//       setSelectedPdfUrl(data.signedUrl);
//     } catch (err) {
//       console.error("Erreur lors de la récupération de l’URL signée:", err);
//       setError("Impossible de charger le fichier PDF.");
//     }
//   };

//   const handleDownload = async (fileUrl) => {
//     try {
//       const response = await fetch(fileUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = fileUrl.split("/").pop();
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Erreur lors du téléchargement:", err);
//       setError("Impossible de télécharger le fichier.");
//     }
//   };

//   const handleCloseModal = () => {
//     setSelectedPdfUrl(null);
//   };

//   return (
//     <Container maxWidth="md">
//       <Box
//         component={Paper}
//         elevation={3}
//         sx={{ p: 4, mt: 8, borderRadius: 2, bgcolor: "#fff", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
//       >
//         <Typography variant="h6" gutterBottom align="center">
//           {showCorrections
//             ? "Liste des corrections proposées"
//             : selectedExerciseId
//             ? "Proposer la correction par sujet"
//             : "Liste des sujets"}
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//             <CircularProgress />
//           </Box>
//         ) : showCorrections ? (
//           <Box>
//             <Button
//               variant="outlined"
//               onClick={() => setShowCorrections(false)}
//               sx={{ mb: 2, color: "#5b21b6", borderColor: "#5b21b6" }}
//             >
//               Retour
//             </Button>
//             {corrections.length > 0 ? (
//               <Table sx={{ minWidth: 650 }}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: "bold" }}>Titre</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>Fichiers</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {corrections.map((correction) => (
//                     <TableRow key={correction.id}>
//                       <TableCell>{correction.title || "Non défini"}</TableCell>
//                       <TableCell>{correction.description || "Non défini"}</TableCell>
//                       <TableCell>
//                         {correction.models && correction.models.length > 0 ? (
//                           correction.models.map((model, index) => (
//                             <Box key={index} sx={{ mb: 1 }}>
//                               <Button
//                                 variant="outlined"
//                                 onClick={() => handleViewFile(model.file_url)}
//                                 sx={{ mr: 1, color: "#5b21b6", borderColor: "#5b21b6" }}
//                               >
//                                 Voir Fichier {index + 1}
//                               </Button>
//                             </Box>
//                           ))
//                         ) : (
//                           <Typography>Aucun fichier disponible</Typography>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             ) : (
//               <Typography sx={{ textAlign: "center", color: "#666" }}>
//                 Aucune correction proposée pour cet exercice.
//               </Typography>
//             )}
//           </Box>
//         ) : selectedExerciseId ? (
//           <Box>
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 setSelectedExerciseId("");
//                 setFiles([]);
//                 setTitle("");
//                 setDescription("");
//                 setError("");
//                 setSuccess("");
//               }}
//               sx={{ mb: 2, color: "#5b21b6", borderColor: "#5b21b6" }}
//             >
//               Retour
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 fetchCorrections(selectedExerciseId);
//                 setShowCorrections(true);
//               }}
//               sx={{ mb: 2, ml: 2, bgcolor: "#5b21b6", "&:hover": { bgcolor: "#44276b" } }}
//             >
//               Voir les corrections proposées
//             </Button>
//             <TextField
//               fullWidth
//               label="Titre de la correction"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               fullWidth
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               multiline
//               rows={3}
//               sx={{ mb: 2 }}
//             />
//             <Box
//               {...getRootProps()}
//               sx={{
//                 border: "2px dashed #d8b4fe",
//                 borderRadius: 2,
//                 p: 4,
//                 textAlign: "center",
//                 bgcolor: "#e9d5ff",
//                 cursor: "pointer",
//                 mb: 2,
//               }}
//             >
//               <input {...getInputProps()} />
//               <CloudUploadIcon fontSize="large" sx={{ color: "#fff" }} />
//               <Typography sx={{ color: "#fff", mt: 1 }}>
//                 Drag & Drop un fichier PDF ici
//               </Typography>
//               <Typography sx={{ color: "#fff", fontWeight: "bold", mt: 1 }}>ou</Typography>
//               <Button variant="contained" sx={{ mt: 1, bgcolor: "#5b21b6" }}>
//                 Parcourir
//               </Button>
//             </Box>
//             {files.length > 0 && (
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle1">Fichiers uploadés :</Typography>
//                 <List>
//                   {files.map((file, index) => (
//                     <ListItem key={index}>
//                       <ListItemText primary={file.name} />
//                       <IconButton
//                         onClick={() => removeFile(file)}
//                         sx={{ color: "#d32f2f" }}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//             )}
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               sx={{ bgcolor: "#5b21b6", "&:hover": { bgcolor: "#44276b" } }}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : "Ajouter la correction"}
//             </Button>
//             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//             {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
//           </Box>
//         ) : (
//           <Box>
//             <TextField
//               fullWidth
//               select
//               label="Sélectionner un exercice"
//               value={selectedExerciseId}
//               onChange={(e) => setSelectedExerciseId(e.target.value)}
//               sx={{
//                 mb: 4,
//                 backgroundColor: "#e9d5ff",
//                 borderRadius: 1,
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#a78bfa" },
//                   "&:hover fieldset": { borderColor: "#7c4dff" },
//                   "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
//                 },
//               }}
//               SelectProps={{ native: true }}
//             >
//               <option value="">Sélectionner un exercice</option>
//               {exercises.map((exercise) => (
//                 <option key={exercise.id} value={exercise.id}>
//                   {exercise.title}
//                 </option>
//               ))}
//             </TextField>
//           </Box>
//         )}

//         <Modal
//           open={!!selectedPdfUrl}
//           onClose={handleCloseModal}
//           aria-labelledby="modal-pdf-title"
//           aria-describedby="modal-pdf-description"
//           sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//         >
//           <Box
//             sx={{
//               position: "relative",
//               width: "80%",
//               height: "80%",
//               bgcolor: "background.paper",
//               border: "2px solid #000",
//               boxShadow: 24,
//               p: 4,
//               overflow: "auto",
//             }}
//           >
//             <Button onClick={handleCloseModal} sx={{ mb: 2, color: "#5b21b6" }}>
//               Fermer
//             </Button>
//             {selectedPdfUrl ? (
//               <iframe
//                 src={selectedPdfUrl}
//                 title="PDF Viewer"
//                 style={{ width: "100%", height: "100%", border: "none" }}
//                 onError={(e) => {
//                   console.error("Erreur iframe:", e);
//                   setError("Erreur lors du chargement du PDF.");
//                   handleCloseModal();
//                 }}
//               />
//             ) : (
//               <Typography>Chargement du PDF...</Typography>
//             )}
//           </Box>
//         </Modal>
//       </Box>
//     </Container>
//   );
// }

// export default ProfessorCorrection;

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Container,
  TextField,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { getExercisesForProfessor, postCorrection, getCorrectionsByExercise, getSignedFileUrl } from "../../services/api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
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
    backgroundColor: "#f0ebff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  }
};

const dropzoneVariants = {
  initial: { 
    backgroundColor: "#e9d5ff",
    scale: 1
  },
  hover: { 
    backgroundColor: "#d8b4fe", 
    scale: 1.02,
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3 }
  },
  drop: { 
    backgroundColor: "#c084fc", 
    scale: 1.05,
    transition: { duration: 0.3 }
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

function ProfessorCorrection() {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [corrections, setCorrections] = useState([]);
  const [showCorrections, setShowCorrections] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [dropzoneState, setDropzoneState] = useState("initial");
  const [contentLoaded, setContentLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const { data } = await getExercisesForProfessor();
        if (Array.isArray(data.exercises) && data.exercises.length > 0) {
          setExercises(data.exercises);
        } else {
          setError("Aucun exercice disponible.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des exercices :", err);
        setError(`Impossible de charger les exercices (statut: ${err.response?.status}).`);
      } finally {
        setLoading(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchExercises();
  }, []);

  const fetchCorrections = async (exerciseId) => {
    setContentLoaded(false);
    setLoading(true);
    try {
      const { data } = await getCorrectionsByExercise(exerciseId);
      console.log("Réponse API corrections:", data);
      setCorrections(Array.isArray(data.corrections) ? data.corrections : data);
    } catch (err) {
      console.error("Erreur lors de la récupération des corrections :", err);
      setError(`Erreur lors de la récupération des corrections (statut: ${err.response?.status}).`);
    } finally {
      setLoading(false);
      setTimeout(() => setContentLoaded(true), 300);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setDropzoneState("drop");
    
    const invalidFiles = acceptedFiles.filter((file) => !file.type.includes("pdf"));
    if (invalidFiles.length > 0) {
      setError("Veuillez sélectionner uniquement des fichiers PDF.");
      setTimeout(() => setDropzoneState("initial"), 500);
      return;
    }

    if (acceptedFiles.length + files.length > 5) {
      setError("Vous ne pouvez uploader que 5 fichiers maximum au total.");
      setTimeout(() => setDropzoneState("initial"), 500);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError("");
    
    // Reset dropzone state after animation
    setTimeout(() => setDropzoneState("initial"), 500);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 5,
    onDragEnter: () => setDropzoneState("hover"),
    onDragLeave: () => setDropzoneState("initial")
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedExerciseId) {
      setError("Veuillez sélectionner un exercice.");
      return;
    }

    if (!title || !description) {
      setError("Le titre et la description sont requis.");
      return;
    }

    if (files.length === 0) {
      setError("Veuillez uploader au moins un fichier de correction.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("exercise_id", selectedExerciseId);
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await postCorrection(formData);
      setSuccess("Correction ajoutée avec succès !");
      setFiles([]);
      setTitle("");
      setDescription("");
      setTimeout(() => {
        setSuccess("");
        fetchCorrections(selectedExerciseId);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      setError(`Erreur lors de l'ajout de la correction (statut: ${err.response?.status}).`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async (fileUrl) => {
    try {
      const fileName = fileUrl.split("/").pop();
      const { data } = await getSignedFileUrl(fileName);
      setSelectedPdfUrl(data.signedUrl);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'URL signée:", err);
      setError("Impossible de charger le fichier PDF.");
    }
  };

  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      setError("Impossible de télécharger le fichier.");
    }
  };

  const handleCloseModal = () => {
    setSelectedPdfUrl(null);
  };

  const handleBack = () => {
    setContentLoaded(false);
    setTimeout(() => {
      if (showCorrections) {
        setShowCorrections(false);
      } else {
        setSelectedExerciseId("");
        setFiles([]);
        setTitle("");
        setDescription("");
        setError("");
        setSuccess("");
      }
      setContentLoaded(true);
    }, 300);
  };

  const handleShowCorrections = () => {
    setContentLoaded(false);
    setTimeout(() => {
      fetchCorrections(selectedExerciseId);
      setShowCorrections(true);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md">
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
              mt: 8, 
              borderRadius: 2, 
              bgcolor: "#fff", 
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
              overflow: "hidden"
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                align="center"
                sx={{
                  position: "relative",
                  mb: 4,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "3px",
                    backgroundColor: "#5b21b6",
                    borderRadius: "2px"
                  }
                }}
              >
                {showCorrections
                  ? "Liste des corrections proposées"
                  : selectedExerciseId
                  ? "Proposer la correction par sujet"
                  : "Liste des sujets"}
              </Typography>
            </motion.div>

            {loading && !contentLoaded ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CircularProgress sx={{ color: "#5b21b6" }} />
                </motion.div>
              </Box>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${showCorrections}-${selectedExerciseId}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate={contentLoaded ? "visible" : "exit"}
                  exit="exit"
                >
                  {showCorrections ? (
                    <Box>
                      <motion.div variants={itemVariants}>
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ 
                              mb: 3, 
                              color: "#5b21b6", 
                              borderColor: "#5b21b6",
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              "&:hover": {
                                borderColor: "#7c3aed",
                                backgroundColor: "rgba(124, 58, 237, 0.04)"
                              }
                            }}
                            startIcon={<ArrowBackIcon />}
                          >
                            Retour
                          </Button>
                        </motion.div>
                      </motion.div>
                      
                      {corrections.length > 0 ? (
                        <motion.div 
                          variants={itemVariants}
                          sx={{ 
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)"
                          }}
                        >
                          <Box sx={{ 
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e9d5ff",
                            mb: 2
                          }}>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f3e8ff" }}>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Titre</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Description</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Fichiers</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {corrections.map((correction, index) => (
                                  <motion.tr
                                    key={correction.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ 
                                      opacity: 1, 
                                      y: 0,
                                      transition: { delay: 0.1 * index, duration: 0.4 }
                                    }}
                                    component={TableRow}
                                    sx={{ 
                                      "&:nth-of-type(odd)": { backgroundColor: "#faf5ff" },
                                      "&:hover": { backgroundColor: "#f3e8ff" },
                                      transition: "background-color 0.3s"
                                    }}
                                  >
                                    <TableCell sx={{ py: 2 }}>{correction.title || "Non défini"}</TableCell>
                                    <TableCell sx={{ py: 2 }}>{correction.description || "Non défini"}</TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                      {correction.models && correction.models.length > 0 ? (
                                        correction.models.map((model, idx) => (
                                          <Box key={idx} sx={{ mb: 1 }}>
                                            <motion.div
                                              whileHover="hover"
                                              whileTap="tap"
                                              variants={buttonVariants}
                                            >
                                              <Button
                                                variant="outlined"
                                                onClick={() => handleViewFile(model.file_url)}
                                                sx={{ 
                                                  mr: 1, 
                                                  color: "#5b21b6", 
                                                  borderColor: "#5b21b6",
                                                  borderRadius: 2,
                                                  "&:hover": {
                                                    borderColor: "#7c3aed",
                                                    backgroundColor: "rgba(124, 58, 237, 0.04)"
                                                  }
                                                }}
                                                startIcon={<VisibilityIcon />}
                                              >
                                                Fichier {idx + 1}
                                              </Button>
                                            </motion.div>
                                          </Box>
                                        ))
                                      ) : (
                                        <Typography sx={{ fontStyle: "italic", color: "#666" }}>
                                          Aucun fichier disponible
                                        </Typography>
                                      )}
                                    </TableCell>
                                  </motion.tr>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </motion.div>
                      ) : (
                        <motion.div variants={itemVariants}>
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
                              Aucune correction proposée pour cet exercice.
                            </Typography>
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  ) : selectedExerciseId ? (
                    <Box>
                      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                        <motion.div 
                          variants={itemVariants}
                          whileHover="hover"
                          whileTap="tap"
                          custom={buttonVariants}
                        >
                          <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ 
                              color: "#5b21b6", 
                              borderColor: "#5b21b6",
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              "&:hover": {
                                borderColor: "#7c3aed",
                                backgroundColor: "rgba(124, 58, 237, 0.04)"
                              }
                            }}
                            startIcon={<ArrowBackIcon />}
                          >
                            Retour
                          </Button>
                        </motion.div>
                        
                        <motion.div 
                          variants={itemVariants}
                          whileHover="hover"
                          whileTap="tap"
                          custom={buttonVariants}
                        >
                          <Button
                            variant="contained"
                            onClick={handleShowCorrections}
                            sx={{ 
                              bgcolor: "#5b21b6", 
                              "&:hover": { 
                                bgcolor: "#4c1d95",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                              },
                              borderRadius: 2,
                              px: 3,
                              py: 1
                            }}
                            startIcon={<ListAltIcon />}
                          >
                            Voir les corrections proposées
                          </Button>
                        </motion.div>
                      </Box>
                      
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Titre de la correction"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          sx={{ 
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: "#8b5cf6",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#5b21b6",
                              },
                            },
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)"
                            }
                          }}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          multiline
                          rows={3}
                          sx={{ 
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: "#8b5cf6",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#5b21b6",
                              },
                            },
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)"
                            }
                          }}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <motion.div
                          variants={dropzoneVariants}
                          initial="initial"
                          animate={dropzoneState}
                          whileHover="hover"
                        >
                          <Box
                            {...getRootProps()}
                            sx={{
                              border: "2px dashed #d8b4fe",
                              borderRadius: 2,
                              p: 4,
                              textAlign: "center",
                              cursor: "pointer",
                              mb: 3,
                              transition: "all 0.3s ease",
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                                zIndex: 0
                              }
                            }}
                          >
                            <input {...getInputProps()} />
                            <motion.div
                              animate={{ 
                                y: [0, -5, 0],
                                transition: { 
                                  repeat: Infinity, 
                                  duration: 2,
                                  ease: "easeInOut"
                                }
                              }}
                            >
                              <CloudUploadIcon fontSize="large" sx={{ color: "#fff", position: "relative", zIndex: 1 }} />
                            </motion.div>
                            <Typography sx={{ color: "#fff", mt: 1, position: "relative", zIndex: 1 }}>
                              Drag & Drop un fichier PDF ici
                            </Typography>
                            <Typography sx={{ color: "#fff", fontWeight: "bold", mt: 1, position: "relative", zIndex: 1 }}>ou</Typography>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="contained" 
                                sx={{ 
                                  mt: 1, 
                                  bgcolor: "#5b21b6", 
                                  position: "relative", 
                                  zIndex: 1,
                                  "&:hover": { 
                                    bgcolor: "#4c1d95",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                  }
                                }}
                              >
                                Parcourir
                              </Button>
                            </motion.div>
                          </Box>
                        </motion.div>
                      </motion.div>
                      
                      <AnimatePresence>
                        {files.length > 0 && (
                          <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Box sx={{ 
                              mb: 3, 
                              p: 3, 
                              borderRadius: 2, 
                              bgcolor: "#f3e8ff",
                              border: "1px solid #d8b4fe"
                            }}>
                              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "#5b21b6" }}>
                                Fichiers uploadés :
                              </Typography>
                              <List>
                                <AnimatePresence>
                                  {files.map((file, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ 
                                        opacity: 1, 
                                        x: 0,
                                        transition: { delay: 0.05 * index, duration: 0.3 }
                                      }}
                                      exit={{ opacity: 0, x: -20 }}
                                    >
                                      <ListItem
                                        sx={{
                                          mb: 1,
                                          borderRadius: 2,
                                          backgroundColor: "#fff",
                                          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            backgroundColor: "#faf5ff",
                                            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                                          }
                                        }}
                                      >
                                        <ListItemText 
                                          primary={file.name} 
                                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                        />
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <IconButton
                                            onClick={() => removeFile(file)}
                                            sx={{ 
                                              color: "#d32f2f",
                                              "&:hover": {
                                                backgroundColor: "rgba(211, 47, 47, 0.04)"
                                              }
                                            }}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </motion.div>
                                      </ListItem>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </List>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <motion.div 
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        custom={buttonVariants}
                      >
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          fullWidth
                          sx={{ 
                            bgcolor: "#5b21b6", 
                            "&:hover": { 
                              bgcolor: "#4c1d95",
                              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)"
                            },
                            py: 1.5,
                            fontSize: "1.05rem",
                            borderRadius: 2,
                            transition: "all 0.3s ease"
                          }}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Ajouter la correction"}
                        </Button>
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
                                mt: 3,
                                borderRadius: 2,
                                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
                              }}
                            >
                              {error}
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Alert 
                              severity="success" 
                              sx={{ 
                                mt: 3,
                                borderRadius: 2,
                                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
                              }}
                            >
                              {success}
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  ) : (
                    <Box>
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          select
                          label="Sélectionner un exercice"
                          value={selectedExerciseId}
                          onChange={(e) => setSelectedExerciseId(e.target.value)}
                          sx={{
                            mb: 4,
                            backgroundColor: "#f3e8ff",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#d8b4fe" },
                              "&:hover fieldset": { borderColor: "#a78bfa" },
                              "&.Mui-focused fieldset": { borderColor: "#7c3aed" },
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "translateY(-2px)"
                              }
                            },
                          }}
                          SelectProps={{ 
                            native: true,
                          }}
                        >
                          <option value="">Sélectionner un exercice</option>
                          {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                              {exercise.title}
                            </option>
                          ))}
                        </TextField>
                      </motion.div>
                      
                      {exercises.length === 0 && !loading && (
                        <motion.div variants={itemVariants}>
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
                              Aucun exercice disponible. Veuillez d'abord créer un exercice.
                            </Typography>
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </motion.div>

        {/* Modal pour afficher les détails du PDF */}
        <Modal
          open={!!selectedPdfUrl}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={!!selectedPdfUrl}>
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
                <Typography variant="h6" sx={{ color: "#5b21b6", fontWeight: "bold" }}>
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
                {selectedPdfUrl ? (
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
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    height: "100%" 
                  }}>
                    <CircularProgress sx={{ color: "#5b21b6" }} />
                    <Typography sx={{ ml: 2 }}>Chargement du PDF...</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </motion.div>
  );
}

export default ProfessorCorrection;