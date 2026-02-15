import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check as CheckIcon } from '@mui/icons-material';
import { saveCollaborator, getRandomAvatar, getCollaborator, updateCollaborator, subscribeToCollaborators } from '../services/collaboratorService';
import { subscribeToDepartments } from '../services/departmentService';
import type { Collaborator } from '../types/collaborator';
import type { Department } from '../types/department';
import {
    Box,
    Typography,
    Button,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Breadcrumbs,
    Link,
    LinearProgress,
    Avatar,
} from '@mui/material';


const steps = [
    { label: 'Infos Básicas', title: 'Informações Básicas' },
    { label: 'Infos Profissionais', title: 'Informações Profissionais' },
];

const schema = [
    yup.object({
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
        active: yup.boolean().default(true),
    }),
    yup.object({
        departmentId: yup.string().required('Departamento é obrigatório'),
        jobTitle: yup.string().required('Cargo é obrigatório'),
        admissionDate: yup.string().required('Data de admissão é obrigatória'),
        level: yup.string().oneOf(['junior', 'pleno', 'senior', 'manager']).required('Nível é obrigatório'),
        managerId: yup.string().optional(),
        baseSalary: yup.number().typeError('Salário deve ser um número').required('Salário base é obrigatório'),
    }),
];

interface CollaboratorFormData {
    name: string;
    email: string;
    active: boolean;


    departmentId: string;
    jobTitle: string;
    admissionDate: string;
    level: 'junior' | 'pleno' | 'senior' | 'manager';
    managerId?: string;
    baseSalary: number;
}

const CollaboratorForm: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentSchema = schema[activeStep];

    const [departments, setDepartments] = useState<Department[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

    const { control, getValues, setValue, watch, formState: { errors }, trigger } = useForm<CollaboratorFormData>({
        resolver: yupResolver(currentSchema as any),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            active: true,
            departmentId: '',
            jobTitle: '',
            admissionDate: new Date().toISOString().split('T')[0],
            level: 'junior',
            managerId: '',
            baseSalary: 0,
        }
    });

    useEffect(() => {
        const unsubscribeDepts = subscribeToDepartments((data) => setDepartments(data));
        const unsubscribeCollabs = subscribeToCollaborators((data) => setCollaborators(data));
        return () => {
            unsubscribeDepts();
            unsubscribeCollabs();
        }
    }, []);

    useEffect(() => {
        if (id) {
            const loadCollaborator = async () => {
                let data = location.state?.collaborator;

                if (!data) {
                    data = await getCollaborator(id);
                }

                if (data) {
                    setValue('name', data.name);
                    setValue('email', data.email);
                    setValue('active', data.status === 'active');

                    setValue('departmentId', data.departmentId || '');
                    setValue('jobTitle', data.jobTitle || '');
                    setValue('admissionDate', data.admissionDate || '');
                    setValue('level', data.level || 'junior');
                    setValue('managerId', data.managerId || '');
                    setValue('baseSalary', data.baseSalary || 0);
                }
            };
            loadCollaborator();
        }
    }, [id, setValue, location.state]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            if (activeStep === steps.length - 1) {
                try {
                    setIsSubmitting(true);

                    const formData = getValues();
                    const { active, ...data } = formData;
                    const statusVal = active ? 'active' : 'inactive';

                    const selectedDept = departments.find(d => d.id === data.departmentId);
                    const selectedManager = collaborators.find(c => c.id === data.managerId);

                    const collaboratorData: any = {
                        ...data,
                        status: statusVal,
                        departmentName: selectedDept ? selectedDept.name : '',
                        managerName: selectedManager ? selectedManager.name : '',

                    };

                    if (id) {
                        await updateCollaborator(id, collaboratorData);
                    } else {
                        const newCollaborator = {
                            ...collaboratorData,
                            id: '',
                            avatar: getRandomAvatar(data.name),
                            cpf: '', phone: '', cep: '', street: '', number: '', neighborhood: '', city: '', state: ''
                        };
                        delete newCollaborator.id;
                        await saveCollaborator(newCollaborator);
                    }

                    setActiveStep(steps.length);
                    setTimeout(() => navigate('/'), 500);
                } catch (error) {
                    console.error("Error saving collaborator:", error);
                    setIsSubmitting(false);
                }
            } else {
                setActiveStep((prev) => prev + 1);
            }
        }
    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate('/');
        } else {
            setActiveStep((prev) => prev - 1);
        }
    };

    const eligibleManagers = collaborators.filter(c => c.level === 'manager' && c.id !== id);

    return (
        <Box sx={{ p: 4 }}>
            <Breadcrumbs separator={<Typography sx={{ color: '#98A2B3', mx: 0.5, fontWeight: 700 }}>•</Typography>} sx={{ mb: 4 }}>
                <Link underline="hover" color="text.secondary" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    Colaboradores
                </Link>
                <Typography color="#98A2B3" sx={{ fontSize: '14px', fontWeight: 600 }}>
                    {id ? 'Editar Colaborador' : 'Cadastrar Colaborador'}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ position: 'relative', mb: 6 }}>
                <LinearProgress
                    variant={isSubmitting ? "indeterminate" : "determinate"}
                    value={activeStep === steps.length ? 100 : (activeStep === 0 ? 0 : 50)}
                    sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: '#E7F9EE',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#00C247',
                            borderRadius: 2,
                        }
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 } }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 4, minWidth: 200 }}>
                    {steps.map((step, index) => (
                        <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: index <= activeStep ? '#00C247' : '#F2F4F7',
                                    color: index <= activeStep ? 'white' : '#667085',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    border: index === activeStep ? '4px solid #E7F9EE' : 'none',
                                    boxSizing: 'content-box',
                                }}
                            >
                                {index < activeStep ? <CheckIcon sx={{ fontSize: 16 }} /> : index + 1}
                            </Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: index === activeStep ? 700 : 500, color: index === activeStep ? '#1D2939' : '#98A2B3' }}>
                                {step.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ mb: 4, color: '#475467', fontWeight: 700, fontSize: '28px' }}>
                        {steps[Math.min(activeStep, steps.length - 1)].title}
                    </Typography>

                    <Box sx={{ maxWidth: 640 }}>
                        {activeStep === 0 && (
                            <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                                    <Avatar src={getRandomAvatar(watch('name'))} sx={{ width: 100, height: 100, bgcolor: '#F2F4F7' }} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} label="Nome Completo" fullWidth error={!!errors.name} helperText={errors.name?.message} variant="outlined" />
                                        )}
                                    />
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} label="E-mail" fullWidth error={!!errors.email} helperText={errors.email?.message} variant="outlined" />
                                        )}
                                    />
                                    <Controller
                                        name="active"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={<Switch {...field} checked={field.value} color="success" />}
                                                label="Ativo"
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Controller
                                    name="departmentId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} select label="Departamento" fullWidth error={!!errors.departmentId} helperText={errors.departmentId?.message} variant="outlined">
                                            {departments.map(dept => (
                                                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="jobTitle"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Cargo" fullWidth error={!!errors.jobTitle} helperText={errors.jobTitle?.message} variant="outlined" />
                                    )}
                                />
                                <Controller
                                    name="level"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} select label="Nível Hierárquico" fullWidth error={!!errors.level} helperText={errors.level?.message} variant="outlined">
                                            <MenuItem value="junior">Júnior</MenuItem>
                                            <MenuItem value="pleno">Pleno</MenuItem>
                                            <MenuItem value="senior">Sênior</MenuItem>
                                            <MenuItem value="manager">Gestor</MenuItem>
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="admissionDate"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} type="date" label="Data de Admissão" InputLabelProps={{ shrink: true }} fullWidth error={!!errors.admissionDate} helperText={errors.admissionDate?.message} variant="outlined" />
                                    )}
                                />
                                <Controller
                                    name="managerId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} select label="Gestor Responsável" fullWidth error={!!errors.managerId} helperText={errors.managerId?.message} variant="outlined">
                                            <MenuItem value="">Nenhum</MenuItem>
                                            {eligibleManagers.map(m => (
                                                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                                <Controller
                                    name="baseSalary"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} type="number" label="Salário Base" fullWidth error={!!errors.baseSalary} helperText={errors.baseSalary?.message} variant="outlined" />
                                    )}
                                />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10 }}>
                            <Button onClick={handleBack} sx={{ color: '#98A2B3', fontWeight: 700 }}>Voltar</Button>
                            <Button onClick={handleNext} variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#00C247', borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#00A83D' } }}>
                                {isSubmitting ? 'Salvando...' : (activeStep === steps.length - 1 ? 'Concluir' : 'Próximo')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CollaboratorForm;
