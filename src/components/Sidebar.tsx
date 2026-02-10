import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Person as PersonIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png';

const drawerWidth = 300;

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '1px dashed #E0E0E0',
                    bgcolor: '#FFFFFF'
                },
            }}
        >
            <Box sx={{ pt: 3, px: 3, display: 'flex', alignItems: 'center', mb: -0.5 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Flugo Logo"
                    sx={{ height: 40, width: 'auto' }}
                />
            </Box>

            <List sx={{ px: 1.5 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={location.pathname === '/' || location.pathname.startsWith('/new')}
                        onClick={() => navigate('/')}
                        sx={{
                            borderRadius: '8px',
                            py: 1,
                            px: 1.5,
                            '&.Mui-selected': {
                                bgcolor: 'transparent',
                                '&:hover': { bgcolor: '#F2F4F7' },
                                '& .MuiTypography-root': { color: '#667085', fontWeight: 600 },
                                '& .MuiListItemIcon-root .icon-container': { bgcolor: '#F2F4F7' },
                            },
                            '&:hover': {
                                bgcolor: '#F2F4F7',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            <Box
                                className="icon-container"
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: '#E4E7EC',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#667085'
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Colaboradores"
                            primaryTypographyProps={{
                                fontSize: '0.975rem',
                                fontWeight: 500,
                                color: '#667085',
                                ml: 0.5
                            }}
                        />
                        <ChevronRightIcon sx={{ fontSize: 18, color: '#98A2B3' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
