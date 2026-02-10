import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
            <CssBaseline />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    px: 10,
                    py: 4,
                    maxWidth: '100%',
                    mx: 'auto'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Box
                        component="img"
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
                        alt="User Profile"
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            border: '4px solid #FFFFFF',
                            boxShadow: '0px 2px 4px rgba(16, 24, 40, 0.06)',
                            cursor: 'pointer'
                        }}
                    />
                </Box>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
