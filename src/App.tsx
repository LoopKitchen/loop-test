import { useEffect, useState } from 'react';
import './App.css';
import { fetchUserData, onAuthStateChange } from './services/firebase';
import { authChecker } from './utils/authChecker';

interface UserData {
  uid: string;
  email: string;
  name?: string;
  org?: string;
  role?: string;
  stage?: string;
  status?: string;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string>('Checking...');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check session cookie
      const authStatus = await authChecker.checkAuth();

      if (authStatus.success) {
        setAuthenticated(true);
        setSessionStatus('Valid session cookie found');

        // Listen to Firebase auth state
        const unsubscribe = onAuthStateChange(async (user) => {
          if (user) {
            // Fetch additional user data from Firestore
            const firestoreData = await fetchUserData(user.uid);

            setUserData({
              uid: user.uid,
              email: user.email || '',
              name: firestoreData?.name || user.displayName || 'N/A',
              org: firestoreData?.org || 'N/A',
              role: firestoreData?.role || 'N/A',
              stage: firestoreData?.stage || 'N/A',
              status: firestoreData?.status || 'N/A'
            });
          } else {
            // No Firebase user but we have a valid session
            // This might happen if Firebase hasn't loaded yet
            setUserData({
              uid: 'Loading...',
              email: 'Loading...',
              name: 'Loading...'
            });
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        // No valid session, redirect to auth
        setSessionStatus('No valid session, redirecting to auth...');
        setTimeout(() => {
          authChecker.redirectToLogin();
        }, 2000);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setSessionStatus('Error checking auth, redirecting...');
      setTimeout(() => {
        authChecker.redirectToLogin();
      }, 2000);
    }
  };

  const handleLogout = async () => {
    await authChecker.signOut();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h1>Test Application - TryLoop</h1>
          <div className="loading">
            <p>Loading authentication status...</p>
            <p className="status">{sessionStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container">
        <div className="card">
          <h1>Test Application - TryLoop</h1>
          <div className="error">
            <p>{sessionStatus}</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Test Application - TryLoop</h1>
        <div className="success">
          <p>✅ Successfully authenticated!</p>
          <p className="status">{sessionStatus}</p>
        </div>

        <div className="user-info">
          <h2>User Information</h2>
          <table>
            <tbody>
              <tr>
                <td><strong>UID:</strong></td>
                <td>{userData?.uid}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{userData?.email}</td>
              </tr>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{userData?.name}</td>
              </tr>
              <tr>
                <td><strong>Organization:</strong></td>
                <td>{userData?.org}</td>
              </tr>
              <tr>
                <td><strong>Role:</strong></td>
                <td>{userData?.role}</td>
              </tr>
              <tr>
                <td><strong>Stage:</strong></td>
                <td>{userData?.stage}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>{userData?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="info">
          <h3>How this works:</h3>
          <ul>
            <li>This app checks for a valid session cookie on load</li>
            <li>If no cookie found, redirects to auth.tryloop.ai</li>
            <li>After login, user is redirected back here</li>
            <li>User data is fetched from Firebase Firestore</li>
            <li>Session cookie works across all *.tryloop.ai domains</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;