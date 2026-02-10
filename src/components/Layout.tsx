import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';

import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { getRandomAvatar } from '../services/collaboratorService';

const drawerWidth = 300;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
            <CssBaseline />

            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' }, position: 'absolute', top: 20, left: 20, zIndex: 1200 }}
            >
                <MenuIcon />
            </IconButton>

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={handleDrawerToggle}
                drawerWidth={drawerWidth}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    px: { xs: 2, md: 10 },
                    py: 4,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    maxWidth: '100%',
                    mx: 'auto'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Box
                        component="img"
                        src={getRandomAvatar("Felix")}
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
