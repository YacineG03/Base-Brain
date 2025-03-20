// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   CircularProgress,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Chip,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import { getPerformance } from "../../services/api";

// const SuivrePerformance = () => {
//   const [performanceData, setPerformanceData] = useState([]);
//   const [pastPerformance, setPastPerformance] = useState(null);
//   const [progression, setProgression] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPerformance = async () => {
//       try {
//         const { data } = await getPerformance();
//         console.log("Données de performance :", data);

//         // Formatter les données pour les graphiques
//         const formattedData = data.data.performance.labels.map((label, index) => ({
//           date: label,
//           note: parseFloat(data.data.performance.notes[index]) || 0,
//           moyenne: parseFloat(data.data.performance.classAverages[index]) || 0,
//           exercise: data.data.performance.exercises[index],
//         }));

//         setPerformanceData(formattedData);
//         setPastPerformance(data.data.pastPerformance);
//         setProgression(data.data.progression);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des performances :", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPerformance();
//   }, []);

//   if (loading) return <CircularProgress />;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//         <BarChartIcon sx={{ fontSize: 32, color: "#5b21b6", mr: 1 }} />
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Suivi de vos performances
//         </Typography>
//       </Box>
//       <Divider sx={{ mb: 3 }} />

//       {/* Graphique d'évolution des notes */}
//       <Card sx={{ mb: 4, p: 2, borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom sx={{ color: "#5b21b6", fontWeight: "bold" }}>
//             Évolution de vos notes
//           </Typography>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={performanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis domain={[0, 20]} />
//               <Tooltip />
//               <Line type="monotone" dataKey="note" stroke="#8e5cda" name="Votre note" />
//               <Line type="monotone" dataKey="moyenne" stroke="#82ca9d" name="Moyenne classe" />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Graphique de comparaison avec la moyenne de la classe */}
//       <Card sx={{ mb: 4, p: 2, borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom sx={{ color: "#5b21b6", fontWeight: "bold" }}>
//             Comparaison avec la moyenne de la classe
//           </Typography>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={performanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis domain={[0, 20]} />
//               <Tooltip />
//               <Bar dataKey="note" fill="#8e5cda" name="Votre note" />
//               <Bar dataKey="moyenne" fill="#82ca9d" name="Moyenne classe" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Statistiques globales */}
//       <Card sx={{ mb: 4, p: 2, borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom sx={{ color: "#5b21b6", fontWeight: "bold" }}>
//             Statistiques globales
//           </Typography>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography variant="body1" color="text.secondary">
//                 Total des soumissions :
//               </Typography>
//               <Typography variant="h5" fontWeight="bold" color="#333">
//                 {pastPerformance?.totalSubmissions || 0}
//               </Typography>
//             </Box>
//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography variant="body1" color="text.secondary">
//                 Note la plus haute :
//               </Typography>
//               <Typography variant="h5" fontWeight="bold" color="#2e7d32">
//                 {pastPerformance?.highestNote || "N/A"} / 20
//               </Typography>
//             </Box>
//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography variant="body1" color="text.secondary">
//                 Note la plus basse :
//               </Typography>
//               <Typography variant="h5" fontWeight="bold" color="#d32f2f">
//                 {pastPerformance?.lowestNote || "N/A"} / 20
//               </Typography>
//             </Box>
//             <Box sx={{ flex: 1, minWidth: 200 }}>
//               <Typography variant="body1" color="text.secondary">
//                 Note moyenne :
//               </Typography>
//               <Typography variant="h5" fontWeight="bold" color="#333">
//                 {pastPerformance?.averageNote || "N/A"} / 20
//               </Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Progression dans le temps */}
//       <Card sx={{ p: 2, borderRadius: "10px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom sx={{ color: "#5b21b6", fontWeight: "bold" }}>
//             Progression dans le temps
//           </Typography>
//           {progression.length > 0 ? (
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: "bold" }}>De</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>À</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Exercice De</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Exercice À</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Différence</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Tendance</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {progression.map((prog, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{prog.from}</TableCell>
//                     <TableCell>{prog.to}</TableCell>
//                     <TableCell>{prog.fromExercise}</TableCell>
//                     <TableCell>{prog.toExercise}</TableCell>
//                     <TableCell
//                       sx={{
//                         color: prog.difference > 0 ? "#2e7d32" : prog.difference < 0 ? "#d32f2f" : "#666",
//                       }}
//                     >
//                       {prog.difference > 0 ? "+" : ""}
//                       {prog.difference}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         icon={
//                           prog.trend === "up" ? (
//                             <TrendingUpIcon />
//                           ) : prog.trend === "down" ? (
//                             <TrendingDownIcon />
//                           ) : (
//                             <TrendingFlatIcon />
//                           )
//                         }
//                         label={prog.trend === "up" ? "Amélioration" : prog.trend === "down" ? "Baisse" : "Stable"}
//                         color={
//                           prog.trend === "up" ? "success" : prog.trend === "down" ? "error" : "default"
//                         }
//                         size="small"
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <Typography sx={{ color: "#666", textAlign: "center" }}>
//               Aucune donnée de progression disponible.
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default SuivrePerformance;
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Container,
  Paper,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoIcon from "@mui/icons-material/Info";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { getPerformance } from "../../services/api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2
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
  }),
  hover: {
    y: -5,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3 }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1 * index,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const tableRowVariants = {
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
    backgroundColor: "#f3e8ff",
    transition: { duration: 0.2 }
  }
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e9d5ff",
          p: 2,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#5b21b6", mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: "50%",
                mr: 1
              }}
            />
            <Typography variant="body2">
              {`${entry.name}: ${entry.value}`}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const SuivrePerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [pastPerformance, setPastPerformance] = useState(null);
  const [progression, setProgression] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      setContentLoaded(false);
      try {
        const { data } = await getPerformance();
        console.log("Données de performance :", data);

        // Formatter les données pour les graphiques
        const formattedData = data.data.performance.labels.map((label, index) => ({
          date: label,
          note: parseFloat(data.data.performance.notes[index]) || 0,
          moyenne: parseFloat(data.data.performance.classAverages[index]) || 0,
          exercise: data.data.performance.exercises[index],
        }));

        setPerformanceData(formattedData);
        setPastPerformance(data.data.pastPerformance);
        setProgression(data.data.progression);
      } catch (err) {
        console.error("Erreur lors de la récupération des performances :", err);
        setError("Impossible de charger les données de performance. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchPerformance();
  }, []);

  // Gradient colors for charts
  const gradientColors = {
    line: ["#8b5cf6", "#c084fc"],
    area: ["rgba(139, 92, 246, 0.8)", "rgba(192, 132, 252, 0.2)"],
    bar: ["#8b5cf6", "#c084fc"],
    barSecondary: ["#4ade80", "#86efac"]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl">
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
                <AssessmentIcon sx={{ fontSize: 36, color: "#5b21b6", mr: 2 }} />
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
                  Suivi de vos performances
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
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ mb: 4 }}>
                    <Skeleton 
                      variant="text" 
                      width={200} 
                      height={30} 
                      sx={{ mb: 2 }} 
                    />
                    <Skeleton 
                      variant="rectangular" 
                      height={300} 
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
                  {/* Graphique d'évolution des notes */}
                  <motion.div
                    custom={0}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        borderRadius: 3, 
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e9d5ff",
                        overflow: "hidden"
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <TimelineIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#5b21b6", 
                              fontWeight: "bold",
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
                            Évolution de vos notes
                          </Typography>
                          <Tooltip title="Ce graphique montre l'évolution de vos notes par rapport à la moyenne de la classe">
                            <IconButton size="small" sx={{ ml: 1, color: "#8b5cf6" }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ 
                          height: 350, 
                          p: 1, 
                          backgroundColor: "#faf5ff",
                          borderRadius: 2,
                          border: "1px solid #f3e8ff"
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                              data={performanceData}
                              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorNote" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.area[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.area[1]} stopOpacity={0.2}/>
                                </linearGradient>
                                <linearGradient id="colorMoyenne" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.barSecondary[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.barSecondary[1]} stopOpacity={0.2}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                              />
                              <YAxis 
                                domain={[0, 20]} 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                              />
                              <RechartsTooltip content={<CustomTooltip />} />
                              <Area
                                type="monotone"
                                dataKey="note"
                                stroke={gradientColors.line[0]}
                                fillOpacity={1}
                                fill="url(#colorNote)"
                                name="Votre note"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: "#5b21b6", stroke: "#fff", strokeWidth: 2 }}
                              />
                              <Area
                                type="monotone"
                                dataKey="moyenne"
                                stroke={gradientColors.barSecondary[0]}
                                fillOpacity={1}
                                fill="url(#colorMoyenne)"
                                name="Moyenne classe"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: 20,
                                  color: "#5b21b6"
                                }} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Graphique de comparaison avec la moyenne de la classe */}
                  <motion.div
                    custom={1}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        borderRadius: 3, 
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e9d5ff",
                        overflow: "hidden"
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <CompareArrowsIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#5b21b6", 
                              fontWeight: "bold",
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
                            Comparaison avec la moyenne de la classe
                          </Typography>
                          <Tooltip title="Ce graphique compare vos notes avec la moyenne de la classe pour chaque exercice">
                            <IconButton size="small" sx={{ ml: 1, color: "#8b5cf6" }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ 
                          height: 300, 
                          p: 1, 
                          backgroundColor: "#faf5ff",
                          borderRadius: 2,
                          border: "1px solid #f3e8ff"
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={performanceData}
                              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorBarNote" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.bar[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.bar[1]} stopOpacity={0.2}/>
                                </linearGradient>
                                <linearGradient id="colorBarMoyenne" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.barSecondary[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.barSecondary[1]} stopOpacity={0.2}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                              />
                              <YAxis 
                                domain={[0, 20]} 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                              />
                              <RechartsTooltip content={<CustomTooltip />} />
                              <Bar 
                                dataKey="note" 
                                fill="url(#colorBarNote)" 
                                name="Votre note" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                              <Bar 
                                dataKey="moyenne" 
                                fill="url(#colorBarMoyenne)" 
                                name="Moyenne classe" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: 20,
                                  color: "#5b21b6"
                                }} 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Statistiques globales */}
                  <motion.div
                    custom={2}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        borderRadius: 3, 
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e9d5ff",
                        overflow: "hidden"
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                          <BarChartIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#5b21b6", 
                              fontWeight: "bold",
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
                            Statistiques globales
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: 3,
                            p: 3,
                            backgroundColor: "#faf5ff",
                            borderRadius: 2,
                            border: "1px solid #f3e8ff"
                          }}
                        >
                          <motion.div 
                            custom={0}
                            variants={statItemVariants}
                            sx={{ 
                              flex: 1, 
                              minWidth: { xs: "100%", sm: 200 },
                              p: 2,
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #e9d5ff"
                            }}
                          >
                            <Typography variant="body1" color="#5b21b6" fontWeight="medium">
                              Total des soumissions
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#5b21b6"
                              sx={{ mt: 1 }}
                            >
                              {pastPerformance?.totalSubmissions || 0}
                            </Typography>
                          </motion.div>
                          
                          <motion.div 
                            custom={1}
                            variants={statItemVariants}
                            sx={{ 
                              flex: 1, 
                              minWidth: { xs: "100%", sm: 200 },
                              p: 2,
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #e9d5ff"
                            }}
                          >
                            <Typography variant="body1" color="#5b21b6" fontWeight="medium">
                              Note la plus haute
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#2e7d32"
                              sx={{ mt: 1 }}
                            >
                              {pastPerformance?.highestNote || "N/A"} / 20
                            </Typography>
                          </motion.div>
                          
                          <motion.div 
                            custom={2}
                            variants={statItemVariants}
                            sx={{ 
                              flex: 1, 
                              minWidth: { xs: "100%", sm: 200 },
                              p: 2,
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #e9d5ff"
                            }}
                          >
                            <Typography variant="body1" color="#5b21b6" fontWeight="medium">
                              Note la plus basse
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#d32f2f"
                              sx={{ mt: 1 }}
                            >
                              {pastPerformance?.lowestNote || "N/A"} / 20
                            </Typography>
                          </motion.div>
                          
                          <motion.div 
                            custom={3}
                            variants={statItemVariants}
                            sx={{ 
                              flex: 1, 
                              minWidth: { xs: "100%", sm: 200 },
                              p: 2,
                              backgroundColor: "#fff",
                              borderRadius: 2,
                              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #e9d5ff"
                            }}
                          >
                            <Typography variant="body1" color="#5b21b6" fontWeight="medium">
                              Note moyenne
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#5b21b6"
                              sx={{ mt: 1 }}
                            >
                              {pastPerformance?.averageNote || "N/A"} / 20
                            </Typography>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Progression dans le temps */}
                  <motion.div
                    custom={3}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e9d5ff",
                        overflow: "hidden"
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                          <EmojiEventsIcon sx={{ color: "#5b21b6", mr: 1 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "#5b21b6", 
                              fontWeight: "bold",
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
                            Progression dans le temps
                          </Typography>
                          <Tooltip title="Ce tableau montre votre progression entre les différents exercices">
                            <IconButton size="small" sx={{ ml: 1, color: "#8b5cf6" }}>
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {progression.length > 0 ? (
                          <Box sx={{ 
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e9d5ff",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
                          }}>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f3e8ff" }}>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>De</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>À</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Exercice De</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Exercice À</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Différence</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Tendance</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <AnimatePresence>
                                  {progression.map((prog, index) => (
                                    <motion.tr
                                      key={index}
                                      custom={index}
                                      variants={tableRowVariants}
                                      initial="hidden"
                                      animate="visible"
                                      whileHover="hover"
                                      component={TableRow}
                                      sx={{ 
                                        "&:nth-of-type(odd)": { backgroundColor: "#faf5ff" },
                                        transition: "background-color 0.3s"
                                      }}
                                    >
                                      <TableCell sx={{ py: 2 }}>{prog.from}</TableCell>
                                      <TableCell sx={{ py: 2 }}>{prog.to}</TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Tooltip title={prog.fromExercise}>
                                          <Typography
                                            sx={{
                                              maxWidth: 200,
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap"
                                            }}
                                          >
                                            {prog.fromExercise}
                                          </Typography>
                                        </Tooltip>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Tooltip title={prog.toExercise}>
                                          <Typography
                                            sx={{
                                              maxWidth: 200,
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap"
                                            }}
                                          >
                                            {prog.toExercise}
                                          </Typography>
                                        </Tooltip>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          py: 2,
                                          color: prog.difference > 0 ? "#2e7d32" : prog.difference < 0 ? "#d32f2f" : "#666",
                                          fontWeight: "bold"
                                        }}
                                      >
                                        {prog.difference > 0 ? "+" : ""}
                                        {prog.difference}
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <motion.div
                                          initial={{ scale: 0.9 }}
                                          animate={{ scale: 1 }}
                                          transition={{ 
                                            duration: 0.5,
                                            repeat: prog.trend === "up" ? 2 : 0,
                                            repeatType: "reverse"
                                          }}
                                        >
                                          <Chip
                                            icon={
                                              prog.trend === "up" ? (
                                                <TrendingUpIcon />
                                              ) : prog.trend === "down" ? (
                                                <TrendingDownIcon />
                                              ) : (
                                                <TrendingFlatIcon />
                                              )
                                            }
                                            label={
                                              prog.trend === "up"
                                                ? "Amélioration"
                                                : prog.trend === "down"
                                                ? "Baisse"
                                                : "Stable"
                                            }
                                            color={
                                              prog.trend === "up" ? "success" : prog.trend === "down" ? "error" : "default"
                                            }
                                            sx={{ 
                                              fontWeight: "bold",
                                              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                                            }}
                                          />
                                        </motion.div>
                                      </TableCell>
                                    </motion.tr>
                                  ))}
                                </AnimatePresence>
                              </TableBody>
                            </Table>
                          </Box>
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
                              Aucune donnée de progression disponible.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default SuivrePerformance;