// Temporary fix for profile picture
// Run this in the browser console after logging in

const fixProfilePicture = () => {
  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Update with correct profile image
  const updatedUser = {
    ...currentUser,
    profileImage: "Images/3df7d67f-dfac-4116-a29c-0938e5268d85.jpg"
  };
  
  // Save back to localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  console.log('Updated user data:', updatedUser);
  
  // Refresh the page to see changes
  window.location.reload();
};

// Call this function
fixProfilePicture();
