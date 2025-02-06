import { AuthProvider } from './contexts/AuthContext';
import AppContent from './components/AppContent';
import AuthForms from './components/auth/AuthForms';
import { useAuth } from './contexts/AuthContext';

function AuthenticatedApp() {
  const { user } = useAuth();
  return user ? <AppContent /> : <AuthForms />;
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;