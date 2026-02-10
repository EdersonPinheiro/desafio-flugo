import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import Layout from './components/Layout';
import CollaboratorList from './pages/CollaboratorList';
import CollaboratorForm from './pages/CollaboratorForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CollaboratorList />} />
            <Route path="/new" element={<CollaboratorForm />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
