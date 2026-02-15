import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#F8F9FA'
            }}
        >
            <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold' }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Página não encontrada
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                Desculpe, a página solicitada não existe.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
                Voltar para a página inicial
            </Button>
        </Box>
    );
};

export default NotFound;
