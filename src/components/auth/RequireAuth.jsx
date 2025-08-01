const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login with the current location
        window.location.href = '/login';
        return null;
    }
    return children;
};
export default RequireAuth

