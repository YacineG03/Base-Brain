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
  Modal,
  Backdrop,
  Fade,
  MenuItem,
  IconButton,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { getExercises, postSubmission, getExerciseFile } from "../../services/api";

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

const dropzoneVariants = {
  hover: { 
    scale: 1.02,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
    borderColor: "#8b5cf6",
    backgroundColor: "#8b5cf6",
    transition: { duration: 0.3 }
  },
  dragActive: {
    scale: 1.05,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
    borderColor: "#7c3aed",
    backgroundColor: "#7c3aed",
    transition: { duration: 0.3 }
  }
};

function TraiterSujet() {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();

  // Récupérer la liste des exercices
  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setContentLoaded(false);
      try {
        const { data } = await getExercises();
        console.log("Exercices récupérés :", data);
        if (Array.isArray(data) && data.length > 0) {
          setExercises(data);
        } else {
          setError("Aucun exercice disponible pour cet étudiant.");
        }
      } catch (err) {
        console.error("Erreur détaillée :", err);
        setError(
          err.response?.data?.error ||
          "Impossible de charger les exercices. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchExercises();
  }, []);

  // Gestion du dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setError("Veuillez sélectionner un fichier.");
      setFile(null);
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile.type.includes("pdf")) {
      setError("Veuillez sélectionner un fichier PDF uniquement.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  // Filtrer les exercices par recherche
  const filteredExercises = exercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Récupérer le fichier PDF de l'exercice
  const handleViewExerciseFile = async (fileUrl) => {
    setLoadingPdf(true);
    setError("");
    try {
      const fileName = fileUrl.split("/").pop();
      console.log("Tentative de récupération du fichier d'exercice:", fileName);
      const fileBlob = await getExerciseFile(fileName);
      const blobUrl = URL.createObjectURL(fileBlob);
      console.log("URL du blob générée:", blobUrl);
      setSelectedPdfUrl(blobUrl);
    } catch (err) {
      console.error("Erreur lors de la récupération du fichier d'exercice:", err);
      setError("Impossible de charger le fichier PDF de l'exercice : " + err.message);
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

  // Soumettre la soumission
  const handleSubmit = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier avant de soumettre.");
      return;
    }

    if (!selectedExerciseId) {
      setError("Veuillez sélectionner un exercice.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("exercise_id", selectedExerciseId);

    try {
      const response = await postSubmission(formData);
      setSuccess("Soumission envoyée avec succès ! Correction en cours...");
      setFile(null);

      // Faire disparaître le message après 3 secondes et rediriger
      setTimeout(() => {
        setSuccess("");
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Erreur soumission :", err);
      setError(
        err.response?.data?.error || "Erreur lors de la soumission. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedExercise = exercises.find(
    (ex) => ex.id === parseInt(selectedExerciseId)
  );

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
              mt: 4, 
              mb: 4,
              borderRadius: 3, 
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
                  Traiter un sujet
                </Typography>
              </Box>
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
                    icon={<CheckCircleOutlineIcon />}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      bgcolor: "#e6f4ea",
                      color: "#2e7d32",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                      "& .MuiAlert-icon": { color: "#2e7d32" },
                    }}
                    action={
                      <IconButton
                        color="inherit"
                        size="small"
                        onClick={() => setSuccess("")}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {success}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !contentLoaded ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
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
                  key={selectedExerciseId ? "exercise-detail" : "exercise-list"}
                  variants={containerVariants}
                  initial="hidden"
                  animate={contentLoaded ? "visible" : "exit"}
                  exit="exit"
                >
                  {!selectedExerciseId ? (
                    <>
                      <motion.div variants={itemVariants}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 3, 
                            color: "#5b21b6", 
                            fontWeight: "medium",
                            textAlign: "center" 
                          }}
                        >
                          Choisissez un sujet à traiter
                        </Typography>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Box 
                          sx={{ 
                            display: "flex", 
                            alignItems: "center",
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "#f3e8ff",
                            border: "1px solid #e9d5ff"
                          }}
                        >
                          <SearchIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <TextField
                            fullWidth
                            placeholder="Rechercher un exercice..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="standard"
                            InputProps={{
                              disableUnderline: true,
                            }}
                            sx={{
                              "& .MuiInputBase-input": {
                                color: "#5b21b6",
                              }
                            }}
                          />
                        </Box>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Box 
                          sx={{ 
                            borderRadius: 2, 
                            border: "1px solid #e9d5ff",
                            overflow: "hidden",
                            mb: 3,
                            maxHeight: "400px",
                            overflowY: "auto",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
                          }}
                        >
                          {filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise, index) => (
                              <motion.div
                                key={exercise.id}
                                custom={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0,
                                  transition: { delay: 0.05 * index, duration: 0.4 }
                                }}
                                whileHover={{ 
                                  backgroundColor: "#f3e8ff",
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    p: 3, 
                                    borderBottom: "1px solid #e9d5ff",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:last-child": {
                                      borderBottom: "none"
                                    }
                                  }}
                                  onClick={() => {
                                    setContentLoaded(false);
                                    setTimeout(() => {
                                      setSelectedExerciseId(exercise.id.toString());
                                      setContentLoaded(true);
                                    }, 300);
                                  }}
                                >
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          fontWeight: "bold", 
                                          color: "#5b21b6",
                                          mb: 1
                                        }}
                                      >
                                        {exercise.title}
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: "#666",
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis"
                                        }}
                                      >
                                        {exercise.description || "Aucune description disponible."}
                                      </Typography>
                                    </Box>
                                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                      <IconButton 
                                        sx={{ 
                                          color: "#5b21b6",
                                          bgcolor: "#f3e8ff",
                                          "&:hover": {
                                            bgcolor: "#e9d5ff"
                                          }
                                        }}
                                      >
                                        <VisibilityIcon />
                                      </IconButton>
                                    </motion.div>
                                  </Box>
                                </Box>
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
                            }}>
                              <Typography>
                                Aucun exercice ne correspond à votre recherche.
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    </>
                  ) : (
                    <>
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
                                setSelectedExerciseId("");
                                setFile(null);
                                setError("");
                                setContentLoaded(true);
                              }, 300);
                            }}
                            sx={{
                              mb: 3,
                              color: "#5b21b6",
                              borderColor: "#5b21b6",
                              borderRadius: 2,
                              "&:hover": {
                                borderColor: "#7c3aed",
                                backgroundColor: "rgba(124, 58, 237, 0.04)"
                              }
                            }}
                            variant="outlined"
                          >
                            Retour à la liste
                          </Button>
                        </motion.div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
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
                            <DescriptionIcon sx={{ color: "#5b21b6", mr: 1 }} />
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: "bold", 
                                color: "#5b21b6" 
                              }}
                            >
                              {selectedExercise?.title || "Sujet sélectionné"}
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ mb: 2, borderColor: "#d8b4fe" }} />
                          
                          {selectedExercise?.description && (
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                mb: 3,
                                color: "#333",
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#fff",
                                border: "1px solid #e9d5ff"
                              }}
                            >
                              {selectedExercise.description}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <motion.div
                              whileHover="hover"
                              whileTap="tap"
                              variants={buttonVariants}
                            >
                              <Button
                                variant="contained"
                                startIcon={<VisibilityIcon />}
                                onClick={() => {
                                  if (selectedExercise && selectedExercise.content) {
                                    handleViewExerciseFile(selectedExercise.content);
                                  } else {
                                    setError("Aucun fichier PDF associé à cet exercice.");
                                  }
                                }}
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
                                {loadingPdf ? (
                                  <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
                                ) : (
                                  "Voir le sujet complet"
                                )}
                              </Button>
                            </motion.div>
                          </Box>
                        </Box>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 3, 
                            color: "#5b21b6", 
                            fontWeight: "medium",
                            textAlign: "center" 
                          }}
                        >
                          Uploadez votre solution
                        </Typography>
                      </motion.div>

                      <motion.div 
                        variants={itemVariants}
                        whileHover="hover"
                        animate={isDragActive ? "dragActive" : "visible"}
                        variants={dropzoneVariants}
                      >
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: "2px dashed #d8b4fe",
                            borderRadius: 3,
                            p: 5,
                            textAlign: "center",
                            bgcolor: "#e9d5ff",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            mb: 3
                          }}
                        >
                          <input {...getInputProps()} />
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ 
                              scale: isDragActive ? 1.1 : 1,
                              transition: { duration: 0.3 }
                            }}
                          >
                            <CloudUploadIcon 
                              fontSize="large" 
                              sx={{ 
                                color: "#fff", 
                                fontSize: 60,
                                mb: 2
                              }} 
                            />
                          </motion.div>
                          <Typography sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                            {isDragActive 
                              ? "Déposez votre fichier ici..." 
                              : "Glissez & déposez votre fichier PDF ici"}
                          </Typography>
                          <Typography sx={{ color: "#fff", mb: 2 }}>
                            ou
                          </Typography>
                          <motion.div
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                          >
                            <Button 
                              variant="contained" 
                              sx={{ 
                                bgcolor: "#fff", 
                                color: "#5b21b6",
                                "&:hover": {
                                  bgcolor: "#f8f5ff"
                                },
                                borderRadius: 2,
                                px: 3
                              }}
                            >
                              Parcourir les fichiers
                            </Button>
                          </motion.div>
                          
                          {isDragReject && (
                            <Typography sx={{ color: "#fff", mt: 2, fontWeight: "bold" }}>
                              Seuls les fichiers PDF sont acceptés !
                            </Typography>
                          )}
                        </Box>
                      </motion.div>

                      {file && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Box 
                            sx={{ 
                              p: 3, 
                              mb: 3, 
                              borderRadius: 2, 
                              bgcolor: "#f8f5ff",
                              border: "1px solid #e9d5ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <DescriptionIcon sx={{ color: "#5b21b6", mr: 2 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#5b21b6" }}>
                                  {file.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                              </Box>
                            </Box>
                            <Chip 
                              label="Prêt à soumettre" 
                              color="success"
                              icon={<CheckCircleOutlineIcon />}
                            />
                          </Box>
                        </motion.div>
                      )}

                      <motion.div variants={itemVariants}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                          {file && (
                            <motion.div
                              whileHover="hover"
                              whileTap="tap"
                              variants={buttonVariants}
                            >
                              <Button
                                variant="contained"
                                startIcon={<FileUploadIcon />}
                                onClick={handleSubmit}
                                sx={{ 
                                  bgcolor: "#5b21b6", 
                                  "&:hover": { 
                                    bgcolor: "#4c1d95",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                  },
                                  borderRadius: 2,
                                  px: 4,
                                  py: 1.5
                                }}
                                disabled={loading}
                              >
                                {loading ? (
                                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                                ) : (
                                  "Soumettre ma solution"
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </Box>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
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
                Visualisation du sujet
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
}

export default TraiterSujet;