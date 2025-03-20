// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Alert,
//   CircularProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Modal,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { useNavigate } from "react-router-dom";
// import {
//   getSubmissionsForProfessorById,
//   getExercisesForProfessor,
//   putSubmission,
//   getSubmissionFile,
// } from "../../services/api";

// function ProfessorStudentList() {
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [exercises, setExercises] = useState([]);
//   const [selectedExerciseId, setSelectedExerciseId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [note, setNote] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const exercisesResponse = await getExercisesForProfessor();
//         const exercisesData = exercisesResponse.data.exercises || [];
//         setExercises(exercisesData);

//         if (exercisesData.length > 0 && !selectedExerciseId) {
//           setSelectedExerciseId(exercisesData[0].id);
//         }

//         if (selectedExerciseId) {
//           const submissionsResponse = await getSubmissionsForProfessorById(selectedExerciseId);
//           const submissions = submissionsResponse.data.submissions || [];

//           console.log("Données brutes des soumissions:", submissionsResponse.data);

//           const studentData = submissions.reduce((acc, submission) => {
//             const exercise = exercisesData.find((e) => e.id === submission.exercise_id);
//             const studentName = submission.student_name || `Étudiant ${submission.student_id}`;
//             if (!acc[submission.student_id] || new Date(submission.submitted_at) > new Date(acc[submission.student_id].submitted_at)) {
//               acc[submission.student_id] = {
//                 id: submission.student_id,
//                 name: studentName,
//                 note: submission.note || null,
//                 submissionId: submission.id,
//                 exerciseTitle: exercise ? exercise.title : "Inconnu",
//                 fileUrl: submission.file_path,
//                 submitted_at: submission.submitted_at,
//               };
//             }
//             return acc;
//           }, {});

//           setStudents(Object.values(studentData));
//           console.log("Étudiants après mapping:", studentData);
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération des données :", err);
//         setError(
//           "Impossible de charger la liste des étudiants. Vérifiez votre connexion ou contactez un administrateur."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedExerciseId]);

//   const handleOpenDialog = (student) => {
//     setSelectedStudent(student);
//     setNote(student.note?.toString() || "");
//     setFeedback("");
//     console.log("Étudiant sélectionné pour le Dialog:", student);
//   };

//   const handleCloseDialog = () => {
//     setSelectedStudent(null);
//     setNote("");
//     setFeedback("");
//   };

//   const handleSaveCorrection = async () => {
//     if (!selectedStudent || !selectedStudent.submissionId) return;

//     setLoading(true);
//     try {
//       const updatedData = {
//         note: note ? parseFloat(note) : null,
//         feedback: feedback || null,
//       };
//       await putSubmission(selectedStudent.submissionId, updatedData);
//       setStudents((prevStudents) =>
//         prevStudents.map((student) =>
//           student.id === selectedStudent.id
//             ? { ...student, note: updatedData.note }
//             : student
//         )
//       );
//       setError("");
//       handleCloseDialog();
//     } catch (err) {
//       console.error("Erreur lors de la mise à jour de la soumission :", err);
//       setError("Échec de la mise à jour de la note.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewSubmissionFile = async (fileUrl) => {
//     try {
//       const fileName = fileUrl.split("/").pop();
//       console.log("FileName envoyé à l'endpoint:", fileName);
//       const fileBlob = await getSubmissionFile(fileName);
//       const blobUrl = URL.createObjectURL(fileBlob);
//       setSelectedPdfUrl(blobUrl);
//     } catch (err) {
//       console.error("Erreur lors de la récupération du fichier:", err);
//       setError("Impossible de charger le fichier PDF soumis.");
//     }
//   };

//   const handleCloseModal = () => {
//     if (selectedPdfUrl) {
//       URL.revokeObjectURL(selectedPdfUrl);
//     }
//     setSelectedPdfUrl(null);
//   };

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Liste des étudiants
//       </Typography>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel>Choisir un exercice</InputLabel>
//         <Select
//           value={selectedExerciseId}
//           onChange={(e) => setSelectedExerciseId(e.target.value)}
//           label="Choisir un exercice"
//         >
//           {exercises.map((exercise) => (
//             <MenuItem key={exercise.id} value={exercise.id}>
//               {exercise.title}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {students.map((student) => (
//         <Box
//           key={student.id}
//           sx={{
//             mb: 2,
//             p: 2,
//             backgroundColor: "#5b21b6",
//             color: "white",
//             borderRadius: 1,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography>{`Étudiant: ${student.name}`}</Typography>
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Typography>{`Note: ${student.note !== null ? student.note : "Non évalué"}`}</Typography>
//             <Button
//               variant="contained"
//               onClick={() => handleOpenDialog(student)}
//               sx={{ ml: 2, bgcolor: "#d8b4fe", "&:hover": { bgcolor: "#c084fc" } }}
//             >
//               Corriger
//             </Button>
//           </Box>
//         </Box>
//       ))}

//       <Dialog open={!!selectedStudent} onClose={handleCloseDialog}>
//         <DialogTitle>{`Corriger: ${selectedStudent?.name}`}</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Note (0-20)"
//             type="number"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             fullWidth
//             sx={{ mt: 2 }}
//             inputProps={{ min: 0, max: 20 }}
//           />
//           <TextField
//             label="Feedback"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             fullWidth
//             multiline
//             rows={4}
//             sx={{ mt: 2 }}
//           />
//           {selectedStudent?.fileUrl ? (
//             <Button
//               variant="outlined"
//               startIcon={<VisibilityIcon />}
//               onClick={() => handleViewSubmissionFile(selectedStudent.fileUrl)}
//               sx={{ mt: 2, color: "#5b21b6", borderColor: "#5b21b6" }}
//             >
//               Voir le fichier soumis
//             </Button>
//           ) : (
//             <Typography sx={{ mt: 2, color: "#666" }}>
//               Aucun fichier soumis par l'étudiant.
//             </Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Annuler
//           </Button>
//           <Button
//             onClick={handleSaveCorrection}
//             color="primary"
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Valider"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Modal
//         open={!!selectedPdfUrl}
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
//           {selectedPdfUrl ? (
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
//             <Typography>Chargement du PDF...</Typography>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

// export default ProfessorStudentList;
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Backdrop,
  Fade,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Container,
  Skeleton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GradeIcon from "@mui/icons-material/Grade";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";
import {
  getSubmissionsForProfessorById,
  getExercisesForProfessor,
  putSubmission,
  getSubmissionFile,
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

const studentCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.05 * index,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
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

function ProfessorStudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setContentLoaded(false);
      try {
        const exercisesResponse = await getExercisesForProfessor();
        const exercisesData = exercisesResponse.data.exercises || [];
        setExercises(exercisesData);

        if (exercisesData.length > 0 && !selectedExerciseId) {
          setSelectedExerciseId(exercisesData[0].id);
        }

        if (selectedExerciseId) {
          const submissionsResponse = await getSubmissionsForProfessorById(selectedExerciseId);
          const submissions = submissionsResponse.data.submissions || [];

          console.log("Données brutes des soumissions:", submissionsResponse.data);

          const studentData = submissions.reduce((acc, submission) => {
            const exercise = exercisesData.find((e) => e.id === submission.exercise_id);
            const studentName = submission.student_name || `Étudiant ${submission.student_id}`;
            if (!acc[submission.student_id] || new Date(submission.submitted_at) > new Date(acc[submission.student_id].submitted_at)) {
              acc[submission.student_id] = {
                id: submission.student_id,
                name: studentName,
                note: submission.note || null,
                submissionId: submission.id,
                exerciseTitle: exercise ? exercise.title : "Inconnu",
                fileUrl: submission.file_path,
                submitted_at: submission.submitted_at,
                feedback: submission.feedback || "",
              };
            }
            return acc;
          }, {});

          setStudents(Object.values(studentData));
          console.log("Étudiants après mapping:", studentData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError(
          "Impossible de charger la liste des étudiants. Vérifiez votre connexion ou contactez un administrateur."
        );
      } finally {
        setLoading(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };

    fetchData();
  }, [selectedExerciseId]);

  const handleOpenDialog = (student) => {
    setSelectedStudent(student);
    setNote(student.note?.toString() || "");
    setFeedback(student.feedback || "");
    setDialogOpen(true);
    console.log("Étudiant sélectionné pour le Dialog:", student);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setSelectedStudent(null);
      setNote("");
      setFeedback("");
    }, 300);
  };

  const handleSaveCorrection = async () => {
    if (!selectedStudent || !selectedStudent.submissionId) return;

    setSaveLoading(true);
    try {
      const updatedData = {
        note: note ? parseFloat(note) : null,
        feedback: feedback || null,
      };
      await putSubmission(selectedStudent.submissionId, updatedData);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, note: updatedData.note, feedback: updatedData.feedback }
            : student
        )
      );
      setError("");
      handleCloseDialog();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la soumission :", err);
      setError("Échec de la mise à jour de la note.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleViewSubmissionFile = async (fileUrl) => {
    try {
      const fileName = fileUrl.split("/").pop();
      console.log("FileName envoyé à l'endpoint:", fileName);
      const fileBlob = await getSubmissionFile(fileName);
      const blobUrl = URL.createObjectURL(fileBlob);
      setSelectedPdfUrl(blobUrl);
    } catch (err) {
      console.error("Erreur lors de la récupération du fichier:", err);
      setError("Impossible de charger le fichier PDF soumis.");
    }
  };

  const handleCloseModal = () => {
    if (selectedPdfUrl) {
      URL.revokeObjectURL(selectedPdfUrl);
    }
    setSelectedPdfUrl(null);
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
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                <GradeIcon sx={{ color: "#5b21b6", mr: 1, fontSize: 30 }} />
                <Typography 
                  variant="h4" 
                  sx={{
                    fontWeight: "bold",
                    color: "#5b21b6",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80px",
                      height: "3px",
                      backgroundColor: "#5b21b6",
                      borderRadius: "2px"
                    }
                  }}
                >
                  Ajuster les notes générées par IA
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

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <FormControl 
                fullWidth 
                sx={{ 
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f3e8ff",
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
              >
                <InputLabel id="exercise-select-label" sx={{ color: "#5b21b6" }}>
                  <AssignmentIcon sx={{ mr: 1, fontSize: 20, verticalAlign: "middle" }} />
                  Choisir un exercice
                </InputLabel>
                <Select
                  labelId="exercise-select-label"
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  label="Choisir un exercice"
                >
                  {exercises.map((exercise) => (
                    <MenuItem key={exercise.id} value={exercise.id}>
                      {exercise.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>

            {loading ? (
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton 
                      variant="rectangular" 
                      height={80} 
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: "#f3e8ff"
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={contentLoaded ? "visible" : "exit"}
                  exit="exit"
                >
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <motion.div
                        key={student.id}
                        custom={index}
                        variants={studentCardVariants}
                        whileHover="hover"
                      >
                        <Box
                          sx={{
                            mb: 3,
                            p: 0,
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            border: "1px solid #e9d5ff",
                          }}
                        >
                          <Box sx={{ 
                            p: 3, 
                            backgroundColor: "#5b21b6", 
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <SchoolIcon sx={{ mr: 1.5 }} />
                              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                                {student.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Chip 
                                label={formatDate(student.submitted_at)} 
                                size="small" 
                                sx={{ 
                                  bgcolor: "rgba(255, 255, 255, 0.2)",
                                  color: "white",
                                  mr: 2
                                }} 
                              />
                              {student.note !== null ? (
                                <Chip 
                                  icon={<CheckCircleIcon sx={{ color: "#4ade80 !important" }} />}
                                  label={`Note: ${student.note}/20`} 
                                  sx={{ 
                                    bgcolor: "rgba(74, 222, 128, 0.2)",
                                    color: "white",
                                    fontWeight: "bold",
                                    mr: 2
                                  }} 
                                />
                              ) : (
                                <Chip 
                                  icon={<HourglassEmptyIcon sx={{ color: "#fbbf24 !important" }} />}
                                  label="Non évalué" 
                                  sx={{ 
                                    bgcolor: "rgba(251, 191, 36, 0.2)",
                                    color: "white",
                                    mr: 2
                                  }} 
                                />
                              )}
                              <motion.div
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                              >
                                <Button
                                  variant="contained"
                                  onClick={() => handleOpenDialog(student)}
                                  startIcon={<EditIcon />}
                                  sx={{ 
                                    bgcolor: "#d8b4fe", 
                                    "&:hover": { 
                                      bgcolor: "#c084fc",
                                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                    },
                                    borderRadius: 2,
                                    px: 3
                                  }}
                                >
                                  Corriger
                                </Button>
                              </motion.div>
                            </Box>
                          </Box>
                          
                          {student.fileUrl && (
                            <Box sx={{ 
                              p: 2, 
                              backgroundColor: "#f8f5ff",
                              borderTop: "1px solid #e9d5ff",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <Typography variant="body2" sx={{ color: "#5b21b6", fontWeight: "medium" }}>
                                Fichier soumis disponible
                              </Typography>
                              <motion.div
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewSubmissionFile(student.fileUrl)}
                                  sx={{ 
                                    color: "#5b21b6", 
                                    borderColor: "#5b21b6",
                                    "&:hover": { 
                                      borderColor: "#7c3aed",
                                      backgroundColor: "rgba(124, 58, 237, 0.04)"
                                    },
                                    borderRadius: 2
                                  }}
                                >
                                  Voir le fichier
                                </Button>
                              </motion.div>
                            </Box>
                          )}
                          
                          {student.feedback && (
                            <Box sx={{ 
                              p: 2, 
                              backgroundColor: "#faf5ff",
                              borderTop: "1px solid #e9d5ff"
                            }}>
                              <Typography variant="body2" sx={{ color: "#5b21b6", fontWeight: "medium", mb: 1, display: "flex", alignItems: "center" }}>
                                <FeedbackIcon sx={{ mr: 1, fontSize: 18 }} />
                                Feedback:
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666", fontStyle: "italic", pl: 3 }}>
                                {student.feedback}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    ))
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
                          Aucune soumission d'étudiant pour cet exercice.
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </motion.div>

        {/* Dialog for grading */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 400 }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
              maxWidth: 600,
              width: "100%"
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: "#5b21b6", 
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GradeIcon sx={{ mr: 1.5 }} />
              <Typography variant="h6">
                {`Corriger: ${selectedStudent?.name}`}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleCloseDialog}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <TextField
                label="Note (0-20)"
                type="number"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                sx={{ 
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#5b21b6",
                    },
                  }
                }}
                InputProps={{
                  startAdornment: <GradeIcon sx={{ mr: 1, color: "#5b21b6" }} />,
                }}
                inputProps={{ min: 0, max: 20 }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TextField
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ 
                  mt: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#5b21b6",
                    },
                  }
                }}
                InputProps={{
                  startAdornment: <FeedbackIcon sx={{ mr: 1, mt: 1, color: "#5b21b6" }} />,
                }}
              />
            </motion.div>
            
            {selectedStudent?.fileUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: "#f8f5ff",
                  border: "1px solid #e9d5ff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Typography variant="body2" sx={{ color: "#5b21b6" }}>
                    Consulter le travail soumis
                  </Typography>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewSubmissionFile(selectedStudent.fileUrl)}
                      sx={{ 
                        color: "#5b21b6", 
                        borderColor: "#5b21b6",
                        "&:hover": { 
                          borderColor: "#7c3aed",
                          backgroundColor: "rgba(124, 58, 237, 0.04)"
                        },
                        borderRadius: 2
                      }}
                    >
                      Voir le fichier soumis
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button 
                onClick={handleCloseDialog} 
                sx={{ 
                  color: "#5b21b6",
                  borderRadius: 2,
                  px: 3
                }}
              >
                Annuler
              </Button>
            </motion.div>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Button
                onClick={handleSaveCorrection}
                variant="contained"
                disabled={saveLoading}
                sx={{ 
                  bgcolor: "#5b21b6", 
                  "&:hover": { 
                    bgcolor: "#4c1d95",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  },
                  borderRadius: 2,
                  px: 3
                }}
              >
                {saveLoading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Valider"
                )}
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        {/* Modal for PDF viewer */}
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

export default ProfessorStudentList;