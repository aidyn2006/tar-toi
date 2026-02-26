import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import EditInvitePage from './pages/EditInvitePage';
import PublicInvitePage from './pages/PublicInvitePage';
import { authService } from './api/authService';

const ProtectedRoute = ({ children }) => {
    return authService.isLoggedIn() ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Protected: edit existing invite */}
                <Route
                    path="/invite/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditInvitePage />
                        </ProtectedRoute>
                    }
                />
                {/* Protected: create new invite */}
                <Route
                    path="/invite/new"
                    element={
                        <ProtectedRoute>
                            <EditInvitePage />
                        </ProtectedRoute>
                    }
                />
                {/* Public: view invite by slug */}
                <Route path="/invite/:slug" element={<PublicInvitePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
