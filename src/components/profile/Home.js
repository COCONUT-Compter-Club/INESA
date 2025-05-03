'use client'

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Description as DescriptionIcon, Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import './styles.css';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

const Notification = ({ pesan, tipe, onTutup }) => {
  useEffect(() => {
    const timer = setTimeout(onTutup, 3000);
    return () => clearTimeout(timer);
  }, [onTutup]);

  const getBackgroundColor = () => {
    switch (tipe) {
      case 'sukses': return '#10b981';
      case 'error': return '#ef4444';
      case 'peringatan': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        transform: 'translateX(-50%)',
        zIndex: 50,
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '400px',
        width: '90%',
        minWidth: '200px',
        fontSize: '0.875rem',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      role="alert"
    >
      <Typography variant="body1" fontWeight="medium">{pesan}</Typography>
      <IconButton onClick={onTutup} sx={{ color: 'white', '&:hover': { color: '#d1d5db' } }}>
        <CloseIcon fontSize="medium" />
      </IconButton>
    </motion.div>
  );
};

const letterFields = {
  'Surat Keterangan Tidak Mampu': [
    { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
    { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
    { name: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Masukkan Pekerjaan', required: true },
    { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true, required: true, multiline: true, rows: 2 },
    { name: 'keperluan', label: 'Keperluan', type: 'text', placeholder: 'Masukkan Keperluan', required: true },
    { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  ],
  'Surat Keterangan Usaha': [
    { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
    { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
    { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true, required: true, multiline: true, rows: 2 },
    { name: 'nama_usaha', label: 'Nama Usaha', type: 'text', placeholder: 'Masukkan Nama Usaha', required: true },
    { name: 'jenis_usaha', label: 'Jenis Usaha', type: 'select', placeholder: 'Pilih Jenis Usaha', required: true, options: [
      { value: '', label: 'Pilih jenis usaha' },
      { value: 'Perdagangan', label: 'Perdagangan' },
      { value: 'Jasa', label: 'Jasa' },
      { value: 'Kuliner', label: 'Kuliner' },
      { value: 'Manufaktur', label: 'Manufaktur' },
      { value: 'Pertanian', label: 'Pertanian' },
      { value: 'Lainnya', label: 'Lainnya' },
    ]},
    { name: 'alamat_usaha', label: 'Alamat Usaha', type: 'text', placeholder: 'Masukkan Alamat Usaha', required: true, multiline: true, rows: 2 },
    { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  ],
  'Surat Keterangan Domisili': [
    { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
    { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
    { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true, required: true, multiline: true, rows: 2 },
    { name: 'status_pernikahan', label: 'Status Pernikahan', type: 'select', placeholder: 'Pilih Status Pernikahan', required: true, options: [
      { value: '', label: 'Pilih status' },
      { value: 'Belum Menikah', label: 'Belum Menikah' },
      { value: 'Menikah', label: 'Menikah' },
      { value: 'Cerai Mati', label: 'Cerai Mati' },
      { value: 'Cerai Hidup', label: 'Cerai Hidup' },
    ]},
    { name: 'lama_tinggal', label: 'Lama Tinggal (bulan)', type: 'number', placeholder: 'Masukkan Lama Tinggal', required: true },
    { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  ],
  'Surat Keterangan Pindah': [
    { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
    { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
    { name: 'alamat_lengkap', label: 'Alamat Asal', type: 'text', placeholder: 'Masukkan Alamat Asal', disabled: true, required: true, multiline: true, rows: 2 },
    { name: 'alamat_tujuan', label: 'Alamat Tujuan', type: 'text', placeholder: 'Masukkan Alamat Tujuan', required: true, multiline: true, rows: 2 },
    { name: 'alasan_pindah', label: 'Alasan Pindah', type: 'select', placeholder: 'Pilih Alasan Pindah', required: true, options: [
      { value: '', label: 'Pilih alasan pindah' },
      { value: 'Pekerjaan', label: 'Pekerjaan' },
      { value: 'Pendidikan', label: 'Pendidikan' },
      { value: 'Keluarga', label: 'Keluarga' },
      { value: 'Kesehatan', label: 'Kesehatan' },
      { value: 'Lainnya', label: 'Lainnya' },
    ]},
    { name: 'keperluan', label: 'Keperluan', type: 'text', placeholder: 'Masukkan Keperluan', required: true },
    { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  ],
  'Surat Pengantar': [
    { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
    { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
    { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true, required: true, multiline: true, rows: 2 },
    { name: 'keperluan', label: 'Keperluan', type: 'text', placeholder: 'Masukkan Keperluan', required: true },
    { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  ],
  // 'Surat Keterangan Kelahiran': [
  //   { name: 'nama_lengkap', label: 'Nama Anak', type: 'text', placeholder: 'Masukkan Nama Anak', required: true },
  //   { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', placeholder: 'Pilih Jenis Kelamin', required: true, options: [
  //     { value: '', label: 'Pilih jenis kelamin' },
  //     { value: 'Laki-laki', label: 'Laki-laki' },
  //     { value: 'Perempuan', label: 'Perempuan' },
  //   ]},
  //   { name: 'tempat_lahir', label: 'Tempat Lahir Anak', type: 'text', placeholder: 'Masukkan Tempat Lahir', required: true },
  //   { name: 'tanggal_lahir', label: 'Tanggal Lahir Anak', type: 'date', placeholder: 'Pilih Tanggal Lahir', required: true },
  //   { name: 'nama_ayah', label: 'Nama Ayah', type: 'text', placeholder: 'Masukkan Nama Ayah', required: true },
  //   { name: 'nama_ibu', label: 'Nama Ibu', type: 'text', placeholder: 'Masukkan Nama Ibu', required: true },
  //   { name: 'alamat_lengkap', label: 'Alamat Orang Tua', type: 'text', placeholder: 'Masukkan Alamat Orang Tua', required: true, multiline: true, rows: 2 },
  //   { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
  //   { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  // ],
  // 'Surat Keterangan Kematian': [
  //   { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true, required: true },
  //   { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true, required: true },
  //   { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true, required: true },
  //   { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true, required: true },
  //   { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true, required: true, multiline: true, rows: 2 },
  //   { name: 'tgl_kematian', label: 'Tanggal Kematian', type: 'date', placeholder: 'Pilih Tanggal Kematian', required: true },
  //   { name: 'penyebab_kematian', label: 'Penyebab Kematian', type: 'text', placeholder: 'Masukkan Penyebab Kematian', required: true },
  //   { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP', required: true },
  //   { name: 'keterangan', label: 'Keterangan', type: 'text', placeholder: 'Masukkan Keterangan', required: true },
  // ],
};

const Home = () => {
  const initialFormData = {
    nik: '',
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    pekerjaan: '',
    alamat_lengkap: '',
    pendidikan: '',
    kewarganegaraan: 'WNI',
    jenis_surat: '',
    penghasilan: '',
    status_pernikahan: '',
    lama_tinggal: '',
    nomor_hp: '',
    keterangan: '',
    nama_usaha: '',
    jenis_usaha: '',
    alamat_usaha: '',
    alamat_tujuan: '',
    alasan_pindah: '',
    keperluan_pindah: '',
    tujuan_pindah: '',
    nama_ayah: '',
    nama_ibu: '',
    tujuan_surat: '',
    tgl_kematian: '',
    penyebab_kematian: '',
    keperluan: '',
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [sedangMencariNIK, setSedangMencariNIK] = useState(false);
  const [notifikasi, setNotifikasi] = useState(null);
  const [nikTerdaftar, setNikTerdaftar] = useState(undefined);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setNikTerdaftar(undefined);
    setNotifikasi(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateNIK = (nik) => /^\d{16}$/.test(nik);

  const validatePhoneNumber = (nomor_hp) => /^\+?[1-9]\d{9,14}$/.test(nomor_hp);

  const validateForm = (data) => {
    if (!data.jenis_surat) return 'Jenis surat harus dipilih';
    const fields = letterFields[data.jenis_surat] || [];
    for (const field of fields) {
      if (field.required && !data[field.name]) {
        return `Kolom ${field.label} harus diisi`;
      }
    }
    if (data.nik && !validateNIK(data.nik)) return 'NIK harus 16 digit angka';
    if (data.lama_tinggal && Number(data.lama_tinggal) < 6) return 'Lama tinggal minimal 6 bulan';
    if (data.nomor_hp && !validatePhoneNumber(data.nomor_hp)) {
      return 'Nomor HP tidak valid (contoh: +6281234567890)';
    }
    if (data.tanggal_lahir) {
      const today = new Date();
      const birthDate = new Date(data.tanggal_lahir);
      if (birthDate > today) return 'Tanggal lahir tidak boleh di masa depan';
    }
    if (data.tgl_kematian) {
      const today = new Date();
      const deathDate = new Date(data.tgl_kematian);
      if (deathDate > today) return 'Tanggal kematian tidak boleh di masa depan';
    }
    return null;
  };

  const searchDataByNIK = async (nik) => {
    if (!nik || !validateNIK(nik)) {
      setNotifikasi({ pesan: 'NIK harus 16 digit angka', tipe: 'error' });
      setNikTerdaftar(false);
      return;
    }
    setSedangMencariNIK(true);
    try {
      const response = await fetch(`http://192.168.1.85:8080/api/request/warga/${nik}`);
      const responseText = await response.text();
      if (!response.ok) {
        if (response.status === 404) {
          setNikTerdaftar(false);
          setNotifikasi({
            pesan: 'Data warga tidak ditemukan, silakan isi manual',
            tipe: 'peringatan'
          });
          return;
        }
        let errorMessage = `Gagal mengambil data: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          if (responseText) errorMessage += ` - ${responseText}`;
        }
        throw new Error(errorMessage);
      }
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Format data dari server tidak valid');
      }
      setFormData((prev) => ({
        ...prev,
        nik: result.nik || prev.nik,
        nama_lengkap: result.nama_lengkap || prev.nama_lengkap,
        tempat_lahir: result.tempat_lahir || prev.tempat_lahir,
        tanggal_lahir: result.tanggal_lahir || prev.tanggal_lahir,
        jenis_kelamin: result.jenis_kelamin || prev.jenis_kelamin,
        agama: result.agama || prev.agama,
        pekerjaan: result.pekerjaan || prev.pekerjaan,
        alamat_lengkap: result.alamat_lengkap || prev.alamat_lengkap,
        pendidikan: result.pendidikan || prev.pendidikan,
        kewarganegaraan: result.kewarganegaraan || prev.kewarganegaraan,
        penghasilan: result.penghasilan ? String(result.penghasilan) : prev.penghasilan,
        lama_tinggal: result.lama_tinggal ? String(result.lama_tinggal) : prev.lama_tinggal,
        status_pernikahan: result.status_pernikahan || prev.status_pernikahan,
        nomor_hp: result.nomor_hp || prev.nomor_hp,
        keterangan: result.keterangan || prev.keterangan,
        nama_usaha: result.nama_usaha || prev.nama_usaha,
        jenis_usaha: result.jenis_usaha || prev.jenis_usaha,
        alamat_usaha: result.alamat_usaha || prev.alamat_usaha,
        alamat_tujuan: result.alamat_tujuan || prev.alamat_tujuan,
        alasan_pindah: result.alasan_pindah || prev.alasan_pindah,
        keperluan_pindah: result.keperluan_pindah || prev.keperluan_pindah,
        tujuan_pindah: result.tujuan_pindah || prev.tujuan_pindah,
        nama_ayah: result.nama_ayah || prev.nama_ayah,
        nama_ibu: result.nama_ibu || prev.nama_ibu,
        tujuan_surat: result.tujuan_surat || prev.tujuan_surat,
        tgl_kematian: result.tanggal_kematian || prev.tgl_kematian,
        penyebab_kematian: result.penyebab_kematian || prev.penyebab_kematian,
        keperluan: result.keperluan || prev.keperluan,
      }));
      setNikTerdaftar(true);
      setNotifikasi({
        pesan: 'Data warga ditemukan. Silakan lengkapi data yang belum terisi',
        tipe: 'sukses'
      });
    } catch (error) {
      setNikTerdaftar(false);
      setNotifikasi({
        pesan: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data',
        tipe: 'error'
      });
    } finally {
      setSedangMencariNIK(false);
    }
  };

  useEffect(() => {
    if (formData.jenis_surat === 'Surat Keterangan Kelahiran') {
      setFormData((prev) => ({
        ...initialFormData,
        jenis_surat: prev.jenis_surat,
        nama_lengkap: prev.nama_lengkap,
        jenis_kelamin: prev.jenis_kelamin,
        tempat_lahir: prev.tempat_lahir,
        tanggal_lahir: prev.tanggal_lahir,
        nama_ayah: prev.nama_ayah,
        nama_ibu: prev.nama_ibu,
        alamat_lengkap: prev.alamat_lengkap,
        nomor_hp: prev.nomor_hp,
        keterangan: prev.keterangan,
      }));
      setNikTerdaftar(undefined);
      return;
    }
    const timer = setTimeout(() => {
      if (formData.nik && formData.nik.length === 16 && validateNIK(formData.nik)) {
        searchDataByNIK(formData.nik);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.nik, formData.jenis_surat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSedangMemuat(true);
    try {
      const validationError = validateForm(formData);
      if (validationError) {
        throw new Error(validationError);
      }
      const dataToSend = {
        nik: formData.jenis_surat === 'Surat Keterangan Kelahiran' ? undefined : formData.nik,
        nama_lengkap: formData.nama_lengkap || undefined,
        tempat_lahir: formData.tempat_lahir || undefined,
        tanggal_lahir: formData.tanggal_lahir || undefined,
        jenis_kelamin: formData.jenis_kelamin || undefined,
        agama: formData.agama || undefined,
        pekerjaan: formData.pekerjaan || undefined,
        alamat_lengkap: formData.alamat_lengkap || undefined,
        pendidikan: formData.pendidikan || undefined,
        kewarganegaraan: formData.kewarganegaraan || undefined,
        jenis_surat: formData.jenis_surat,
        penghasilan: formData.penghasilan || undefined,
        status_pernikahan: formData.status_pernikahan || undefined,
        lama_tinggal: formData.lama_tinggal || undefined,
        nomor_hp: formData.nomor_hp || undefined,
        keterangan: formData.keterangan || undefined,
        nama_usaha: formData.nama_usaha || undefined,
        jenis_usaha: formData.jenis_usaha || undefined,
        alamat_usaha: formData.alamat_usaha || undefined,
        alamat_tujuan: formData.alamat_tujuan || undefined,
        alasan_pindah: formData.alasan_pindah || undefined,
        keperluan_pindah: formData.keperluan_pindah || undefined,
        tujuan_pindah: formData.tujuan_pindah || undefined,
        nama_ayah: formData.nama_ayah || undefined,
        nama_ibu: formData.nama_ibu || undefined,
        tujuan_surat: formData.tujuan_surat || undefined,
        tanggal_kematian: formData.tgl_kematian || undefined,
        penyebab_kematian: formData.penyebab_kematian || undefined,
        keperluan: formData.keperluan || undefined,
      };
      const response = await fetch(API_ENDPOINTS.SEKRETARIS.PERMOHONAN_SURAT_ADD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const responseText = await response.text();
      if (!response.ok) {
        let errorMessage = `Gagal mengajukan surat (${response.status}): ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          if (responseText) errorMessage += ` - ${responseText}`;
        }
        throw new Error(errorMessage);
      }
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Format data dari server tidak valid');
      }
      if (!result || typeof result !== 'object') {
        throw new Error('Struktur data dari server tidak valid');
      }
      setNotifikasi({
        pesan: result.message || 'Pengajuan surat berhasil dikirim!',
        tipe: 'sukses'
      });
      setFormData({
        ...initialFormData,
        nik: formData.jenis_surat === 'Surat Keterangan Kelahiran' ? '' : formData.nik,
      });
      setNikTerdaftar(undefined);
      handleCloseDialog();
    } catch (error) {
      setNotifikasi({
        pesan: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim data',
        tipe: 'error'
      });
    } finally {
      setSedangMemuat(false);
    }
  };

  const renderAdditionalFields = () => {
    const fields = letterFields[formData.jenis_surat] || [];
    return fields.map((field, index) => (
      <Grid item xs={12} sm={field.multiline ? 12 : 6} key={index}>
        <FormControl fullWidth margin="normal">
          {field.type === 'select' ? (
            <>
              <InputLabel sx={{ fontSize: '0.875rem' }}>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                label={field.label}
                required={field.required}
                size="small"
                sx={{ fontSize: '0.875rem' }}
                disabled={field.disabled && nikTerdaftar}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <TextField
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              required={field.required}
              variant="outlined"
              size="small"
              placeholder={field.placeholder}
              InputLabelProps={{ style: { fontSize: '0.875rem' }, shrink: field.type === 'date' ? true : undefined }}
              InputProps={{
                style: { fontSize: '0.875rem' },
                endAdornment: field.name === 'nik' && sedangMencariNIK ? <CircularProgress size={20} /> : null,
              }}
              inputProps={{
                max: field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined,
                min: field.type === 'number' && field.name === 'lama_tinggal' ? 6 : undefined,
                maxLength: field.name === 'nik' ? 16 : undefined,
                pattern: field.name === 'nik' ? '\\d*' : undefined,
              }}
              multiline={field.multiline}
              rows={field.rows}
              disabled={field.disabled && nikTerdaftar}
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
            {field.placeholder}
          </Typography>
        </FormControl>
      </Grid>
    ));
  };

  return (
    <Box className="page-background" id="home" sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box
          className="content home-content"
          sx={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box className="left-content" sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: 'white', mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontSize: '2.25rem' }}
              >
                <TypeAnimation
                  sequence={[
                    'Selamat Datang di ',
                    1000,
                    'Selamat Datang di Website Profil ',
                    1000,
                    'Selamat Datang di Website Profil Desa ',
                    1000,
                    'Selamat Datang di Website Profil Desa Bontomanai',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{
                    display: 'inline-block',
                    color: '#0284c7',
                  }}
                  repeat={Infinity}
                />
              </Typography>
              <Button
                variant="contained"
                size="medium"
                onClick={handleOpenDialog}
                sx={{
                  fontSize: '0.875rem',
                  px: 4,
                  py: 1,
                  bgcolor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Ajukan Surat
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', maxWidth: '800px', minHeight: '600px', border: '2px solid #0284c7' } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1, fontSize: 24 }} />
            <Typography variant="h5" component="div" sx={{ fontSize: '1.5rem' }}>
              Form Pengajuan Surat
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.paper', pt: 3, pb: 3, position: 'relative' }}>
          <AnimatePresence>
            {notifikasi && (
              <Notification
                pesan={notifikasi.pesan}
                tipe={notifikasi.tipe}
                onTutup={() => setNotifikasi(null)}
              />
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ p: 3, bgcolor: 'background.card', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                Silakan isi form berikut untuk mengajukan surat di kantor desa. Pastikan data yang diisi lengkap dan benar.
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel sx={{ fontSize: '0.875rem' }}>Jenis Surat</InputLabel>
                      <Select
                        name="jenis_surat"
                        value={formData.jenis_surat}
                        onChange={handleInputChange}
                        label="Jenis Surat"
                        required
                        size="small"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        <MenuItem value="">Pilih jenis surat</MenuItem>
                        <MenuItem value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</MenuItem>
                        <MenuItem value="Surat Keterangan Domisili">Surat Keterangan Domisili</MenuItem>
                        <MenuItem value="Surat Keterangan Usaha">Surat Keterangan Usaha</MenuItem>
                        <MenuItem value="Surat Keterangan Pindah">Surat Keterangan Pindah</MenuItem>
                        <MenuItem value="Surat Pengantar">Surat Pengantar</MenuItem>
                        <MenuItem value="Surat Keterangan Kelahiran">Surat Keterangan Kelahiran</MenuItem>
                        <MenuItem value="Surat Keterangan Kematian">Surat Keterangan Kematian</MenuItem>
                      </Select>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
                        Contoh: Surat Keterangan Tidak Mampu
                      </Typography>
                    </FormControl>
                  </Grid>
                  {renderAdditionalFields()}
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
                  <Button
                    onClick={handleCloseDialog}
                    variant="outlined"
                    sx={{ borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={sedangMemuat}
                    endIcon={sedangMemuat ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}
                    sx={{ borderRadius: '8px', padding: '8px 16px', fontSize: '0.875rem' }}
                  >
                    {sedangMemuat ? 'Mengirim...' : 'Kirim Pengajuan'}
                  </Button>
                </Box>
              </form>
            </Card>
          </motion.div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Home;