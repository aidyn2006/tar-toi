import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { authService } from './api/authService';
import { LanguageProvider } from './context/LanguageContext';

// Lazy load all pages for better performance
import Home from './pages/Home';
// Lazy load other pages for better performance
// const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EditInvitePage = lazy(() => import('./pages/EditInvitePage'));
const PublicInvitePage = lazy(() => import('./pages/PublicInvitePage'));
const GuestListPage = lazy(() => import('./pages/GuestListPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MereiPage = lazy(() => import('./pages/MereiPage'));

const ProtectedRoute = ({ children }) => {
    if (authService.isLoggedIn()) {
        return children;
    }

    const next = encodeURIComponent(
        `${window.location.pathname}${window.location.search}`
    );

    return (
        <Navigate
            to={`/?auth=login&reason=unauthorized&next=${next}`}
            replace
        />
    );
};

const PageLoader = () => (
    <div style={{
        height: '100vh', width: '100vw', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fffe', color: '#10b981',
        fontFamily: 'Unbounded, sans-serif'
    }}>
        Жүктелуде...
    </div>
);

function App() {
    return (
        <HelmetProvider>
            <LanguageProvider>
                <Router>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* SEO Routes */}
                            <Route path="/categories" element={<CategoriesPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/meretoi-shakyru" element={<MereiPage />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/invite/:id/guests"
                                element={
                                    <ProtectedRoute>
                                        <GuestListPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/invite/edit/:id"
                                element={
                                    <ProtectedRoute>
                                        <EditInvitePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/invite/new"
                                element={
                                    <ProtectedRoute>
                                        <EditInvitePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/invite/:slug" element={<PublicInvitePage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </Router>
            </LanguageProvider>
        </HelmetProvider>
    );
}

export default App;