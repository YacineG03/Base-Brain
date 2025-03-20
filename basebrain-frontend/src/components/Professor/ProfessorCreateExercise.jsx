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
    Modal,
    Backdrop,
    Fade,
  } from "@mui/material";
  import { motion, AnimatePresence } from "framer-motion"; // Add AnimatePresence
  import CloudUploadIcon from "@mui/icons-material/CloudUpload";
  import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
  import CloseIcon from "@mui/icons-material/Close";
  import { useNavigate } from "react-router-dom";
  import { createExercise, getExercisesForProfessor, getSignedExerciseFileUrlProfessor} from "../../services/api";

  // Animation variants
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * index,
        duration: 0.5,
        ease: "easeOut"
      }
    })
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
      backgroundColor: "#44276b",
      transition: { duration: 0.2 }
    }
  };

  const dropzoneVariants = {
    initial: { 
      backgroundColor: "#c4a7e7",
      scale: 1
    },
    hover: { 
      backgroundColor: "#a78bcc", 
      scale: 1.02,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    },
    drop: { 
      backgroundColor: "#8b5cf6", 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const alertVariants = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { 
      opacity: 1, 
      y: 0, 
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  function ProfessorCreateExercise() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [textContent, setTextContent] = useState("");
    const [deadline, setDeadline] = useState("");
    const [file, setFile] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [signedUrl, setSignedUrl] = useState("");
    const [dropzoneState, setDropzoneState] = useState("initial"); // For dropzone animation
    const navigate = useNavigate();

    // Récupérer la liste des exercices du professeur au montage
    const fetchExercises = async () => {
      setLoading(true);
      try {
        console.log("Appel à getExercisesForProfessor pour /professor/exercises");
        const { data } = await getExercisesForProfessor();
        if (Array.isArray(data.exercises) && data.exercises.length > 0) {
          setExercises(data.exercises);
        } else {
          setError("Aucun exercice disponible.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des exercices :", err);
        setError(
          err.response?.data?.error ||
          `Accès interdit ou erreur serveur (statut: ${err.response?.status}). Vérifiez que vous êtes connecté en tant que professeur.`
        );
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchExercises();
    }, []);

    // Gestion du dropzone
    const onDrop = useCallback((acceptedFiles) => {
      setDropzoneState("drop");
      
      if (acceptedFiles.length > 1) {
        setError("Veuillez sélectionner un seul fichier.");
        return;
      }

      const invalidFiles = acceptedFiles.filter(
        (file) => !file.type.includes("pdf") && !file.type.includes("docx")
      );
      if (invalidFiles.length > 0) {
        setError("Veuillez sélectionner uniquement des fichiers PDF ou DOCX.");
        return;
      }

      setFile(acceptedFiles[0]);
      console.log("Fichier sélectionné :", acceptedFiles[0]);
      setError("");
      
      // Reset dropzone state after animation
      setTimeout(() => {
        setDropzoneState("initial");
      }, 500);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      },
      maxFiles: 1,
      onDragEnter: () => setDropzoneState("hover"),
      onDragLeave: () => setDropzoneState("initial")
    });

    // Soumettre l'exercice
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   if (!title || !description) {
    //     setError("Titre et description sont requis.");
    //     return;
    //   }

    //   if (!file && !textContent) {
    //     setError("Un fichier ou un contenu texte est requis.");
    //     return;
    //   }

    //   setLoading(true);
    //   const formData = new FormData();
    //   formData.append("title", title);
    //   formData.append("description", description);
    //   if (file) formData.append("file", file);
    //   if (textContent) formData.append("textContent", textContent);

    //   // Log pour débogage
    //   for (let pair of formData.entries()) {
    //     console.log("FormData entry:", pair[0], pair[1]);
    //   }

    //   try {
    //     console.log("Appel à createExercise pour /professor/exercises");
    //     const response = await createExercise(formData);
    //     setSuccess("Exercice créé avec succès !");
    //     setTitle("");
    //     setDescription("");
    //     setTextContent("");
    //     setDeadline("");
    //     setFile(null);
    //     setTimeout(() => {
    //       setSuccess("");
    //       fetchExercises(); // Rafraîchir la liste des exercices
    //     }, 3000);
    //   } catch (err) {
    //     console.error("Erreur lors de la création de l'exercice :", err.response?.data || err);
    //     setError(
    //       err.response?.data?.error ||
    //       `Erreur lors de la création de l'exercice (statut: ${err.response?.status}). Vérifiez votre accès.`
    //     );
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title || !description) {
        setError("Titre et description sont requis.");
        return;
      }
    
      if (!deadline) {
        setError("La date limite est requise.");
        return;
      }
    
      if (!file && !textContent) {
        setError("Un fichier ou un contenu texte est requis.");
        return;
      }
    
      setLoading(true);
      const formData = new FormData();
      formData.append("title", String(title || ""));
      formData.append("description", String(description || ""));
      formData.append("deadline", String(deadline || ""));
      if (file) formData.append("file", file);
      if (textContent) formData.append("textContent", String(textContent || ""));
    
      // Log pour débogage
      for (let pair of formData.entries()) {
        console.log("FormData entry:", pair[0], pair[1]);
      }
    
      try {
        console.log("Appel à createExercise pour /professor/exercises");
        const response = await createExercise(formData);
        setSuccess("Exercice créé avec succès !");
        setTitle("");
        setDescription("");
        setTextContent("");
        setDeadline("");
        setFile(null);
        setTimeout(() => {
          setSuccess("");
          fetchExercises(); // Rafraîchir la liste des exercices
        }, 3000);
      } catch (err) {
        console.error("Erreur lors de la création de l'exercice :", err.response?.data || err);
        setError(
          err.response?.data?.error ||
          `Erreur lors de la création de l'exercice (statut: ${err.response?.status}). Vérifiez votre accès.`
        );
      } finally {
        setLoading(false);
      }
    };

    // Gérer l'ouverture du modal et récupérer l'URL signée si un fichier est présent
    const handleOpenModal = async (exercise) => {
      setSelectedExercise(exercise);
      setSignedUrl(""); // Réinitialiser l'URL signée

      // Si l'exercice a un fichier (content commence par une URL MinIO), récupérer l'URL signée
      if (exercise.content && exercise.content.includes("/exercises/")) {
        try {
          const fileName = exercise.content.split("/exercises/")[1]; // Extraire le nom du fichier
          const { data } = await getSignedExerciseFileUrlProfessor(fileName); // Appeler l'API pour obtenir l'URL signée
          setSignedUrl(data.signedUrl);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'URL signée :", err);
          setError("Impossible de charger le fichier de l'exercice.");
        }
      }

      setOpenModal(true);
    };

    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedExercise(null);
      setSignedUrl("");
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
                overflow: "hidden",
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
                  Dépôt d'un sujet
                </Typography>
              </motion.div>

              {loading && !exercises.length ? (
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
                <>
                  <form onSubmit={handleSubmit}>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        mb: 4,
                        mt: 4,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#f8f5ff",
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
                      }}
                    >
                      <motion.div custom={0} variants={formItemVariants} initial="hidden" animate="visible">
                        <TextField
                          fullWidth
                          label="Nom"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          sx={{ 
                            backgroundColor: "#e9d5ff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
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
                      
                      <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible">
                        <TextField
                          fullWidth
                          label="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          multiline
                          rows={3}
                          sx={{ 
                            backgroundColor: "#e9d5ff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
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
                      
                      <motion.div custom={2} variants={formItemVariants} initial="hidden" animate="visible">
                        <TextField
                          fullWidth
                          label="Date limite"
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ 
                            backgroundColor: "#e9d5ff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
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
                      
                      <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible">
                        <TextField
                          fullWidth
                          label="Contenu texte (facultatif)"
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          multiline
                          rows={3}
                          sx={{ 
                            backgroundColor: "#e9d5ff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
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
                    </Box>

                    <motion.div 
                      custom={4} 
                      variants={formItemVariants} 
                      initial="hidden" 
                      animate="visible"
                    >
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
                            mb: 2,
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
                            Drag & Drop files here
                          </Typography>
                          <Typography sx={{ color: "#fff", fontWeight: "bold", mt: 1, position: "relative", zIndex: 1 }}>or</Typography>
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
                              Browse file
                            </Button>
                          </motion.div>
                        </Box>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence>
                      {file && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box sx={{ 
                            mb: 2, 
                            p: 2, 
                            borderRadius: 1, 
                            bgcolor: "#f3e8ff",
                            border: "1px solid #d8b4fe"
                          }}>
                            <Typography variant="subtitle1">
                              Fichier sélectionné : <strong>{file.name}</strong>
                            </Typography>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div 
                      custom={5} 
                      variants={formItemVariants} 
                      initial="hidden" 
                      animate="visible"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ 
                          bgcolor: "#5b21b6", 
                          "&:hover": { 
                            bgcolor: "#4c1d95",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)"
                          },
                          py: 1.5,
                          fontSize: "1.05rem",
                          transition: "all 0.3s ease"
                        }}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Créer le sujet"}
                      </Button>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          variants={alertVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Alert 
                            severity="error" 
                            sx={{ 
                              mt: 2,
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
                          variants={alertVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Alert 
                            severity="success" 
                            sx={{ 
                              mt: 2,
                              borderRadius: 2,
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
                            }}
                          >
                            {success}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Box sx={{ mt: 5, mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -4,
                            left: 0,
                            width: "100%",
                            height: "2px",
                            backgroundColor: "#5b21b6",
                            borderRadius: "2px"
                          }
                        }}
                      >
                        Liste des sujets existants
                      </Typography>
                      
                      {loading && exercises.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                          <CircularProgress sx={{ color: "#5b21b6" }} />
                        </Box>
                      ) : (
                        <List sx={{ mt: 2 }}>
                          <AnimatePresence>
                            {exercises.length > 0 ? (
                              exercises.map((exercise, index) => (
                                <motion.div
                                  key={exercise.id}
                                  custom={index}
                                  variants={listItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover="hover"
                                  exit={{ opacity: 0, x: -20 }}
                                >
                                  <ListItem
                                    onClick={() => handleOpenModal(exercise)}
                                    sx={{
                                      mb: 1,
                                      backgroundColor: "#553883",
                                      color: "#fff",
                                      borderRadius: 2,
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                                      "&:hover": {
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                      }
                                    }}
                                  >
                                    <ListItemText 
                                      primary={exercise.title} 
                                      secondary={
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}>
                                          {exercise.description.length > 60 
                                            ? exercise.description.substring(0, 60) + "..." 
                                            : exercise.description}
                                        </Typography>
                                      }
                                    />
                                    <motion.div whileHover={{ x: 3 }} whileTap={{ x: -2 }}>
                                      <IconButton sx={{ color: "#fff" }}>
                                        <ArrowForwardIosIcon />
                                      </IconButton>
                                    </motion.div>
                                  </ListItem>
                                </motion.div>
                              ))
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Typography sx={{ 
                                  textAlign: "center", 
                                  color: "#666", 
                                  py: 4,
                                  fontStyle: "italic",
                                  backgroundColor: "#f8f5ff",
                                  borderRadius: 2,
                                  border: "1px dashed #d8b4fe"
                                }}>
                                  Aucun sujet disponible.
                                </Typography>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </List>
                      )}
                    </Box>
                  </motion.div>
                </>
              )}
            </Box>
          </motion.div>

          {/* Modal pour afficher les détails de l'exercice */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  maxWidth: 800,
                  bgcolor: "background.paper",
                  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
                  p: 4,
                  borderRadius: 3,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  border: "1px solid #d8b4fe"
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                    <Typography 
                      variant="h6"
                      sx={{
                        color: "#5b21b6",
                        fontWeight: "bold"
                      }}
                    >
                      {selectedExercise?.title}
                    </Typography>
                    <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <IconButton onClick={handleCloseModal} sx={{ color: "#5b21b6" }}>
                        <CloseIcon />
                      </IconButton>
                    </motion.div>
                  </Box>
                </motion.div>

                {selectedExercise && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      bgcolor: "#f8f5ff",
                      mb: 3,
                      border: "1px solid #e9d5ff"
                    }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: "#5b21b6" }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {selectedExercise.description}
                      </Typography>
                    </Box>

                    {selectedExercise.content && !selectedExercise.content.includes("/exercises/") && (
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 2, 
                        bgcolor: "#f8f5ff",
                        mb: 3,
                        border: "1px solid #e9d5ff"
                      }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: "#5b21b6" }}>
                          Contenu texte
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {selectedExercise.content}
                        </Typography>
                      </Box>
                    )}

                    {signedUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", color: "#5b21b6" }}>
                            Fichier associé
                          </Typography>
                          <Box sx={{ 
                            border: "1px solid #e9d5ff", 
                            borderRadius: 2, 
                            overflow: "hidden",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)"
                          }}>
                            <iframe
                              src={signedUrl}
                              title="Exercice PDF"
                              style={{ width: "100%", height: "500px", border: "none" }}
                            />
                          </Box>
                        </Box>
                      </motion.div>
                    )}

                    {selectedExercise.content && selectedExercise.content.includes("/exercises/") && !signedUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                          Impossible de charger le fichier de l'exercice.
                        </Alert>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </Box>
            </Fade>
          </Modal>
        </Container>
      </motion.div>
    );
  }

  export default ProfessorCreateExercise;