import React from 'react';
import { useAuth } from '../../contexts/AuthProvider';

const UserDebug = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug Info:</h4>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>User ID:</strong> {user?.userId || 'None'}</p>
      <p><strong>Name:</strong> {user?.name || 'None'}</p>
      <p><strong>Email:</strong> {user?.email || 'None'}</p>
      <p><strong>Profile Image:</strong> {user?.profileImage || 'None'}</p>
      <p><strong>Full Object:</strong></p>
      <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};

export default UserDebug;
