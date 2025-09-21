import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthenticationButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading, error } = useAuth0();

  if (isLoading) {
    return <span>Signing in...</span>;
  }

  if (error) {
    return <span>Auth error</span>;
  }

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Hello, {user?.name || user?.email || 'user'}</span>
        <button
          className="auth-btn auth-btn--logout"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <button className="auth-btn auth-btn--login" onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

export default AuthenticationButton;
