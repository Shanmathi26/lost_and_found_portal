// Generate unique tab ID for each tab instance
const getTabId = () => {
  if (!window.tabId) {
    window.tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return window.tabId;
};

// Session management for multi-tab support using only localStorage
export const getCurrentUser = () => {
  return localStorage.getItem(`currentUser_${getTabId()}`);
};

export const getUserRole = () => {
  return localStorage.getItem(`userRole_${getTabId()}`);
};

export const setCurrentUser = (username) => {
  localStorage.setItem(`currentUser_${getTabId()}`, username);
};

export const setUserRole = (role) => {
  localStorage.setItem(`userRole_${getTabId()}`, role);
};

export const clearSession = () => {
  localStorage.removeItem(`currentUser_${getTabId()}`);
  localStorage.removeItem(`userRole_${getTabId()}`);
};