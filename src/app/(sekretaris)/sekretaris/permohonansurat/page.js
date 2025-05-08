'use client';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Card, CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Dynamic import for html2pdf.js
const Html2Pdf = dynamic(
  () => import('html2pdf.js').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <p>Menyiapkan generator PDF...</p>
  }
);

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
});

const HeaderBox = styled(Box)({
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

// Status colors mapping
const statusColors = {
  'Diproses': 'primary',
  'Selesai': 'success',
  'Ditolak': 'error'
};

// Daftar opsi penandatangan
const penandatanganOptions = {
  'Kepala Desa': { nip: '19651231 200001 1 001', namaLengkap: 'H. Abd. Rasyid' },
  'Sekretaris Desa': { nip: '19701231 200112 2 002', namaLengkap: 'Dra. Hj. Sitti Rahma' }
};

// Fungsi untuk memformat tanggal ke format Indonesia
const formatTanggalIndonesia = (tanggal) => {
  if (!tanggal) return '...........................';
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return '...........................';
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
};

// Fungsi untuk menangani nilai null/undefined
const safeString = (value) => {
  if (value == null) return '...........................';
  if (typeof value === 'object') {
    return value.name ? String(value.name) : '...........................';
  }
  return String(value);
};

// Fungsi untuk menangani nilai form
const safeFormString = (value) => {
  if (value == null) return '';
  if (typeof value === 'object') {
    return value.name ? String(value.name) : '';
  }
  return String(value);
};

// Template Surat
const suratTemplates = {
  'Surat Keterangan Domisili': {
    title: 'Surat Keterangan Domisili',
    template: (data) => {
      const tanggalPembuatan = formatTanggalIndonesia(new Date());
      return `
        <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="display: inline-flex; align-items: center;">
              <img src="/image.png" alt="Logo Desa" style="height: 80px; margin-right: 20px;" />
              <div>
                <h2 style="margin: 0; font-size: 14pt;">PEMERINTAH KABUPATEN JENEPONTO</h2>
                <h3 style="margin: 5px 0; font-size: 12pt;">KECAMATAN RUMBIA - DESA BONTOMANAI</h3>
                <p style="margin: 0; font-size: 10pt;">Alamat: Pattiro, Desa Bontomanai, Kec. Rumbia</p>
              </div>
            </div>
          </div>

          <!-- Judul Surat -->
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT KETERANGAN DOMISILI</p>
            <p style="margin: 5px 0; font-size: 12pt;">Nomor: ${safeString(data.no_surat)}</p>
          </div>

          <!-- Isi Surat -->
          <div style="margin: 30px 0; text-align: justify;">
            <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.ttd_nama_lengkap)}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${safeString(data.ttd_nama)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>Pattiro, Desa Bontomanai, Kec. Rumbia</td>
              </tr>
            </table>

            <p style="margin-bottom: 10px;">Menerangkan bahwa:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.nama_lengkap)}</td>
              </tr>
              <tr>
                <td>Tempat/Tgl Lahir</td>
                <td>:</td>
                <td>${safeString(data.tempat_lahir)} / ${data.tanggal_lahir ? formatTanggalIndonesia(data.tanggal_lahir) : '...........................'}</td>
              </tr>
              <tr>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>${safeString(data.pekerjaan)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>${safeString(data.alamat_lengkap)}</td>
              </tr>
              <tr>
                <td>Nomor HP</td>
                <td>:</td>
                <td>${safeString(data.nomor_hp)}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin: 10px 0;">
              Adalah benar warga kami yang berdomisili di Dusun Bajiminasa, Desa Bontomanai, Kecamatan Rumbia, Kabupaten Jeneponto, Provinsi Sulawesi Selatan.
            </p>
            <p style="text-indent: 40px; margin: 10px 0;">
              Demikian Surat Keterangan Domisili ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <!-- Tanda Tangan -->
          <div style="margin-top: 60px; text-align: right;">
            <p style="margin: 0;">Bontomanai, ${tanggalPembuatan}</p>
            <p style="margin: 10px 0;">Mengetahui,</p>
            <p style="margin: 10px 0;">${safeString(data.ttd_nama)}</p>
            <div style="margin-top: 80px;">
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${safeString(data.ttd_nama_lengkap)}</p>
              <p style="margin: 5px 0;">NIP. ${safeString(data.nip)}</p>
            </div>
          </div>
        </div>
      `;
    },
    formFields: [
      { name: 'no_surat', label: 'Nomor Surat', type: 'text', placeholder: 'Masukkan Nomor Surat', required: true },
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Masukkan Pekerjaan' },
      { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true },
      { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP' },
      { name: 'ttd_nama', label: 'Yang Bertandatangan', type: 'select', options: ['Kepala Desa', 'Sekretaris Desa'], required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'NIP akan terisi otomatis', disabled: true }
    ]
  },
  'Surat Keterangan Tidak Mampu': {
    title: 'Surat Keterangan Tidak Mampu',
    template: (data) => {
      const tanggalPembuatan = formatTanggalIndonesia(new Date());
      return `
        <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="display: inline-flex; align-items: center;">
              <img src="/image.png" alt="Logo Desa" style="height: 80px; margin-right: 20px;" />
              <div>
                <h2 style="margin: 0; font-size: 14pt;">PEMERINTAH KABUPATEN JENEPONTO</h2>
                <h3 style="margin: 5px 0; font-size: 12pt;">KECAMATAN RUMBIA - DESA BONTOMANAI</h3>
                <p style="margin: 0; font-size: 10pt;">Alamat: Jalan Poros Jeneponto Malakaji, Bontomanai, Kec. Rumbia</p>
              </div>
            </div>
          </div>

          <!-- Judul Surat -->
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT KETERANGAN TIDAK MAMPU</p>
            <p style="margin: 5px 0; font-size: 12pt;">Nomor: ${safeString(data.no_surat)}</p>
          </div>

          <!-- Isi Surat -->
          <div style="margin: 30px 0; text-align: justify;">
            <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.ttd_nama_lengkap)}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${safeString(data.ttd_nama)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>Dusun Pattiro, Desa Bontomanai, Kec. Rumbia</td>
              </tr>
            </table>

            <p style="margin-bottom: 10px;">Dengan ini menerangkan dengan sebenarnya bahwa:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.nama_lengkap)}</td>
              </tr>
              <tr>
                <td>NIK</td>
                <td>:</td>
                <td>${safeString(data.nik)}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>${safeString(data.jenis_kelamin)}</td>
              </tr>
              <tr>
                <td>Agama</td>
                <td>:</td>
                <td>${safeString(data.agama)}</td>
              </tr>
              <tr>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>${safeString(data.pekerjaan)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>${safeString(data.alamat_lengkap)}</td>
              </tr>
              <tr>
                <td>Nomor HP</td>
                <td>:</td>
                <td>${safeString(data.nomor_hp)}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin: 10px 0;">
              Benar bahwa yang tersebut namanya di atas adalah penduduk/warga asli Dusun Bulueng, Desa Bontomanai, Kecamatan Rumbia, Kabupaten Jeneponto, dan tergolong tidak mampu/miskin.
            </p>

            <p style="text-indent: 40px; margin: 10px 0;">
              Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <!-- Tanda Tangan -->
          <div style="margin-top: 60px; text-align: right;">
            <p style="margin: 0;">Dikeluarkan di: Bontomanai</p>
            <p style="margin: 5px 0;">Pada Tanggal: ${tanggalPembuatan}</p>
            <p style="margin: 10px 0;">Mengetahui,</p>
            <p style="margin: 10px 0;">${safeString(data.ttd_nama)}</p>
            <div style="margin-top: 80px;">
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${safeString(data.ttd_nama_lengkap)}</p>
              <p style="margin: 5px 0;">NIP. ${safeString(data.nip)}</p>
            </div>
          </div>
        </div>
      `;
    },
    formFields: [
      { name: 'no_surat', label: 'Nomor Surat', type: 'text', placeholder: 'Masukkan Nomor Surat', required: true },
      { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true },
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text', placeholder: 'Masukkan Jenis Kelamin' },
      { name: 'agama', label: 'Agama', type: 'text', placeholder: 'Masukkan Agama' },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Masukkan Pekerjaan' },
      { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true },
      { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP' },
      { name: 'ttd_nama', label: 'Yang Bertandatangan', type: 'select', options: ['Kepala Desa', 'Sekretaris Desa'], required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'NIP akan terisi otomatis', disabled: true }
    ]
  },
  'Surat Keterangan Usaha': {
    title: 'Surat Keterangan Usaha',
    template: (data) => {
      const tanggalPembuatan = formatTanggalIndonesia(new Date());
      return `
        <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="display: inline-flex; align-items: center;">
              <img src="/image.png" alt="Logo Desa" style="height: 80px; margin-right: 20px;" />
              <div>
                <h2 style="margin: 0; font-size: 14pt;">PEMERINTAH KABUPATEN JENEPONTO</h2>
                <h3 style="margin: 5px 0; font-size: 12pt;">KECAMATAN RUMBIA - DESA BONTOMANAI</h3>
                <p style="margin: 0; font-size: 10pt;">Alamat: Pattiro, Desa Bontomanai, Kec. Rumbia</p>
              </div>
            </div>
          </div>

          <!-- Judul Surat -->
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT KETERANGAN USAHA</p>
            <p style="margin: 5px 0; font-size: 12pt;">Nomor: ${safeString(data.no_surat)}</p>
          </div>

          <!-- Isi Surat -->
          <div style="margin: 30px 0; text-align: justify;">
            <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.ttd_nama_lengkap)}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${safeString(data.ttd_nama)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>Pattiro, Desa Bontomanai, Kec. Rumbia</td>
              </tr>
            </table>

            <p style="margin-bottom: 10px;">Menerangkan bahwa:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.nama_lengkap)}</td>
              </tr>
              <tr>
                <td>NIK</td>
                <td>:</td>
                <td>${safeString(data.nik)}</td>
              </tr>
              <tr>
                <td>Tempat/Tgl Lahir</td>
                <td>:</td>
                <td>${safeString(data.tempat_lahir)} / ${data.tanggal_lahir ? formatTanggalIndonesia(data.tanggal_lahir) : '...........................'}</td>
              </tr>
              <tr>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>${safeString(data.pekerjaan)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>${safeString(data.alamat_lengkap)}</td>
              </tr>
              <tr>
                <td>Nama Usaha</td>
                <td>:</td>
                <td>${safeString(data.nama_usaha)}</td>
              </tr>
              <tr>
                <td>Berdiri Sejak</td>
                <td>:</td>
                <td>${data.berdiri_sejak ? formatTanggalIndonesia(data.berdiri_sejak) : '...........................'}</td>
              </tr>
              <tr>
                <td>Alamat Usaha</td>
                <td>:</td>
                <td>${safeString(data.alamat_usaha)}</td>
              </tr>
              <tr>
                <td>Nomor HP</td>
                <td>:</td>
                <td>${safeString(data.nomor_hp)}</td>
              </tr>
            </table>

            <p style="text-indent: 40px; margin: 10px 0;">
              Bahwa nama yang tersebut di atas benar warga Dusun Lembang-Lembang, Desa Bontomanai, Kecamatan Rumbia, Kabupaten Jeneponto, Provinsi Sulawesi Selatan, dan memiliki usaha yang masih aktif hingga saat ini.
            </p>
            <p style="text-indent: 40px; margin: 10px 0;">
              Demikian Surat Keterangan Usaha ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <!-- Tanda Tangan -->
          <div style="margin-top: 60px; text-align: right;">
            <p style="margin: 0;">Bontomanai, ${tanggalPembuatan}</p>
            <p style="margin: 10px 0;">Mengetahui,</p>
            <p style="margin: 10px 0;">${safeString(data.ttd_nama)}</p>
            <div style="margin-top: 80px;">
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${safeString(data.ttd_nama_lengkap)}</p>
              <p style="margin: 5px 0;">NIP. ${safeString(data.nip)}</p>
            </div>
          </div>
        </div>
      `;
    },
    formFields: [
      { name: 'no_surat', label: 'Nomor Surat', type: 'text', placeholder: 'Masukkan Nomor Surat', required: true },
      { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true },
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Masukkan Pekerjaan' },
      { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true },
      { name: 'nama_usaha', label: 'Nama Usaha', type: 'text', placeholder: 'Masukkan Nama Usaha' },
      { name: 'berdiri_sejak', label: 'Berdiri Sejak', type: 'date', placeholder: 'Pilih Tanggal Berdiri' },
      { name: 'alamat_usaha', label: 'Alamat Usaha', type: 'text', placeholder: 'Masukkan Alamat Usaha' },
      { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP' },
      { name: 'ttd_nama', label: 'Yang Bertandatangan', type: 'select', options: ['Kepala Desa', 'Sekretaris Desa'], required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'NIP akan terisi otomatis', disabled: true }
    ]
  },
  'Surat Pengantar SKCK': {
    title: 'Surat Pengantar SKCK',
    template: (data) => {
      const tanggalPembuatan = formatTanggalIndonesia(new Date());
      return `
        <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="display: inline-flex; align-items: center;">
              <img src="/image.png" alt="Logo Desa" style="height: 80px; margin-right: 20px;" />
              <div>
                <h2 style="margin: 0; font-size: 14pt;">PEMERINTAH KABUPATEN JENEPONTO</h2>
                <h3 style="margin: 5px 0; font-size: 12pt;">KECAMATAN RUMBIA - DESA BONTOMANAI</h3>
                <p style="margin: 0; font-size: 10pt;">Alamat: Jalan Poros Jeneponto Malakaji, Bontomanai, Kec. Rumbia</p>
              </div>
            </div>
          </div>

          <!-- Judul Surat -->
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-weight: bold; font-size: 14pt; text-decoration: underline;">SURAT PENGANTAR</p>
            <p style="margin: 5px 0; font-size: 12pt;">Nomor: ${safeString(data.no_surat)}</p>
          </div>

          <!-- Isi Surat -->
          <div style="margin: 30px 0; text-align: justify;">
            <p style="margin-bottom: 10px;">Yang bertanda tangan di bawah ini:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.ttd_nama_lengkap)}</td>
              </tr>
              <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${safeString(data.ttd_nama)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>Dusun Pattiro, Desa Bontomanai, Kec. Rumbia</td>
              </tr>
            </table>

            <p style="margin-bottom: 10px;">Dengan ini memberikan Surat Pengantar kepada:</p>
            <table style="margin-left: 40px; margin-bottom: 20px; font-size: 12pt;">
              <tr>
                <td style="width: 120px;">Nama</td>
                <td style="width: 20px;">:</td>
                <td>${safeString(data.nama_lengkap)}</td>
              </tr>
              <tr>
                <td>NIK</td>
                <td>:</td>
                <td>${safeString(data.nik)}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>${safeString(data.jenis_kelamin)}</td>
              </tr>
              <tr>
                <td>Tempat/Tgl Lahir</td>
                <td>:</td>
                <td>${safeString(data.tempat_lahir)} / ${data.tanggal_lahir ? formatTanggalIndonesia(data.tanggal_lahir) : '...........................'}</td>
              </tr>
              <tr>
                <td>Agama</td>
                <td>:</td>
                <td>${safeString(data.agama)}</td>
              </tr>
              <tr>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>${safeString(data.pekerjaan)}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>${safeString(data.alamat_lengkap)}</td>
              </tr>
              <tr>
                <td>Tujuan</td>
                <td>:</td>
                <td>${safeString(data.tujuan)}</td>
              </tr>
              <tr>
                <td>Nomor HP</td>
                <td>:</td>
                <td>${safeString(data.nomor_hp)}</td>
              </tr>
            </table>
            <p style="text-indent: 40px; margin: 10px 0;">
              Demikian Surat Pengantar ini dibuat dan diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          <!-- Tanda Tangan -->
          <div style="margin-top: 60px; text-align: right;">
            <p style="margin: 0;">Dikeluarkan di: Bontomanai</p>
            <p style="margin: 5px 0;">Pada Tanggal: ${tanggalPembuatan}</p>
            <p style="margin: 10px 0;">Mengetahui,</p>
            <p style="margin: 10px 0;">${safeString(data.ttd_nama)}</p>
            <div style="margin-top: 80px;">
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${safeString(data.ttd_nama_lengkap)}</p>
              <p style="margin: 5px 0;">NIP. ${safeString(data.nip)}</p>
            </div>
          </div>
        </div>
      `;
    },
    formFields: [
      { name: 'no_surat', label: 'Nomor Surat', type: 'text', placeholder: 'Masukkan Nomor Surat', required: true },
      { name: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', disabled: true },
      { name: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan Nama Lengkap', disabled: true },
      { name: 'tempat_lahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Masukkan Tempat Lahir', disabled: true },
      { name: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date', placeholder: 'Pilih Tanggal Lahir', disabled: true },
      { name: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'text', placeholder: 'Masukkan Jenis Kelamin' },
      { name: 'agama', label: 'Agama', type: 'text', placeholder: 'Masukkan Agama' },
      { name: 'pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Masukkan Pekerjaan' },
      { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'text', placeholder: 'Masukkan Alamat Lengkap', disabled: true },
      { name: 'tujuan', label: 'Tujuan', type: 'text', placeholder: 'Masukkan Tujuan' },
      { name: 'nomor_hp', label: 'Nomor HP', type: 'text', placeholder: 'Masukkan Nomor HP' },
      { name: 'ttd_nama', label: 'Yang Bertandatangan', type: 'select', options: ['Kepala Desa', 'Sekretaris Desa'], required: true },
      { name: 'nip', label: 'NIP', type: 'text', placeholder: 'NIP akan terisi otomatis', disabled: true }
    ]
  }
};

export default function PermohonanSurat() {
  const [permohonanList, setPermohonanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPermohonan, setSelectedPermohonan] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const router = useRouter();
  const pdfRef = useRef(null);
  const [html2pdf, setHtml2pdf] = useState(null);

  useEffect(() => {
    const loadHtml2Pdf = async () => {
      try {
        const module = await import('html2pdf.js');
        setHtml2pdf(() => module.default);
      } catch (err) {
        setError('Gagal memuat generator PDF');
      }
    };
    loadHtml2Pdf();
  }, []);

  // Fetch daftar permohonan
  useEffect(() => {
    const fetchPermohonan = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.SEKRETARIS.PERMOHONAN_SURAT_GET_ALL, {
          method: 'GET',
          headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Gagal memuat permohonan');
        const data = await response.json();
        setPermohonanList(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError('Gagal memuat data: ' + err.message);
        setPermohonanList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPermohonan();
  }, []);

  const handleOpenForm = (permohonan) => {
    setSelectedPermohonan(permohonan);
    const template = suratTemplates[permohonan.jenis_surat];
    if (!template) {
      setError(`Template untuk ${permohonan.jenis_surat} tidak ditemukan`);
      return;
    }

    const formatDateSafely = (dateValue) => {
      if (!dateValue) return '';
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    };

    // Initialize formData with all fields from template and permohonan data
    const formData = {};
    template.formFields.forEach(field => {
      if (field.name === 'tanggal_lahir' || field.name === 'berdiri_sejak') {
        formData[field.name] = formatDateSafely(permohonan[field.name]);
      } else {
        formData[field.name] = safeFormString(permohonan[field.name]);
      }
    });
    // Add additional fields not in formFields but used in template
    formData.jenis_surat = safeFormString(permohonan.jenis_surat);
    formData.keterangan = safeFormString(permohonan.keterangan);
    formData.status = safeFormString(permohonan.status) || 'Diproses';
    formData.ttd_nama_lengkap = '';

    setFormData(formData);
  };

  // Tutup form
  const handleCloseForm = () => {
    setSelectedPermohonan(null);
    setFormData({});
    setPreviewContent('');
    setError(null);
  };

  // Tangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'ttd_nama') {
      updatedFormData.nip = penandatanganOptions[value]?.nip || '';
      updatedFormData.ttd_nama_lengkap = penandatanganOptions[value]?.namaLengkap || '';
    }

    setFormData(updatedFormData);
  };

  // Tangani upload file
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  // Generate preview surat
  const handlePreview = () => {
    if (!selectedPermohonan) {
      setError('Pilih permohonan terlebih dahulu.');
      return null;
    }
    const selectedTemplate = selectedPermohonan.jenis_surat;
    if (!suratTemplates[selectedTemplate]) {
      setError(`Template untuk ${selectedTemplate} tidak ditemukan.`);
      return null;
    }
    if (!Object.keys(formData).length) {
      setError('Isi formulir terlebih dahulu.');
      return null;
    }
    if (!formData.ttd_nama) {
      setError('Silakan pilih "Yang Bertandatangan".');
      return null;
    }
    if (!formData.ttd_nama_lengkap) {
      setError('Nama Yang Bertandatangan tidak tersedia.');
      return null;
    }
    return suratTemplates[selectedTemplate].template(formData);
  };

  // Tombol Generate Surat
  const handleGenerateSurat = () => {
    if (!selectedPermohonan) {
      setError('Pilih permohonan terlebih dahulu.');
      return;
    }
    try {
      setLoading(true);
      const content = handlePreview();
      if (!content) {
        throw new Error('Gagal menghasilkan preview surat.');
      }
      setPreviewContent(content);
    } catch (err) {
      setError('Gagal generate preview surat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simpan surat ke server
  const handleSaveSurat = async () => {
    if (!html2pdf) {
      setError('Generator PDF belum siap');
      return;
    }
    if (!pdfRef.current || !previewContent) {
      setError('Konten preview tidak tersedia');
      return;
    }

    try {
      setLoading(true);
      const contentClone = pdfRef.current.cloneNode(true);
      document.body.appendChild(contentClone);

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${selectedPermohonan.jenis_surat}_${formData.no_surat || 'surat'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(contentClone)
        .output('blob');

      document.body.removeChild(contentClone);

      const formDataToSend = new FormData();
      formDataToSend.append('id', selectedPermohonan.id);
      formDataToSend.append('nomor', formData.no_surat || '');
      formDataToSend.append('tanggal', new Date().toISOString().split('T')[0]);
      formDataToSend.append('perihal', formData.keterangan || selectedPermohonan.jenis_surat);
      formDataToSend.append('title', selectedPermohonan.jenis_surat);
      formDataToSend.append('file', pdfBlob, opt.filename);

      const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_ADD, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan surat');
      }

      await updatePermohonanStatus(selectedPermohonan.id);
      setPreviewContent('');
      handleCloseForm();
      alert('Surat berhasil disimpan dan status diperbarui.');
    } catch (err) {
      setError('Gagal menyimpan surat: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePermohonanStatus = async (id) => {
    const response = await fetch(
      API_ENDPOINTS.PERMOHONAN_SURAT_UPDATE_STATUS(id),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' }),
      }
    );

    if (!response.ok) {
      throw new Error('Gagal memperbarui status permohonan');
    }

    setPermohonanList(prevList =>
      prevList.map(item => 
        item.id === id ? { ...item, status: 'Selesai' } : item
      )
    );
  };

  // Cetak surat
  const handlePrint = () => {
    if (!previewContent) {
      alert('Silakan generate preview surat terlebih dahulu.');
      return;
    }

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    document.body.appendChild(printFrame);

    printFrame.contentDocument.write(`
      <html>
        <head>
          <title>Cetak ${selectedPermohonan?.jenis_surat || 'Surat'}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 12pt;
              line-height: 1.5; 
              margin: 20px;
            }
            @page { margin: 0; }
          </style>
        </head>
        <body>
          ${previewContent}
        </body>
      </html>
    `);
    printFrame.contentDocument.close();

    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StyledCard>
          <HeaderBox>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Permohonan Surat
            </Typography>
          </HeaderBox>
          <CardContent>
            <Typography color="error" p={3}>
              {error}
            </Typography>
          </CardContent>
        </StyledCard>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <StyledCard>
        <HeaderBox>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Permohonan Surat
          </Typography>
        </HeaderBox>

        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : permohonanList.length === 0 ? (
            <Typography align="center" p={4}>
              Tidak ada permohonan surat.
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>No</strong></TableCell>
                      <TableCell><strong>NIK</strong></TableCell>
                      <TableCell><strong>Nama</strong></TableCell>
                      <TableCell><strong>Jenis Surat</strong></TableCell>
                      <TableCell><strong>Keterangan</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Tanggal</strong></TableCell>
                      <TableCell><strong>Aksi</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permohonanList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((permohonan, index) => (
                        <TableRow key={permohonan.id}>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell>{permohonan.nik}</TableCell>
                          <TableCell>{permohonan.nama_lengkap}</TableCell>
                          <TableCell>{permohonan.jenis_surat}</TableCell>
                          <TableCell>{permohonan.keterangan}</TableCell>
                          <TableCell>
                            <Chip
                              label={permohonan.status}
                              color={statusColors[permohonan.status] || 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(permohonan.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenForm(permohonan)}
                              disabled={permohonan.status === 'Selesai'}
                              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                            >
                              Proses
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={permohonanList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>

        <Dialog open={!!selectedPermohonan} onClose={handleCloseForm} maxWidth="md" fullWidth>
          <DialogTitle>
            Proses Permohonan Surat: {selectedPermohonan?.jenis_surat}
            <IconButton
              aria-label="close"
              onClick={handleCloseForm}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" sx={{ mt: 2 }}>
              {selectedPermohonan && suratTemplates[selectedPermohonan.jenis_surat]?.formFields.map((field) => (
                <Box key={field.name} sx={{ mb: 3 }}>
                  <Typography sx={{ display: 'block', mb: 1, fontWeight: 500, color: '#333' }}>
                    {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  {field.type === 'select' ? (
                    <FormControl fullWidth error={!formData[field.name] && field.required}>
                      <Select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        disabled={field.disabled}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                        }}
                      >
                        <MenuItem value="">
                          <em>Pilih {field.label}</em>
                        </MenuItem>
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      {!formData[field.name] && field.required && (
                        <Typography color="error" variant="caption">
                          {field.label} wajib diisi
                        </Typography>
                      )}
                      {field.name === 'ttd_nama' && formData.ttd_nama && (
                        <Box sx={{ mt: 2 }}>
                          <Typography sx={{ display: 'block', mb: 1, fontWeight: 500, color: '#333' }}>
                            Nama Yang Bertandatangan
                          </Typography>
                          <TextField
                            value={formData.ttd_nama_lengkap || ''}
                            fullWidth
                            disabled
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#999' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                              },
                            }}
                          />
                        </Box>
                      )}
                    </FormControl>
                  ) : field.type === 'file' ? (
                    <Box>
                      <input
                        id={field.name}
                        name={field.name}
                        type="file"
                        accept={field.accept}
                        onChange={handleFileChange}
                        style={{ marginTop: '8px', display: 'block', fontSize: '16px' }}
                      />
                      {formData[field.name] && (
                        <Typography variant="caption" sx={{ mt: 1, color: '#555' }}>
                          File terpilih: {formData[field.name].name || formData[field.name]}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <TextField
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      type={field.type === 'date' ? 'date' : 'text'}
                      multiline={field.type === 'textarea'}
                      rows={field.type === 'textarea' ? 4 : 1}
                      fullWidth
                      variant="outlined"
                      disabled={field.disabled}
                      InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                      error={field.required && !formData[field.name]}
                      helperText={field.required && !formData[field.name] ? `${field.label} wajib diisi` : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#ccc' },
                          '&:hover fieldset': { borderColor: '#999' },
                          '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                        },
                      }}
                    />
                  )}
                </Box>
              ))}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ display: 'block', mb: 1, fontWeight: 500, color: '#333' }}>
                  Keterangan
                </Typography>
                <TextField
                  name="keterangan"
                  value={formData.keterangan || ''}
                  onChange={handleInputChange}
                  placeholder="Masukkan keterangan tambahan (opsional)"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ccc' },
                      '&:hover fieldset': { borderColor: '#999' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="inherit">
              Batal
            </Button>
            <Button
              onClick={handleGenerateSurat}
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Preview Surat
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={!!previewContent} onClose={() => setPreviewContent('')} maxWidth="lg" fullWidth>
          <DialogTitle>
            Preview Surat
            <IconButton
              aria-label="close"
              onClick={() => setPreviewContent('')}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <div 
              ref={pdfRef}
              dangerouslySetInnerHTML={{ __html: previewContent }} 
              style={{ 
                padding: '20px',
                fontFamily: "'Times New Roman', serif",
                fontSize: '12pt',
                lineHeight: 1.5 
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewContent('')} color="inherit">
              Kembali
            </Button>
            <Button
              onClick={handleSaveSurat}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >  
              Simpan
            </Button>
            <Button
              onClick={handlePrint}
              variant="contained"
              startIcon={<PrintIcon />}
              disabled={loading}
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Cetak
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCard>
    </Box>
  );
}