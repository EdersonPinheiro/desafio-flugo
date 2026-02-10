import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check as CheckIcon } from '@mui/icons-material';
import { saveCollaborator, getRandomAvatar } from '../services/collaboratorService';
import type { Collaborator } from '../types/collaborator';

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
        department: yup.string().required('Departamento é obrigatório'),
    }),
];


interface CollaboratorFormData {
    name: string;
    email: string;
    active: boolean;
    department: string;
}

const CollaboratorForm: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const currentSchema = schema[activeStep];

    const { control, getValues, formState: { errors }, trigger } = useForm<CollaboratorFormData>({
        resolver: yupResolver(currentSchema as any),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            active: true,
            department: '',
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            if (activeStep === steps.length - 1) {
                try {
                    setIsSubmitting(true);
                    const { active, ...data } = getValues();
                    const newCollaborator: Omit<Collaborator, 'id'> = {
                        ...data,
                        status: active ? 'active' : 'inactive',
                        avatar: getRandomAvatar(data.name),
                        admissionDate: new Date().toISOString().split('T')[0],
                        position: 'Colaborador',
                        cpf: '', phone: '', cep: '', street: '', number: '', neighborhood: '', city: '', state: ''
                    };
                    await saveCollaborator(newCollaborator);

                    setActiveStep(steps.length);

                    setTimeout(() => {
                        navigate('/');
                    }, 500);
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

    return (
        <Box sx={{ p: 4 }}>

            <Breadcrumbs separator={<Typography sx={{ color: '#98A2B3', mx: 0.5, fontWeight: 700 }}>•</Typography>} sx={{ mb: 4 }}>
                <Link underline="hover" color="text.secondary" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    Colaboradores
                </Link>
                <Typography color="#98A2B3" sx={{ fontSize: '14px', fontWeight: 600 }}>
                    Cadastrar Colaborador
                </Typography>
            </Breadcrumbs>


            <Box sx={{ position: 'relative', mb: 6 }}>
                <LinearProgress
                    variant="determinate"
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
                <Typography
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        right: -30,
                        top: -8,
                        color: '#98A2B3',
                        fontWeight: 500
                    }}
                >
                    {activeStep === steps.length ? '100%' : (activeStep === 0 ? '0%' : '50%')}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 8 }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', minWidth: 200 }}>
                    {steps.map((step, index) => (
                        <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
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
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: index === activeStep ? 700 : 500,
                                    color: index === activeStep ? '#1D2939' : '#98A2B3',
                                }}
                            >
                                {step.label}
                            </Typography>
                        </Box>
                    ))}

                    <Box
                        sx={{
                            position: 'absolute',
                            left: 19,
                            top: 40,
                            bottom: 10,
                            width: 1,
                            bgcolor: '#F2F4F7',
                            zIndex: 0,
                        }}
                    />
                </Box>


                <Box sx={{ flex: 1, pt: 0.5 }}>
                    <Typography variant="h4" sx={{ mb: 4, color: '#475467', fontWeight: 700, fontSize: '28px' }}>
                        {steps[Math.min(activeStep, steps.length - 1)].title}
                    </Typography>

                    <Box sx={{ maxWidth: 640 }}>
                        {activeStep === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Título"
                                            placeholder="João da Silva"
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
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="E-mail"
                                            placeholder="e.g. john@gmail.com"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
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
                                <Box sx={{ mt: 1 }}>
                                    <Controller
                                        name="active"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        {...field}
                                                        checked={field.value}
                                                        color="success"
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#00C247' },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00C247' },
                                                        }}
                                                    />
                                                }
                                                label={<Typography sx={{ fontSize: '14px', color: '#475467' }}>Ativar ao criar</Typography>}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Selecione um departamento"
                                            fullWidth
                                            error={!!errors.department}
                                            helperText={errors.department?.message}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    '&.Mui-focused fieldset': { borderColor: '#00C247' },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': { color: '#00C247' },
                                            }}
                                        >
                                            <MenuItem value="Design">Design</MenuItem>
                                            <MenuItem value="TI">TI</MenuItem>
                                            <MenuItem value="Marketing">Marketing</MenuItem>
                                            <MenuItem value="Produto">Produto</MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Box>
                        )}


                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 10 }}>
                            <Button
                                onClick={handleBack}
                                sx={{
                                    color: '#98A2B3',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    '&:hover': { bgcolor: 'transparent', color: '#667085' }
                                }}
                            >
                                Voltar
                            </Button>
                            <Button
                                onClick={handleNext}
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

