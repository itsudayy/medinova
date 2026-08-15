// Turns raw Firebase/axios errors into something a user can act on.
// Axios reports an unreachable or CORS-blocked backend as a bare
// "Network Error", which tells the user nothing about what to fix.
export default function authErrorMessage(err) {
  if (err.message === 'Network Error') {
    return "Can't reach the server. Make sure the backend is running on port 5000.";
  }
  if (err.response?.data?.message) return err.response.data.message;
  return (err.message || 'Something went wrong').replace('Firebase: ', '');
}
