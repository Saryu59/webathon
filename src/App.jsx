import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyTasks from './pages/MyTasks';
import AdminDashboard from './pages/AdminDashboard';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';

// Time limit for Fixed status before auto-revert to Pending (2 minutes for demo)
const FIXED_TIMEOUT_MS = 2 * 60 * 1000;

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'user');

  const [issues, setIssues] = useState([
    {
      id: 1,
      user: 'Ravi Kumar',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800', // Clear pothole/road image
      description: 'Deep pothole filled with water on Main Street bridge. High risk for vehicles, especially at night.',
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
      image: 'https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?q=80&w=800', // High-fidelity streetlight at night
      description: 'Single street light failure in Greenfield Sector 4. The entire stretch is dangerously dark.',
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
    },
    {
      id: 3,
      user: 'Vikram M.',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800', // Urban garbage
      description: 'Massive garbage accumulation blocking the road near metro buses. Sanitation sweep required.',
      time: '1 day ago',
      postedDate: '18 Feb 2026',
      location: 'Metro Terminal West',
      coordinates: { lat: 12.9500, lng: 77.5800 },
      verified: true,
      likes: 56,
      likedBy: [],
      status: 'Solved',
      address: 'Near Bus Depot 2',
      acceptedBy: 'Santhosh Kumar',
      solvedBy: 'Santhosh Kumar',
      solvedDate: '19 Feb 2026',
      category: 'Waste',
      categoryIcon: '🗑️',
      aiConfidence: 97
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
        <Route path="/dashboard" element={<Dashboard issues={issues} setIssues={setIssues} notifications={notifications} setNotifications={setNotifications} updateStatus={updateIssueStatus} />} />
        <Route path="/tasks" element={<MyTasks tasks={issues.filter(i => i.acceptedBy === 'You')} updateStatus={updateIssueStatus} addNotification={addNotification} />} />
        <Route path="/profile" element={<Profile user={userStats} setUser={setUserStats} />} />
        <Route path="/rewards" element={<Rewards user={userStats} />} />
        <Route path="/notifications" element={<Notifications notifications={notifications} setNotifications={setNotifications} issues={issues} />} />
        <Route path="/admin" element={<AdminDashboard issues={issues} setIssues={setIssues} addNotification={addNotification} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
