import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    Group as FamilyIcon,
    Woman as WomanIcon,
    Man as ManIcon
} from '@mui/icons-material';

const StatistikPenduduk = () => {
    const dataPenduduk = [
        {
            label: "TOTAL PENDUDUK",
            value: "3.882 Jiwa",
            icon: <PeopleIcon fontSize="large" />,
            color: "primary.main"
        },
        {
            label: "KEPALA KELUARGA",
            value: "1.096 Jiwa",
            icon: <FamilyIcon fontSize="large" />,
            color: "secondary.main"
        },
        {
            label: "PEREMPUAN",
            value: "1.938 Jiwa",
            icon: <WomanIcon fontSize="large" />,
            color: "error.main"
        },
        {
            label: "LAKI-LAKI",
            value: "1.944 Jiwa",
            icon: <ManIcon fontSize="large" />,
            color: "info.main"
        }
    ];

    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            my: 4,
            p: 3
        }}>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 3,
                    color: 'primary.dark'
                }}
            >
                Jumlah Penduduk dan Kepala Keluarga
            </Typography>

            <Grid container spacing={3}>
                {dataPenduduk.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                height: '100%',
                                borderLeft: `4px solid`,
                                borderColor: item.color,
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)'
                                }
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Box sx={{
                                    color: item.color,
                                    mr: 2
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="h3"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    mt: 2,
                                    color: item.color
                                }}
                            >
                                {item.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StatistikPenduduk;