const TOKEN_KEY = "Blog_App_Token";

const expireAt = new Date(Date.now() + 24 * 60 * 60);

export const getToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(TOKEN_KEY);
  }
};

export const setToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};
