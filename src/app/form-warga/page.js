'use client'

import { Box, TextField, MenuItem, Container, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function FormWarga() {

    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        nik: '',
        nama_lengkap: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        pendidikan: '',
        pekerjaan: '',
        pekerjaanLainnya: '', // State baru untuk pekerjaan manual
        agama: '',
        status_pernikahan: '',
        kewarganegaraan: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setShowAlert(true)

        try {
            // Prepare the data
            const submitData = { ...formData }
            if (submitData.pekerjaan === 'Lainnya') {
                submitData.pekerjaan = submitData.pekerjaanLainnya
            }
            delete submitData.pekerjaanLainnya

            const response = await fetch('http://bontomanai.inesa.id/api/warga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            })

            if (!response.ok) {
                throw new Error('Gagal mengirim data')
            }

            // Reset form after successful submission
            setFormData({
                nik: '',
                nama_lengkap: '',
                tempat_lahir: '',
                tanggal_lahir: '',
                jenis_kelamin: '',
                pendidikan: '',
                pekerjaan: '',
                pekerjaanLainnya: '',
                agama: '',
                status_pernikahan: '',
                kewarganegaraan: ''
            })
            setShowAlert(false)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-warga-bg">

        <Container maxWidth="xl">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: '100%',
                    width: '100%',
                    mx: 'auto',
                    my: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: 4,
                        fontWeight: 'bold',
                        color: '#1a237e',
                        textAlign: 'center'
                    }}
                >
                    Tambah Data Warga
                </Typography>

                <TextField
                    label="NIK"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    inputProps={{ maxLength: 16, pattern: '[0-9]*' }}
                    disabled={loading}
                    error={showAlert && !formData.nik}
                    helperText={showAlert && !formData.nik ? 'NIK wajib diisi' : ''}
                />
                <TextField
                    label="Nama Lengkap"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.nama_lengkap}
                    helperText={showAlert && !formData.nama_lengkap ? 'Nama wajib diisi' : ''}
                />
                <TextField
                    label="Tempat Lahir"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.tempat_lahir}
                    helperText={showAlert && !formData.tempat_lahir ? 'Tempat lahir wajib diisi' : ''}
                />
                <TextField
                    label="Tanggal Lahir"
                    name="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                    error={showAlert && !formData.tanggal_lahir}
                    helperText={showAlert && !formData.tanggal_lahir ? 'Tanggal lahir wajib diisi' : ''}
                />
                <TextField
                    label="Jenis Kelamin"
                    name="jenis_kelamin"
                    select
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.jenis_kelamin}
                    helperText={showAlert && !formData.jenis_kelamin ? 'Jenis kelamin wajib diisi' : ''}
                >
                    <MenuItem value="Laki-laki">Laki-laki</MenuItem>
                    <MenuItem value="Perempuan">Perempuan</MenuItem>
                </TextField>
                <TextField
                    label="Pendidikan"
                    name="pendidikan"
                    select
                    value={formData.pendidikan}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.pendidikan}
                    helperText={showAlert && !formData.pendidikan ? 'Pendidikan wajib diisi' : ''}
                >
                    <MenuItem value="Tidak Sekolah">Tidak Sekolah</MenuItem>
                    <MenuItem value="SD">SD</MenuItem>
                    <MenuItem value="SMP">SMP</MenuItem>
                    <MenuItem value="SMA">SMA</MenuItem>
                    <MenuItem value="SMK">SMK</MenuItem>
                    <MenuItem value="D1">D1</MenuItem>
                    <MenuItem value="D2">D2</MenuItem>
                    <MenuItem value="D3">D3</MenuItem>
                    <MenuItem value="S1">S1</MenuItem>
                    <MenuItem value="S2">S2</MenuItem>
                    <MenuItem value="S3">S3</MenuItem>
                </TextField>
                <TextField
                    label="Pekerjaan"
                    name="pekerjaan"
                    select
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.pekerjaan}
                    helperText={showAlert && !formData.pekerjaan ? 'Pekerjaan wajib diisi' : ''}
                >
                    <MenuItem value="Belum Bekerja">Belum Bekerja</MenuItem>
                    <MenuItem value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</MenuItem>
                    <MenuItem value="Petani">Petani</MenuItem>
                    <MenuItem value="Nelayan">Nelayan</MenuItem>
                    <MenuItem value="PNS">PNS</MenuItem>
                    <MenuItem value="TNI/Polri">TNI/Polri</MenuItem>
                    <MenuItem value="Karyawan Swasta">Karyawan Swasta</MenuItem>
                    <MenuItem value="Wiraswasta">Wiraswasta</MenuItem>
                    <MenuItem value="Buruh">Buruh</MenuItem>
                    <MenuItem value="Pensiunan">Pensiunan</MenuItem>
                    <MenuItem value="Ibu Rumah Tangga">Ibu Rumah Tangga</MenuItem>
                    <MenuItem value="Lainnya">Lainnya</MenuItem>
                </TextField>
                {formData.pekerjaan === 'Lainnya' && (
                    <TextField
                        label="Pekerjaan Lainnya"
                        name="pekerjaanLainnya"
                        value={formData.pekerjaanLainnya}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="normal"
                        disabled={loading}
                        error={showAlert && !formData.pekerjaanLainnya}
                        helperText={showAlert && !formData.pekerjaanLainnya ? 'Pekerjaan lainnya wajib diisi' : ''}
                    />
                )}
                <TextField
                    label="Agama"
                    name="agama"
                    select
                    value={formData.agama}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.agama}
                    helperText={showAlert && !formData.agama ? 'Agama wajib diisi' : ''}
                >
                    <MenuItem value="Islam">Islam</MenuItem>
                    <MenuItem value="Kristen">Kristen</MenuItem>
                    <MenuItem value="Katolik">Katolik</MenuItem>
                    <MenuItem value="Hindu">Hindu</MenuItem>
                    <MenuItem value="Buddha">Buddha</MenuItem>
                    <MenuItem value="Konghucu">Konghucu</MenuItem>
                </TextField>
                <TextField
                    label="Status Pernikahan"
                    name="status_pernikahan"
                    select
                    value={formData.status_pernikahan}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.status_pernikahan}
                    helperText={showAlert && !formData.status_pernikahan ? 'Status pernikahan wajib diisi' : ''}
                >
                    <MenuItem value="Belum Menikah">Belum Menikah</MenuItem>
                    <MenuItem value="Menikah">Menikah</MenuItem>
                    <MenuItem value="Cerai Mati">Cerai Mati</MenuItem>
                    <MenuItem value="Cerai Hidup">Cerai Hidup</MenuItem>
                </TextField>
                <TextField
                    label="Kewarganegaraan"
                    name="kewarganegaraan"
                    select
                    value={formData.kewarganegaraan}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={loading}
                    error={showAlert && !formData.kewarganegaraan}
                    helperText={showAlert && !formData.kewarganegaraan ? 'Kewarganegaraan wajib diisi' : ''}
                >
                    <MenuItem value="WNI">WNI</MenuItem>
                    <MenuItem value="WNA">WNA</MenuItem>
                </TextField>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        mt: 4,
                        bgcolor: '#1a237e',
                        '&:hover': {
                            bgcolor: '#0d47a1'
                        },
                        fontSize: '1.1rem',
                        py: 1.5
                    }}
                >
                    {loading ? 'Mengirim...' : 'Kirim'}
                </Button>
            </Box>
        </Container>
        </div>
    );
}