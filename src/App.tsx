import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AIProviderProvider } from "./context/AIProviderContext";
import StudentDashboard from "./pages/StudentDashboard";
import Landing from "./pages/Landing";
import ParentDashboard from "./pages/ParentDashboard";
import AdminPanel from "./pages/AdminPanel";
import StudentLayout from "./layouts/StudentLayout";
import AITutor from "./pages/AITutor";
import AIDoubtSolver from "./pages/AIDoubtSolver";
import ImageGenerator from "./pages/ImageGenerator";
import InfographicGenerator from "./pages/InfographicGenerator";
import PDFLearning from "./pages/PDFLearning";
import QuizGenerator from "./pages/QuizGenerator";
import FlashcardGenerator from "./pages/FlashcardGenerator";
import AISummaryPage from "./pages/AISummaryPage";
import AINotesPage from "./pages/AINotesPage";
import MockTestsPage from "./pages/MockTestsPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import CalendarPage from "./pages/CalendarPage";
import MindMapPage from "./pages/MindMapPage";
import SubjectsPage from "./pages/SubjectsPage";
import PYQPage from "./pages/PYQPage";
import RevisionCenterPage from "./pages/RevisionCenterPage";
import ProgressAnalyticsPage from "./pages/ProgressAnalyticsPage";
import GoalsPage from "./pages/GoalsPage";
import CommunityPage from "./pages/CommunityPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ExplainSimplyWorkspace from "./pages/ExplainSimplyWorkspace";
import { HomeworkHelperPage } from "./pages/HomeworkHelperPage";
import { ConceptExplorerPage } from "./pages/ConceptExplorerPage";

export default function App() {
  return (
    <ThemeProvider>
      <AIProviderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Student App Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="concept-explorer" element={<ConceptExplorerPage />} />
              <Route path="tutor" element={<AITutor />} />
              <Route path="homework-helper" element={<HomeworkHelperPage />} />
              <Route path="explain-simply" element={<ExplainSimplyWorkspace />} />
              <Route path="doubt-solver" element={<AIDoubtSolver />} />
              <Route path="image-generator" element={<ImageGenerator />} />
              <Route path="infographic-generator" element={<InfographicGenerator />} />
              <Route path="pdf-learning" element={<PDFLearning />} />
              <Route path="summary" element={<AISummaryPage />} />
              <Route path="notes" element={<AINotesPage />} />
              <Route path="quiz" element={<QuizGenerator />} />
              <Route path="flashcards" element={<FlashcardGenerator />} />
              <Route path="mock-tests" element={<MockTestsPage />} />
              <Route path="study-planner" element={<StudyPlannerPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="mind-map" element={<MindMapPage />} />
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="pyq" element={<PYQPage />} />
              <Route path="revision" element={<RevisionCenterPage />} />
              <Route path="analytics" element={<ProgressAnalyticsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AIProviderProvider>
    </ThemeProvider>
  );
}

