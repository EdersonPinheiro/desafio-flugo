import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Department } from '../types/department';
import type { Collaborator } from '../types/collaborator';
import { subscribeToDepartments, deleteDepartment } from '../services/departmentService';
import { subscribeToCollaborators } from '../services/collaboratorService';
import { DepartmentTable } from '../components/DepartmentTable';

const DepartmentList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

    useEffect(() => {
        setLoading(true);
        const unsubscribeDepts = subscribeToDepartments((data) => {
            setDepartments(data);
        });
        const unsubscribeCollabs = subscribeToCollaborators((data) => {
            setCollaborators(data);
            setLoading(false);
        });

        return () => {
            unsubscribeDepts();
            unsubscribeCollabs();
        };
    }, []);

    const handleDelete = async (id: string, name: string) => {
        const hasCollaborators = collaborators.some(c => c.departmentId === id);

        if (hasCollaborators) {
            alert(`Não é possível excluir o departamento "${name}" pois existem colaboradores vinculados a ele.`);
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir o departamento "${name}"?`)) {
            try {
                await deleteDepartment(id);
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Erro ao excluir departamento");
            }
        }
    };

    if (loading && departments.length === 0) {
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
                    Departamentos
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/departments/new')}
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
                    Novo Departamento
                </Button>
            </Box>

            <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate('/departments/new')}
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

            <DepartmentTable
                departments={departments}
                collaborators={collaborators}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/departments/edit/${id}`, { state: { department: departments.find(d => d.id === id) } })}
            />
        </Box>
    );
};

export default DepartmentList;
