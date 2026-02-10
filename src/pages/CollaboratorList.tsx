import React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    CircularProgress,
    Fab
} from '@mui/material';
import { Add as AddIcon, ArrowDownward as ArrowDownwardIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Collaborator } from '../types/collaborator';
import { subscribeToCollaborators, getRandomAvatar } from '../services/collaboratorService';

const CollaboratorList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);

    const [orderByField, setOrderByField] = React.useState<keyof Collaborator>('name');
    const [orderDirection, setOrderDirection] = React.useState<'asc' | 'desc'>('asc');

    React.useEffect(() => {
        setLoading(true);

        const unsubscribe = subscribeToCollaborators((data) => {
            setCollaborators(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    const sortedCollaborators = React.useMemo(() => {
        return [...collaborators].sort((a, b) => {
            const valA = String(a[orderByField] || '').toLowerCase();
            const valB = String(b[orderByField] || '').toLowerCase();

            if (valA < valB) return orderDirection === 'desc' ? -1 : 1;
            if (valA > valB) return orderDirection === 'desc' ? 1 : -1;
            return 0;
        });
    }, [collaborators, orderByField, orderDirection]);

    const handleSort = (field: keyof Collaborator) => {
        const isAsc = orderByField === field && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderByField(field);
    };

    const renderSortIcon = (field: keyof Collaborator) => {
        if (orderByField !== field) return <ArrowDownwardIcon sx={{ fontSize: 14, color: '#D0D5DD' }} />;
        return orderDirection === 'asc'
            ? <ArrowUpwardIcon sx={{ fontSize: 14, color: '#667085' }} />
            : <ArrowDownwardIcon sx={{ fontSize: 14, color: '#667085' }} />;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#00C247' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 10 } }}>
                <Typography variant="h4" color="#101828" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 700 }}>
                    Colaboradores
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/new')}
                    sx={{
                        px: 2.5,
                        py: 1.25,
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        bgcolor: '#00C247',
                        '&:hover': { bgcolor: '#00A83D' },
                        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                        display: { xs: 'none', md: 'flex' }
                    }}
                >
                    Novo Colaborador
                </Button>
            </Box>

            <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate('/new')}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    bgcolor: '#00C247',
                    '&:hover': { bgcolor: '#00A83D' },
                    display: { xs: 'flex', md: 'none' },
                    zIndex: 1000
                }}
            >
                <AddIcon />
            </Fab>

            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
                    borderRadius: '16px',
                    border: '1px solid #EAECF0',
                    overflowX: 'auto'
                }}
            >
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                            <TableCell
                                onClick={() => handleSort('name')}
                                sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Nome {renderSortIcon('name')}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('email')}
                                sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Email {renderSortIcon('email')}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('department')}
                                sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    Departamento {renderSortIcon('department')}
                                </Box>
                            </TableCell>
                            <TableCell
                                align="right"
                                onClick={() => handleSort('status')}
                                sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                    Status {renderSortIcon('status')}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCollaborators.map((collaborator) => (
                            <TableRow key={collaborator.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                            src={collaborator.avatar || getRandomAvatar(collaborator.name)}
                                            sx={{ width: 40, height: 40, bgcolor: '#F2F4F7' }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>
                                            {collaborator.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="#667085">
                                        {collaborator.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="#667085">
                                        {collaborator.department}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        label={collaborator.status === 'active' ? 'Ativo' : 'Inativo'}
                                        size="small"
                                        sx={{
                                            borderRadius: '16px',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            height: '24px',
                                            bgcolor: collaborator.status === 'active' ? '#ECFDF3' : '#FEF3F2',
                                            color: collaborator.status === 'active' ? '#027A48' : '#B42318',
                                            '& .MuiChip-label': { px: 1.5 }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CollaboratorList;
