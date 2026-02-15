import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Person as PersonIcon, ChevronRight as ChevronRightIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png';

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
    drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose, drawerWidth }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const drawerContent = (
        <>
            <Box sx={{ pt: 3, px: 3, display: 'flex', alignItems: 'center', mb: -0.5 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Flugo Logo"
                    sx={{ height: 40, width: 'auto' }}
                />
            </Box>

            <List sx={{ px: 1.5 }}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        selected={location.pathname === '/' || location.pathname.startsWith('/new') || location.pathname.startsWith('/edit')}
                        onClick={() => {
                            navigate('/');
                            onClose();
                        }}
                        sx={{
                            borderRadius: '8px',
                            py: 1,
                            px: 1.5,
                            '&.Mui-selected': {
                                bgcolor: '#F2F4F7',
                                '& .MuiTypography-root': { color: '#101828', fontWeight: 600 },
                                '& .MuiListItemIcon-root .icon-container': { bgcolor: '#FFFFFF', boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' },
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
                                    bgcolor: location.pathname === '/' || location.pathname.startsWith('/new') || location.pathname.startsWith('/edit') ? '#FFFFFF' : '#E4E7EC',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#667085',
                                    ...((location.pathname === '/' || location.pathname.startsWith('/new') || location.pathname.startsWith('/edit')) && { boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' })

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
                <ListItem disablePadding>
                    <ListItemButton
                        selected={location.pathname.startsWith('/departments')}
                        onClick={() => {
                            navigate('/departments');
                            onClose();
                        }}
                        sx={{
                            borderRadius: '8px',
                            py: 1,
                            px: 1.5,
                            '&.Mui-selected': {
                                bgcolor: '#F2F4F7',
                                '& .MuiTypography-root': { color: '#101828', fontWeight: 600 },
                                '& .MuiListItemIcon-root .icon-container': { bgcolor: '#FFFFFF', boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' },
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
                                    bgcolor: location.pathname.startsWith('/departments') ? '#FFFFFF' : '#E4E7EC',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#667085',
                                    ...(location.pathname.startsWith('/departments') && { boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' })
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 20 }} />
                            </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary="Departamentos"
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
        </>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px dashed #E0E0E0',
                        bgcolor: '#FFFFFF'
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
