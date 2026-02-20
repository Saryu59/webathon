import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyTasks from './pages/MyTasks';
import AdminDashboard from './pages/AdminDashboard';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';
import LoginPage from './pages/LoginPage';

// Time limit for Fixed status before auto-revert to Pending (2 minutes for demo)
const FIXED_TIMEOUT_MS = 2 * 60 * 1000;

// Access Control Components
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children, isAuthenticated, role }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userRole'));

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
  };
  const [issues, setIssues] = useState([
    {
      id: 1,
      user: 'Ravi Kumar',
      image: '/pothole.jpg', // Local User Image
      description: 'Severe puddle-filled pothole on the city bridge. Critical risk for commuters and vehicle alignment.',
      time: '2 hours ago',
      postedDate: '20 Feb 2026',
      location: 'Main Street Bridge',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      verified: true,
      likes: 24,
      likedBy: [],
      status: 'Verified',
      address: 'Near Central Bridge Entrance',
      acceptedBy: null,
      solvedBy: null,
      solvedDate: null,
      category: 'Pothole',
      categoryIcon: '🚧',
      aiConfidence: 89
    },
    {
      id: 2,
      user: 'Anita S.',
      image: '/streetlight.jfif', // User's specific local file
      description: 'Single streetlight silhouette failing at dusk. The entire walkway is dangerously dark for residents.',
      time: '5 hours ago',
      postedDate: '20 Feb 2026',
      location: 'Sector 4, Greenfield',
      coordinates: { lat: 12.9800, lng: 77.6000 },
      verified: false,
      likes: 12,
      likedBy: [],
      status: 'Pending',
      address: 'Lane 5, Greenfield Road',
      acceptedBy: null,
      solvedBy: null,
      solvedDate: null,
      category: 'Infrastructure',
      categoryIcon: '💡',
      aiConfidence: 94
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nearby Issue Alert',
      message: 'A new issue has been posted within 4km of your location.',
      time: '10 mins ago',
      type: 'verify',
      postId: 2,
      unread: true
    }
  ]);

  const [userStats, setUserStats] = useState({
    fullName: 'Santhosh Kumar',
    email: 'santhosh@civicflow.gov',
    phone: '+91 98765 43210',
    address: '123 Civic Lane, Downtown Metro',
    photo: null,
    points: 450,
    rank: '#8',
    streak: '5 Days',
    postedCount: 12,
    acceptedCount: 5,
    solvedCount: 3,
    history: [
      { id: 101, action: 'Solved Drainage Issue', date: '20 Feb 2026', points: 150 },
      { id: 102, action: 'Verified Street Light', date: '18 Feb 2026', points: 50 }
    ],
    badges: [
      { id: 1, name: 'Civic Hero', tier: 'Gold' },
      { id: 2, name: 'First Responder', tier: 'Silver' }
    ]
  });

  const updateIssueStatus = (id, newStatus, extra = {}) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        const updated = { ...issue, status: newStatus, ...extra };

        if (newStatus === 'In Progress') {
          updated.acceptedAt = Date.now();
          addNotification({
            title: 'Task Accepted!',
            message: `You accepted: ${issue.description.substring(0, 30)}... You have ${FIXED_TIMEOUT_MS / 60000} min to fix it.`,
            type: 'update',
            postId: id
          });
        }

        if (newStatus === 'Fixed') {
          updated.acceptedAt = null; // stop the timer
          addNotification({
            title: 'Fix Reported ✅',
            message: 'Waiting for admin confirmation to mark as Solved.',
            type: 'confirm',
            postId: id
          });
        }

        if (newStatus === 'Solved') {
          updated.acceptedAt = null;
          addNotification({
            title: 'Issue Solved! 🏆',
            message: `The community has confirmed the fix for: ${issue.description.substring(0, 30)}`,
            type: 'confirm',
            postId: id
          });
          if (updated.solvedBy === 'Santhosh Kumar' || updated.acceptedBy === 'You') {
            setUserStats(prev => ({
              ...prev,
              points: prev.points + 150,
              solvedCount: prev.solvedCount + 1,
              history: [{ id: Date.now(), action: `Solved: ${issue.description.substring(0, 20)}...`, date: 'Today', points: 150 }, ...prev.history]
            }));
          }
        }
        return updated;
      }
      return issue;
    }));
  };

  // Auto-revert "In Progress" issues to Pending if not fixed in time
  useEffect(() => {
    const interval = setInterval(() => {
      setIssues(prev => {
        let changed = false;
        const updated = prev.map(issue => {
          if (issue.status === 'In Progress' && issue.acceptedAt && (Date.now() - issue.acceptedAt) > FIXED_TIMEOUT_MS) {
            changed = true;
            return { ...issue, status: 'Pending', acceptedBy: null, acceptedAt: null, verified: false };
          }
          return issue;
        });
        if (changed) {
          setTimeout(() => {
            addNotification({
              title: 'Task Expired ⏳',
              message: 'An accepted issue was not fixed in time and is now available for others to accept.',
              type: 'update'
            });
          }, 0);
        }
        return changed ? updated : prev;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = (notif) => {
    setNotifications(prev => [{
      id: Date.now(),
      time: 'Just now',
      unread: true,
      ...notif
    }, ...prev]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Protected Resident Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard issues={issues} setIssues={setIssues} notifications={notifications} setNotifications={setNotifications} updateStatus={updateIssueStatus} />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyTasks tasks={issues.filter(i => i.acceptedBy === 'You')} updateStatus={updateIssueStatus} addNotification={addNotification} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile user={userStats} setUser={setUserStats} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/rewards" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Rewards user={userStats} />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Notifications notifications={notifications} setNotifications={setNotifications} issues={issues} />
          </ProtectedRoute>
        } />

        {/* Admin Only Route */}
        <Route path="/admin" element={
          <AdminRoute isAuthenticated={isAuthenticated} role={userRole}>
            <AdminDashboard issues={issues} setIssues={setIssues} addNotification={addNotification} />
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
