export const decodeJWT = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };
  
  export const checkAuth = (allowedRoles = []) => {
    if (typeof window === 'undefined') return false;
  
    const token = document.cookie.split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) return false;
  
    const decoded = decodeJWT(token);
    if (!decoded) return false;
  
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return false;
    }
  
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role_id)) {
      return false;
    }
  
    return true;
  };