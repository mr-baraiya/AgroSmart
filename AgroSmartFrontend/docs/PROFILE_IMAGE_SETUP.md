# Profile Image Configuration

## Default Profile Image

All new users will now display a default profile image located at `/public/default-profile.png` instead of showing only initials.

### Implementation Details

- **Location**: `/public/default-profile.png`
- **Size**: 416KB
- **Fallback**: User initials with gradient background (if default image fails to load)

### Components Updated

1. **ProfileImageUpload.jsx**: Main component for profile image upload/display with editing capabilities
2. **ProfileImage.jsx**: Read-only profile image display component

### Changes Made

- Modified `imageUrl` construction to use default image when no profile image is set
- Updated image loading with error handling to gracefully fallback to initials
- Both components now display the default image for new users

### Usage

```jsx
// Will automatically show default image for users without profileImage
<ProfileImageUpload user={user} size="lg" />
<ProfileImageDisplay user={user} size="md" />
```

### Benefits

- Better user experience for new users
- Consistent visual appearance
- Professional look for the application
- Graceful degradation with fallback to initials
