import React from "react";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function ProfilePanel() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-panel">
      {user ? (
        <>
          <h3>Profile</h3>
          <p><b>Email:</b> {user.email}</p>
          <button className="btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p className="muted">Not logged in</p>
        </>
      )}
    </div>
  );
}
