export interface UseCustomNavigation {
  navigateToPreviewPostPage: (postId: number) => void;
  navigateToEditPostPage: (postId: number) => void;
  navigateToCreatePostPage: () => void;
  navigateToLoginPage: () => void;
  navigateToSignupPage: () => void;
  navigateToHomePage: () => void;
  navigateToOTPVerificationPage: () => void;
}
