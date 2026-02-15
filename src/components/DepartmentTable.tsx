import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { Department } from '../types/department';
import type { Collaborator } from '../types/collaborator';

interface DepartmentTableProps {
    departments: Department[];
    collaborators?: Collaborator[];
    onDelete: (id: string, name: string) => void;
    onEdit: (id: string) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
    departments,
    collaborators = [],
    onDelete,
    onEdit
}) => {
    return (
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
                        <TableCell sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem' }}>Nome</TableCell>
                        <TableCell sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem' }}>Gestor Responsável</TableCell>
                        <TableCell sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem' }}>Colaboradores</TableCell>
                        <TableCell align="right" sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem' }}>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departments.map((dept) => (
                        <TableRow
                            key={dept.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => onEdit(dept.id!)}
                        >
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>
                                    {dept.name}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="#667085">
                                    {dept.managerName || '-'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="#667085">
                                    {collaborators.filter(c => c.departmentId === dept.id).length}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(dept.id!, dept.name); }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {departments.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Nenhum departamento encontrado
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
