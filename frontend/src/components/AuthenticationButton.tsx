import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <span>Hello, {user?.name}</span>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </button>
      </div>
    );
  } else {
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  }
};

export default AuthenticationButton;
