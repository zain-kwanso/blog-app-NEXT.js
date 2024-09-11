import { routeUrl } from "@/utils/pageRoutes";
import { useRouter } from "next/navigation";
import { UseCustomNavigation } from "../../@types/navigateHook";

const useCustomNavigation = (): UseCustomNavigation => {
  const router = useRouter();

  const navigateTo = (url: string, params = {}): void => {
    let finalUrl = url;
    for (const [key, value] of Object.entries(params)) {
      finalUrl = finalUrl.replace(`:${key}`, value as string);
    }
    router.push(finalUrl);
  };

  return {
    navigateToPreviewPostPage: (postId: number) =>
      navigateTo(routeUrl.previewPost, { postId }),
    navigateToEditPostPage: (postId: number) =>
      navigateTo(routeUrl.editPost, { postId }),
    navigateToCreatePostPage: () => router.push(routeUrl.createPost),
    navigateToLoginPage: () => router.push(routeUrl.login),
    navigateToSignupPage: () => router.push(routeUrl.signup),
    navigateToHomePage: () => router.push(routeUrl.base),
  };
};

export default useCustomNavigation;
