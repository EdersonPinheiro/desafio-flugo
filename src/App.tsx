import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import Layout from './components/Layout';
import CollaboratorList from './pages/CollaboratorList';
import CollaboratorForm from './pages/CollaboratorForm';
import DepartmentList from './pages/DepartmentList';
import DepartmentForm from './pages/DepartmentForm';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<CollaboratorList />} />
                      <Route path="/new" element={<CollaboratorForm />} />
                      <Route path="/edit/:id" element={<CollaboratorForm />} />
                      <Route path="/departments" element={<DepartmentList />} />
                      <Route path="/departments/new" element={<DepartmentForm />} />
                      <Route path="/departments/edit/:id" element={<DepartmentForm />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
             <Route path="/404" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
