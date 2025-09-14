import React, { createContext, useContext } from 'react';
import useServerStatus from '../hooks/useServerStatus';

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
  
  // No need to add padding since we're not showing the banner anymore
  // Just provide the server status context to children

  return (
    <ServerStatusContext.Provider value={serverStatus}>
      {/* Banner completely removed - only console logging now */}
      {children}
    </ServerStatusContext.Provider>
  );
};

export default ServerStatusProvider;
