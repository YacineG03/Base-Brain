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
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from '@mui/icons-material/Close'; // Ajout de l'importation
import { getStudentPerformance, getDashboardStatistics } from "../../services/api";

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

const ProfessorPerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [statisticsData, setStatisticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setContentLoaded(false);
      try {
        // Récupérer les performances des étudiants
        const performanceResponse = await getStudentPerformance();
        console.log("Données de performance des étudiants :", performanceResponse.data);

        // Récupérer les statistiques globales
        const statisticsResponse = await getDashboardStatistics();
        console.log("Données statistiques :", statisticsResponse.data);

        // Formatter les données pour les graphiques
        const formattedPerformance = performanceResponse.data.data.studentStats.map((student) => {
          const submissions = student.submissions.map((sub) => ({
            date: sub.submitted_at.substring(0, 10), // Format YY-MM-DD
            note: student.averageNote || 0,
            exercise: sub.exercise_title,
          }));
          return { ...student, submissions };
        });

        setPerformanceData(formattedPerformance);
        setStatisticsData(statisticsResponse.data.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Impossible de charger les données de performance. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
        setTimeout(() => setContentLoaded(true), 300);
      }
    };
    fetchData();
  }, []);

  // Calculer la tendance globale (simplifié)
  const calculateTrend = (stats) => {
    if (!stats || !stats.learningTrends || stats.learningTrends.length < 2) return "stable";
    const diffs = stats.learningTrends
      .slice(1)
      .map((trend, i) => trend.averageNote - stats.learningTrends[i].averageNote);
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return avgDiff > 0 ? "up" : avgDiff < 0 ? "down" : "stable";
  };

  const trend = calculateTrend(statisticsData);

  // Gradient colors for charts
  const gradientColors = {
    line: ["#8b5cf6", "#c084fc"],
    area: ["rgba(139, 92, 246, 0.8)", "rgba(192, 132, 252, 0.2)"],
    bar: ["#8b5cf6", "#c084fc"]
  };

  // Format data for area chart
  const formatAreaChartData = () => {
    if (!statisticsData?.learningTrends) return [];
    return statisticsData.learningTrends.map(item => ({
      ...item,
      successRate: item.successRate || 0
    }));
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
                  Tableau de bord des performances
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
                  {/* Graphique d'évolution des notes moyennes des étudiants */}
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
                            Évolution des notes moyennes
                          </Typography>
                          <Tooltip title="Ce graphique montre l'évolution des notes moyennes des étudiants au fil du temps">
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
                              data={statisticsData?.learningTrends || []}
                              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorNote" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.area[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.area[1]} stopOpacity={0.2}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                              <XAxis 
                                dataKey="week" 
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
                                dataKey="averageNote"
                                stroke={gradientColors.line[0]}
                                fillOpacity={1}
                                fill="url(#colorNote)"
                                name="Note moyenne"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: "#5b21b6", stroke: "#fff", strokeWidth: 2 }}
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

                  {/* Statistiques globales */}
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
                              {statisticsData?.totalSubmissions || 0}
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
                              Taux de réussite
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#2e7d32"
                              sx={{ mt: 1 }}
                            >
                              {statisticsData?.successRate || "0"}%
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
                              Note moyenne
                            </Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight="bold" 
                              color="#5b21b6"
                              sx={{ mt: 1 }}
                            >
                              {statisticsData?.averageNote || "N/A"} / 20
                            </Typography>
                          </motion.div>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            mt: 3,
                            p: 2,
                            backgroundColor: "#f3e8ff",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <Typography variant="body1" fontWeight="medium" color="#5b21b6">
                            Tendance globale :
                          </Typography>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              duration: 0.5,
                              repeat: 2,
                              repeatType: "reverse"
                            }}
                          >
                            <Chip
                              icon={
                                trend === "up" ? (
                                  <TrendingUpIcon />
                                ) : trend === "down" ? (
                                  <TrendingDownIcon />
                                ) : (
                                  <TrendingFlatIcon />
                                )
                              }
                              label={
                                trend === "up"
                                  ? "Amélioration"
                                  : trend === "down"
                                  ? "Baisse"
                                  : "Stable"
                              }
                              color={
                                trend === "up" ? "success" : trend === "down" ? "error" : "default"
                              }
                              sx={{ 
                                fontWeight: "bold",
                                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                              }}
                            />
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Questions mal comprises */}
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
                          <ErrorOutlineIcon sx={{ color: "#5b21b6", mr: 1 }} />
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
                            Questions mal comprises
                          </Typography>
                        </Box>
                        {statisticsData?.poorlyUnderstoodQuestions.length > 0 ? (
                          <Box sx={{ 
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e9d5ff",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)"
                          }}>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#f3e8ff" }}>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Question</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Occurrences</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Note moyenne</TableCell>
                                  <TableCell sx={{ fontWeight: "bold", color: "#5b21b6", py: 2 }}>Exemples de feedback</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <AnimatePresence>
                                  {statisticsData.poorlyUnderstoodQuestions.map((question, index) => (
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
                                      <TableCell sx={{ py: 2 }}>{question.question}</TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Chip 
                                          label={question.count} 
                                          size="small" 
                                          sx={{ 
                                            bgcolor: "#e9d5ff",
                                            color: "#5b21b6",
                                            fontWeight: "bold"
                                          }} 
                                        />
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        <Typography 
                                          sx={{ 
                                            color: question.averageGrade < 10 ? "#d32f2f" : "#2e7d32",
                                            fontWeight: "bold"
                                          }}
                                        >
                                          {question.averageGrade} / 20
                                        </Typography>
                                      </TableCell>
                                      <TableCell sx={{ py: 2 }}>
                                        {question.feedbackExamples
                                          .slice(0, 2)
                                          .map((feedback, i) => (
                                            <Typography 
                                              key={i} 
                                              variant="body2" 
                                              sx={{ 
                                                mb: 1,
                                                p: 1,
                                                backgroundColor: "#fff",
                                                borderRadius: 1,
                                                border: "1px solid #e9d5ff",
                                                fontStyle: "italic"
                                              }}
                                            >
                                              {feedback}
                                            </Typography>
                                          ))}
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
                              Aucune question mal comprise détectée.
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Comparaison des performances par étudiant */}
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
                          <PeopleIcon sx={{ color: "#5b21b6", mr: 1 }} />
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
                            Comparaison des performances par étudiant
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          height: 350, 
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
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={gradientColors.bar[0]} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={gradientColors.bar[1]} stopOpacity={0.2}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                              <XAxis 
                                dataKey="student_name" 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                              />
                              <YAxis 
                                domain={[0, 20]} 
                                tick={{ fill: "#5b21b6" }}
                                axisLine={{ stroke: "#d8b4fe" }}
                              />
                              <RechartsTooltip content={<CustomTooltip />} />
                              <Bar 
                                dataKey="averageNote" 
                                fill="url(#colorBar)" 
                                name="Note moyenne" 
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
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default ProfessorPerformanceDashboard;