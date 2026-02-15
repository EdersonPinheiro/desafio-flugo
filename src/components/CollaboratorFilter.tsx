import React from 'react';
import { Paper, Grid, TextField, MenuItem, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { Department } from '../types/department';

interface Filters {
    name: string;
    email: string;
    departmentId: string;
}

interface CollaboratorFilterProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    departments: Department[];
    selectedCount: number;
    onBulkDelete: () => void;
}

export const CollaboratorFilter: React.FC<CollaboratorFilterProps> = ({
    filters,
    setFilters,
    departments,
    selectedCount,
    onBulkDelete
}) => {
    return (
        <Paper sx={{ mb: 3, p: 2, borderRadius: '12px', boxShadow: 'none', border: '1px solid #EAECF0' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                        label="Nome"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                        select
                        label="Departamento"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={filters.departmentId}
                        onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {selectedCount > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={onBulkDelete}
                            sx={{ borderRadius: '8px' }}
                        >
                            Excluir ({selectedCount})
                        </Button>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};
