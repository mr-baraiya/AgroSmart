// Test component to verify image loading
import React from 'react';

const ImageTest = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Image Test</h3>
      <p>Testing default profile image access:</p>
      
      {/* Test direct path */}
      <div style={{ marginBottom: '10px' }}>
        <p>Direct path: /default-profile.png</p>
        <img 
          src="/default-profile.png" 
          alt="Default profile test" 
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          onLoad={() => console.log('✅ Direct path loaded')}
          onError={() => console.log('❌ Direct path failed')}
        />
      </div>
      
      {/* Test relative path */}
      <div style={{ marginBottom: '10px' }}>
        <p>Relative path: ./default-profile.png</p>
        <img 
          src="./default-profile.png" 
          alt="Default profile test" 
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          onLoad={() => console.log('✅ Relative path loaded')}
          onError={() => console.log('❌ Relative path failed')}
        />
      </div>

      {/* Test with base URL */}
      <div style={{ marginBottom: '10px' }}>
        <p>Base URL path: {import.meta.env.BASE_URL}default-profile.png</p>
        <img 
          src={`${import.meta.env.BASE_URL}default-profile.png`}
          alt="Default profile test" 
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          onLoad={() => console.log('✅ Base URL path loaded')}
          onError={() => console.log('❌ Base URL path failed')}
        />
      </div>
    </div>
  );
};

export default ImageTest;
