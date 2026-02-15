import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Add as AddIcon } from '@mui/icons-material';
import { saveDepartment, getDepartment, updateDepartment } from '../services/departmentService';
import { subscribeToCollaborators, getRandomAvatar, updateCollaborator } from '../services/collaboratorService';
import type { Collaborator } from '../types/collaborator';
import {
    Box,
    Typography,
    Button,
    TextField,
    MenuItem,
    Breadcrumbs,
    Link,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Autocomplete
} from '@mui/material';


const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    managerId: yup.string().optional(),
});

interface DepartmentFormData {
    name: string;
    managerId: string | undefined;
}

const DepartmentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [departmentCollaborators, setDepartmentCollaborators] = useState<Collaborator[]>([]);
    const [selectedCollaboratorToAdd, setSelectedCollaboratorToAdd] = useState<Collaborator | null>(null);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<DepartmentFormData>({
        resolver: yupResolver(schema) as unknown as Resolver<DepartmentFormData>,
        defaultValues: {
            name: '',
            managerId: '',
        }
    });

    useEffect(() => {
        const unsubscribe = subscribeToCollaborators((data) => {
            setCollaborators(data);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchDepartment = async () => {
                let data = location.state?.department;
                if (!data) {
                    data = await getDepartment(id);
                }

                if (data) {
                    setValue('name', data.name);
                    setValue('managerId', data.managerId || '');
                }
            };
            fetchDepartment();
        }
    }, [id, setValue, location.state]);

    useEffect(() => {
        if (id && collaborators.length > 0) {
            const deptCollabs = collaborators.filter(c => c.departmentId === id);
            setDepartmentCollaborators(deptCollabs);
        }
    }, [id, collaborators]);

    const onSubmit = async (data: DepartmentFormData) => {
        try {
            setIsSubmitting(true);
            const manager = collaborators.find(c => c.id === data.managerId);
            const departmentData = {
                name: data.name,
                managerId: data.managerId || '',
                managerName: manager ? manager.name : '',
                collaboratorIds: departmentCollaborators.map(c => c.id!).filter(Boolean)
            };

            let deptId = id;

            if (id) {
                await updateDepartment(id, departmentData);
            } else {
                deptId = await saveDepartment(departmentData);
            }

            const updatePromises = departmentCollaborators.map(c => {
                if (c.departmentId !== deptId) {
                    return updateCollaborator(c.id!, { departmentId: deptId!, departmentName: data.name });
                }
                return Promise.resolve();
            });
            await Promise.all(updatePromises);



            setTimeout(() => {
                navigate('/departments');
            }, 500);
        } catch (error) {
            console.error("Error saving department:", error);
            setIsSubmitting(false);
        }
    };

    const handleAddCollaborator = () => {
        if (selectedCollaboratorToAdd) {
            if (!departmentCollaborators.some(c => c.id === selectedCollaboratorToAdd.id)) {
                setDepartmentCollaborators([...departmentCollaborators, selectedCollaboratorToAdd]);
            }
            setSelectedCollaboratorToAdd(null);
        }
    };

    const eligibleManagers = collaborators.filter(c => c.level === 'manager');


    return (
        <Box sx={{ p: 4 }}>
            <Breadcrumbs separator={<Typography sx={{ color: '#98A2B3', mx: 0.5, fontWeight: 700 }}>•</Typography>} sx={{ mb: 4 }}>
                <Link underline="hover" color="text.secondary" onClick={() => navigate('/departments')} sx={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    Departamentos
                </Link>
                <Typography color="#98A2B3" sx={{ fontSize: '14px', fontWeight: 600 }}>
                    {id ? 'Editar Departamento' : 'Novo Departamento'}
                </Typography>
            </Breadcrumbs>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome do Departamento"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused fieldset': { borderColor: '#00C247' },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#00C247' },
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Gestor Responsável"
                                fullWidth
                                error={!!errors.managerId}
                                helperText={errors.managerId?.message}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused fieldset': { borderColor: '#00C247' },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#00C247' },
                                }}
                            >
                                <MenuItem value="">Selectione um gestor</MenuItem>
                                {eligibleManagers.map((collab) => (
                                    <MenuItem key={collab.id} value={collab.id}>{collab.name}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Box>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#475467' }}>
                    Colaboradores
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Autocomplete
                        options={collaborators.filter(c => !departmentCollaborators.some(dc => dc.id === c.id))}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        value={selectedCollaboratorToAdd}
                        onChange={(_event, newValue) => setSelectedCollaboratorToAdd(newValue)}
                        renderInput={(params) => <TextField {...params} label="Adicionar Colaborador" variant="outlined" size="small" />}
                        renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                                <li key={key} {...otherProps}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                                        {option.name} ({option.departmentName || 'Sem Dept'})
                                    </Box>
                                </li>
                            )
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCollaborator}
                        disabled={!selectedCollaboratorToAdd}
                        sx={{
                            bgcolor: '#344054',
                            '&:hover': { bgcolor: '#475467' },
                            textTransform: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        Adicionar
                    </Button>
                </Box>

                <List sx={{ bgcolor: '#F9FAFB', borderRadius: '12px', mb: 4, border: '1px solid #EAECF0' }}>
                    {departmentCollaborators.length === 0 ? (
                        <ListItem><ListItemText primary="Nenhum colaborador neste departamento" sx={{ color: '#98A2B3', textAlign: 'center' }} /></ListItem>
                    ) : (
                        departmentCollaborators.map((collab) => (
                            <ListItem key={collab.id}>
                                <ListItemAvatar>
                                    <Avatar src={collab.avatar || getRandomAvatar(collab.name)} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={collab.name}
                                    secondary={collab.email}
                                />

                            </ListItem>
                        ))
                    )}
                </List>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        onClick={() => navigate('/departments')}
                        sx={{
                            color: '#98A2B3',
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '16px',
                            '&:hover': { bgcolor: 'transparent', color: '#667085' }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: '#00C247',
                            borderRadius: '12px',
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#00A83D' }
                        }}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DepartmentForm;
