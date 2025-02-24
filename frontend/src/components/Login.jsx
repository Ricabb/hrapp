// src/components/Login.jsx
import React from 'react';
// Import signInWithPopup and signOut from Firebase v9 modular SDK.
import { signInWithPopup, signOut } from 'firebase/auth';
// Import auth and googleProvider from your firebase configuration.
import { auth, googleProvider } from '../firebase';

function Login({ onLogin, user }) {
  console.log("Login component rendered. Current user:", user); // Debug log

const handleLogin = async () => {
  console.log("Sign in button clicked."); // Debug log
  try {
    // Use the modular function signInWithPopup and pass in auth and googleProvider
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Sign in result:", result); // Log the result for debugging
    onLogin(result.user);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    alert("Error during Google sign-in. Check console for details.");
  }
};


  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogin(null);
    } catch (error) {
      console.error("Error during sign-out:", error);
      alert("Error during sign-out. Check console for details.");
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

export default Login;
