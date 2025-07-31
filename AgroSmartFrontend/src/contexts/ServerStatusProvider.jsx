import React, { createContext, useContext, useEffect } from 'react';
import useServerStatus from '../hooks/useServerStatus';
import ServerStatusBanner from '../Components/common/ServerStatusBanner';

const ServerStatusContext = createContext();

export const useServerStatusContext = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatusContext must be used within a ServerStatusProvider');
  }
  return context;
};

const ServerStatusProvider = ({ children }) => {
  const serverStatus = useServerStatus();
  
  // Add padding to body when server is offline to account for the banner
  useEffect(() => {
    if (!serverStatus.isInitialCheck && !serverStatus.isServerOnline) {
      document.body.style.paddingTop = '70px';
    } else {
      document.body.style.paddingTop = '0px';
    }
    
    return () => {
      document.body.style.paddingTop = '0px';
    };
  }, [serverStatus.isServerOnline, serverStatus.isInitialCheck]);

  return (
    <ServerStatusContext.Provider value={serverStatus}>
      <ServerStatusBanner
        isServerOnline={serverStatus.isServerOnline}
        isInitialCheck={serverStatus.isInitialCheck}
        lastChecked={serverStatus.lastChecked}
        retryCount={serverStatus.retryCount}
        onRetry={serverStatus.retryConnection}
      />
      {children}
    </ServerStatusContext.Provider>
  );
};

export default ServerStatusProvider;
