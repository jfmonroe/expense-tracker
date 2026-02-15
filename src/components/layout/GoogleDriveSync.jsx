import { useState, useEffect, useRef } from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import { useApp } from "../../context/AppContext";
import {
  initGoogleDrive,
  signInToGoogle,
  signOutFromGoogle,
  isSignedIn,
  getUserEmail,
  saveToGoogleDrive,
  loadFromGoogleDrive,
} from "../../utils/googleDriveSync";
import styles from "./GoogleDriveSync.module.css";

/**
 * GoogleDriveSync provides cloud backup and sync via Google Drive.
 * 
 * Users sign in with Google, and their data is saved to their own Drive.
 * The app developer never has access to the data - complete privacy.
 */

// Load credentials from environment variables (set in Vercel)
// See setup instructions in GOOGLE_DRIVE_SETUP.md
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const GoogleDriveSync = () => {
  const { transactions, budgets, savingsGoals, replaceAllData } = useApp();
  const [signedIn, setSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  // Auto-sync: save to Drive when data changes (after 3 second debounce)
  useEffect(() => {
    if (!signedIn || !autoSyncEnabled) {
      console.log('Auto-sync disabled:', { signedIn, autoSyncEnabled });
      return;
    }

    console.log('Auto-sync: data changed, will sync in 3 seconds...');

    const timeoutId = setTimeout(async () => {
      console.log('Auto-sync: starting sync now...');
      try {
        setSyncing(true);
        const data = { transactions, budgets, savingsGoals };
        await saveToGoogleDrive(data);
        setLastSync(new Date().toLocaleString());
        console.log('Auto-sync: success!');
      } catch (error) {
        console.error("Auto-sync error:", error);
      } finally {
        setSyncing(false);
      }
    }, 3000);

    return () => {
      console.log('Auto-sync: cancelled (new change detected)');
      clearTimeout(timeoutId);
    };
  }, [transactions, budgets, savingsGoals, signedIn, autoSyncEnabled]);

  // Initialize Google Drive API on mount
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      console.warn("Google Drive sync not configured. Add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to Vercel environment variables.");
      return;
    }

    initGoogleDrive(GOOGLE_CLIENT_ID, GOOGLE_API_KEY, () => {
      setReady(true);
      setSignedIn(isSignedIn());
      if (isSignedIn()) {
        getUserEmail().then(setUserEmail);
      }
    });
  }, []);

  /** Sign in to Google */
  const handleSignIn = async () => {
    try {
      await signInToGoogle();
      setSignedIn(true);
      const email = await getUserEmail();
      setUserEmail(email);
      
      console.log('Sign in successful, loading data...');
      
      // Auto-load data after sign in
      await handleLoad(true); // silent = true, no confirmation needed
      
      console.log('Data loaded, enabling auto-sync...');
      
      // Enable auto-sync after loading
      setAutoSyncEnabled(true);
    } catch (error) {
      alert("Failed to sign in: " + error.message);
    }
  };

  /** Sign out from Google */
  const handleSignOut = () => {
    console.log('Signing out, disabling auto-sync...');
    setAutoSyncEnabled(false);
    signOutFromGoogle();
    setSignedIn(false);
    setUserEmail(null);
    setLastSync(null);
  };

  /** Save current data to Google Drive */
  const handleSave = async (silent = false) => {
    setSyncing(true);
    try {
      const data = { transactions, budgets, savingsGoals };
      await saveToGoogleDrive(data);
      setLastSync(new Date().toLocaleString());
      if (!silent) {
        alert("Data saved to Google Drive successfully!");
      }
    } catch (error) {
      if (!silent) {
        alert("Failed to save to Google Drive: " + error.message);
      }
      console.error("Auto-sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  /** Load data from Google Drive */
  const handleLoad = async (silent = false) => {
    setSyncing(true);
    try {
      const data = await loadFromGoogleDrive();
      
      if (!data) {
        if (!silent) {
          alert("No data found in Google Drive. Your local data will be saved on next sync.");
        }
        setSyncing(false);
        return;
      }

      // For manual load, ask user if they want to replace local data
      // For auto-load (silent), just load it
      let confirmLoad = true;
      if (!silent) {
        confirmLoad = window.confirm(
          "Load data from Google Drive? This will replace your current local data.\n\n" +
          `Cloud has ${data.transactions?.length || 0} transactions.`
        );
      }

      if (confirmLoad) {
        // Replace ALL data with cloud data (no duplicates!)
        replaceAllData(data);
        setLastSync(new Date().toLocaleString());
        if (!silent) {
          alert("Data loaded from Google Drive successfully!");
        }
      }
    } catch (error) {
      if (!silent) {
        alert("Failed to load from Google Drive: " + error.message);
      }
      console.error("Load error:", error);
    } finally {
      setSyncing(false);
    }
  };

  // Don't show if not configured
  if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
    return null;
  }

  // Don't show until API is ready
  if (!ready) {
    return (
      <Card title="☁️ Cloud Sync">
        <p className={styles.loading}>Initializing Google Drive...</p>
      </Card>
    );
  }

  return (
    <Card title="☁️ Cloud Sync">
      {!signedIn ? (
        <div className={styles.signedOut}>
          <p className={styles.description}>
            Sign in with Google to sync your data across devices.
            Your data is stored in <strong>your</strong> Google Drive - completely private.
          </p>
          <Button onClick={handleSignIn}>
            Sign in with Google
          </Button>
        </div>
      ) : (
        <div className={styles.signedIn}>
          <div className={styles.userInfo}>
            <p className={styles.email}>✓ Signed in as <strong>{userEmail}</strong></p>
            {syncing ? (
              <p className={styles.syncing}>🔄 Syncing...</p>
            ) : lastSync ? (
              <p className={styles.lastSync}>✓ Synced: {lastSync}</p>
            ) : (
              <p className={styles.lastSync}>Ready to sync</p>
            )}
          </div>

          <div className={styles.actions}>
            <Button 
              onClick={handleLoad} 
              disabled={syncing}
              variant="ghost"
            >
              {syncing ? "Loading..." : "📥 Load from Drive"}
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="ghost"
            >
              Sign Out
            </Button>
          </div>

          <p className={styles.tip}>
            💡 Your data automatically syncs to Drive. Use "Load from Drive" to pull data from another device.
          </p>
        </div>
      )}
    </Card>
  );
};

export default GoogleDriveSync;
