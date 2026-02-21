import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyTasks from './pages/MyTasks';
import AdminDashboard from './pages/AdminDashboard';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IssueDetails from './pages/IssueDetails';
import OnboardingPage from './pages/OnboardingPage';
import EditProfile from './pages/EditProfile';

// Time limit for Fixed status before auto-revert to Pending (2 minutes for demo)
const FIXED_TIMEOUT_MS = 2 * 60 * 1000;

// Simulated Cloud Sync Service
// In a real app, this would use Firebase, WebSockets, or Polling to a real backend
const CloudSyncService = {
  lastSynced: Date.now(),
  push: async (data, type) => {
    // console.log(`[CloudSync] Pushing ${type}...`);
    // Simulated network delay
    await new Promise(r => setTimeout(r, 800));
    return true;
  },
  pull: async () => {
    // This could fetch from a shared JSON bin or backend
    // For demo, we return null to signify "no new remote changes"
    return null;
  }
};

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

// Load saved profile from localStorage
const loadSavedProfile = () => {
  try {
    const saved = localStorage.getItem('userProfile');
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return null;
};

const defaultUserStats = {
  fullName: '',
  email: '',
  phone: '',
  address: 'HSR Layout, Bengaluru, Karnataka',
  photo: null,
  points: 0,
  rank: '#—',
  streak: '0 Days',
  history: [],
  badges: []
};

function App() {
  // ── All state declarations FIRST ──────────────────────────────────────────
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userRole'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [issues, setIssues] = useState([
    {
      id: 1,
      user: 'Ravi Kumar',
      image: '/pothole.jpg',
      description: 'Severe puddle-filled pothole near Charminar. Critical risk for commuters and tourists.',
      time: '2 hours ago',
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: 'Old City, Hyderabad, Telangana',
      coordinates: { lat: 17.3616, lng: 78.4747 },
      verified: true,
      likes: 24,
      likedBy: [],
      status: 'Verified',
      address: 'Near Charminar Police Station, Hyderabad',
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
      image: '/streetlight.jfif',
      description: 'Streetlight out on Marine Drive promenade. The area is pitch dark and unsafe for evening walkers.',
      time: '5 hours ago',
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: 'Marine Drive, Mumbai, Maharashtra',
      coordinates: { lat: 18.9431, lng: 72.8230 },
      verified: false,
      likes: 12,
      likedBy: [],
      status: 'Pending',
      address: 'Opposite Air India Building, Nariman Point',
      acceptedBy: null,
      solvedBy: null,
      solvedDate: null,
      category: 'Infrastructure',
      categoryIcon: '💡',
      aiConfidence: 94
    },
    {
      id: 3,
      user: 'Arjun Mehra',
      image: '/garbage.jpg',
      description: 'Illegal garbage dumping site near Cubbon Park. Foul smell and attracting strays.',
      time: 'Just now',
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: 'Cubbon Park, Bengaluru, Karnataka',
      coordinates: { lat: 12.9779, lng: 77.5952 },
      verified: false,
      likes: 5,
      likedBy: [],
      status: 'Pending',
      address: 'Near High Court Entrance, Bengaluru',
      acceptedBy: null,
      solvedBy: null,
      solvedDate: null,
      category: 'Waste',
      categoryIcon: '🗑️',
      aiConfidence: 96
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

  const [userStats, setUserStats] = useState(() => {
    return loadSavedProfile() || defaultUserStats;
  });

  // ── Refs ───────────────────────────────────────────────────────────────────
  const channelRef = useRef(null);
  const ignoreNextBroadcast = useRef(false);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // BroadcastChannel setup for cross-tab real-time sync
  useEffect(() => {
    const channel = new BroadcastChannel('civicflow_sync');
    channelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'ISSUES_UPDATE') {
        ignoreNextBroadcast.current = true;
        setIssues(payload);
      }
      if (type === 'NOTIFICATION') {
        setNotifications(prev => [{
          id: Date.now(),
          time: 'Just now',
          unread: true,
          ...payload
        }, ...prev]);
      }
    };

    return () => channel.close();
  }, []);

  // Broadcast issues to other tabs whenever they change
  useEffect(() => {
    if (ignoreNextBroadcast.current) {
      ignoreNextBroadcast.current = false;
      return;
    }
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'ISSUES_UPDATE', payload: issues });
    }
    // Also push to CloudSync
    CloudSyncService.push(issues, 'ISSUES');
  }, [issues]);

  // Periodic Cloud Sync Pull (Simulated Multi-device)
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      const remoteData = await CloudSyncService.pull();
      if (remoteData && remoteData.issues) {
        setIssues(remoteData.issues);
      }
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(syncInterval);
  }, []);

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

  // ── Derived State ─────────────────────────────────────────────────────────
  const dynamicStats = useMemo(() => {
    const myIssues = issues.filter(i => i.user === 'You');
    const mySolvedIssues = issues.filter(i =>
      (i.acceptedBy === 'You') && i.status === 'Solved'
    );
    const dynamicPoints = myIssues.length * 50 + mySolvedIssues.length * 150 + (userStats.history || []).reduce((sum, h) => sum + (h.points || 0), 0);
    return {
      postedCount: myIssues.length,
      acceptedCount: issues.filter(i => i.acceptedBy === 'You' && i.status === 'In Progress').length,
      solvedCount: mySolvedIssues.length,
      points: Math.max(userStats.points || 0, dynamicPoints)
    };
  }, [issues, userStats.points, userStats.history]);

  const fullUserStats = { ...userStats, ...dynamicStats };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (role, userData) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role);
    if (userData) {
      const savedProfile = loadSavedProfile();
      const mergedProfile = {
        ...defaultUserStats,
        ...(savedProfile && savedProfile.email === userData.email ? savedProfile : {}),
        fullName: userData.fullName || savedProfile?.fullName || '',
        email: userData.email || '',
        phone: userData.phone || savedProfile?.phone || '',
        address: savedProfile?.address || '',
      };
      setUserStats(mergedProfile);
      localStorage.setItem('userProfile', JSON.stringify(mergedProfile));
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userRole');
  };

  const addNotification = (notif) => {
    setNotifications(prev => [{
      id: Date.now(),
      time: 'Just now',
      unread: true,
      ...notif
    }, ...prev]);
  };

  const updateIssueStatus = (id, newStatus, extra = {}) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        const updated = { ...issue, status: newStatus, ...extra };

        if (newStatus === 'In Progress') {
          updated.acceptedAt = Date.now();
          addNotification({
            title: 'Task Accepted!',
            message: `You accepted: "${issue.description.substring(0, 50)}..." You have ${FIXED_TIMEOUT_MS / 60000} min to fix it.`,
            type: 'update',
            postId: id
          });
        }

        if (newStatus === 'Fixed') {
          updated.acceptedAt = null;
          addNotification({
            title: 'Fix Reported ✅',
            message: `Your fix for "${issue.description.substring(0, 40)}..." is waiting for admin confirmation.`,
            type: 'confirm',
            postId: id
          });
        }

        if (newStatus === 'Solved') {
          updated.acceptedAt = null;
          addNotification({
            title: 'Issue Solved! 🏆',
            message: `The community has confirmed the fix for: "${issue.description.substring(0, 50)}..."`,
            type: 'confirm',
            postId: id
          });
          if (updated.acceptedBy === 'You') {
            setUserStats(prev => {
              const updated2 = {
                ...prev,
                points: (prev.points || 0) + 150,
                history: [{ id: Date.now(), action: `Solved: "${issue.description.substring(0, 30)}..."`, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), points: 150 }, ...(prev.history || [])]
              };
              localStorage.setItem('userProfile', JSON.stringify(updated2));
              return updated2;
            });
          }
        }
        return updated;
      }
      return issue;
    }));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard
              issues={issues}
              setIssues={setIssues}
              notifications={notifications}
              setNotifications={setNotifications}
              updateStatus={updateIssueStatus}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MyTasks tasks={issues.filter(i => i.acceptedBy === 'You')} updateStatus={updateIssueStatus} addNotification={addNotification} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile user={fullUserStats} setUser={setUserStats} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditProfile user={fullUserStats} setUser={setUserStats} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/rewards" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Rewards user={fullUserStats} issues={issues} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Notifications notifications={notifications} setNotifications={setNotifications} issues={issues} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/issue/:id" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <IssueDetails issues={issues} updateStatus={updateIssueStatus} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute isAuthenticated={isAuthenticated} role={userRole}>
            <AdminDashboard issues={issues} setIssues={setIssues} updateStatus={updateIssueStatus} addNotification={addNotification} />
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
