
// Simple password protection for admin access
// In a real app, this would use proper authentication

const ADMIN_PASSWORD = "admin123"; // This is the password you'll use to access admin pages

export const checkAdminPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

export const setAdminAuthenticated = (isAuthenticated: boolean): void => {
  if (isAuthenticated) {
    localStorage.setItem("adminAuthenticated", "true");
  } else {
    localStorage.removeItem("adminAuthenticated");
  }
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem("adminAuthenticated") === "true";
};
