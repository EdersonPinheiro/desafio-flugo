import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Checkbox,
    IconButton,
} from '@mui/material';
import {
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Collaborator } from '../types/collaborator';
import { getRandomAvatar } from '../services/collaboratorService';

interface CollaboratorTableProps {
    collaborators: Collaborator[];
    selectedIds: string[];
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (id: string) => void;
    onSort: (field: keyof Collaborator) => void;
    orderByField: keyof Collaborator;
    orderDirection: 'asc' | 'desc';
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    loading?: boolean;
}

export const CollaboratorTable: React.FC<CollaboratorTableProps> = ({
    collaborators,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onSort,
    orderByField,
    orderDirection,
    onDelete,
    onEdit
}) => {

    const renderSortIcon = (field: keyof Collaborator) => {
        if (orderByField !== field) return <ArrowDownwardIcon sx={{ fontSize: 14, color: '#D0D5DD' }} />;
        return orderDirection === 'asc'
            ? <ArrowUpwardIcon sx={{ fontSize: 14, color: '#667085' }} />
            : <ArrowDownwardIcon sx={{ fontSize: 14, color: '#667085' }} />;
    };

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
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={selectedIds.length > 0 && selectedIds.length < collaborators.length}
                                checked={collaborators.length > 0 && selectedIds.length === collaborators.length}
                                onChange={onSelectAll}
                            />
                        </TableCell>
                        <TableCell
                            onClick={() => onSort('name')}
                            sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Nome {renderSortIcon('name')}
                            </Box>
                        </TableCell>
                        <TableCell
                            onClick={() => onSort('email')}
                            sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Email {renderSortIcon('email')}
                            </Box>
                        </TableCell>
                        <TableCell
                            onClick={() => onSort('departmentId')}
                            sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                Departamento {renderSortIcon('departmentId')}
                            </Box>
                        </TableCell>
                        <TableCell
                            align="right"
                            onClick={() => onSort('status')}
                            sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                Status {renderSortIcon('status')}
                            </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#667085', fontWeight: 600, fontSize: '0.75rem' }}>
                            Ações
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collaborators.map((collaborator) => {
                        const isSelected = selectedIds.indexOf(collaborator.id!) !== -1;
                        return (
                            <TableRow
                                key={collaborator.id}
                                hover
                                selected={isSelected}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer'
                                }}
                                onClick={() => onEdit(collaborator.id!)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isSelected}
                                        onChange={() => onSelectOne(collaborator.id!)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </TableCell>
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
                                        {collaborator.departmentName || collaborator.department || 'N/A'}
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
                                <TableCell align="right">
                                    <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(collaborator.id!); }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {collaborators.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Nenhum colaborador encontrado
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
