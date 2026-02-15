import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Collaborator } from '../types/collaborator';
import { subscribeToCollaborators, deleteCollaborator, deleteCollaborators } from '../services/collaboratorService';
import { subscribeToDepartments } from '../services/departmentService';
import type { Department } from '../types/department';
import { CollaboratorFilter } from '../components/CollaboratorFilter';
import { CollaboratorTable } from '../components/CollaboratorTable';

const CollaboratorList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [orderByField, setOrderByField] = useState<keyof Collaborator>('name');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

    const [filters, setFilters] = useState({
        name: '',
        email: '',
        departmentId: ''
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        setLoading(true);

        const unsubscribeCollabs = subscribeToCollaborators((data) => {
            setCollaborators(data);
            setLoading(false);
        });

        const unsubscribeDepts = subscribeToDepartments((data) => {
            setDepartments(data);
        });

        return () => {
            unsubscribeCollabs();
            unsubscribeDepts();
        };
    }, []);

    const handleSort = (field: keyof Collaborator) => {
        const isAsc = orderByField === field && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderByField(field);
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(filteredCollaborators.map(c => c.id!).filter(Boolean));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        setSelectedIds(newSelected);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
            try {
                await deleteCollaborator(id);
                setSelectedIds(prev => prev.filter(sid => sid !== id));
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Erro ao excluir");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Tem certeza que deseja excluir ${selectedIds.length} colaboradores?`)) {
            try {
                await deleteCollaborators(selectedIds);
                setSelectedIds([]);
            } catch (error) {
                console.error("Failed to bulk delete", error);
                alert("Erro ao excluir em massa");
            }
        }
    };

    const filteredCollaborators = useMemo(() => {
        return collaborators.filter(c => {
            const matchesName = c.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesEmail = c.email.toLowerCase().includes(filters.email.toLowerCase());
            const matchesDept = filters.departmentId ? c.departmentId === filters.departmentId : true;
            return matchesName && matchesEmail && matchesDept;
        });
    }, [collaborators, filters]);

    const sortedCollaborators = useMemo(() => {
        return [...filteredCollaborators].sort((a, b) => {
            const valA = String(a[orderByField] || '').toLowerCase();
            const valB = String(b[orderByField] || '').toLowerCase();

            if (valA < valB) return orderDirection === 'desc' ? -1 : 1;
            if (valA > valB) return orderDirection === 'desc' ? 1 : -1;
            return 0;
        });
    }, [filteredCollaborators, orderByField, orderDirection]);

    if (loading && collaborators.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#00C247' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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

            <CollaboratorFilter
                filters={filters}
                setFilters={setFilters}
                departments={departments}
                selectedCount={selectedIds.length}
                onBulkDelete={handleBulkDelete}
            />

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

            <CollaboratorTable
                collaborators={sortedCollaborators}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onSort={handleSort}
                orderByField={orderByField}
                orderDirection={orderDirection}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/edit/${id}`, { state: { collaborator: collaborators.find(c => c.id === id) } })}
            />
        </Box>
    );
};

export default CollaboratorList;
