"use client";

import { API_ENDPOINTS } from '@/config/api';
import { laporanService } from '@/services/laporanService';
import { pengeluaranService } from '@/services/pengeluaranService';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SaveIcon from '@mui/icons-material/Save';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useEffect, useState } from 'react';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px',
  marginBottom: { xs: '8px', sm: '24px' },
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
}));

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1a237e',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

const DesktopAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#1a237e',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  width: '100%',
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: 'none',
  '& .MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#1a237e',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
    padding: '4px 8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
    '& .MuiSelect-select': {
      padding: '8px 12px',
      paddingRight: '32px !important',
      minHeight: '1.5em',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1a237e',
      boxShadow: '0 0 0 3px rgba(26,35,126,0.1)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1a237e',
      borderWidth: '2px',
      boxShadow: '0 0 0 3px rgba(26,35,126,0.1)',
    },
    transition: 'all 0.2s ease',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: '#666',
    transform: 'translate(14px, 10px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
      color: '#1a237e',
    },
    '&.Mui-focused': {
      color: '#1a237e',
    },
  },
  '& .MuiSvgIcon-root': {
    color: '#1a237e',
  },
  width: { xs: '100%', sm: '180px' },
  minHeight: '40px',
}));

export default function Pengeluaran() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: null,
    nominal: '',
    keterangan: '',
    nota: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });
  const [notaDialog, setNotaDialog] = useState({
    open: false,
    imageUrl: '',
  });
  const [timeRange, setTimeRange] = useState('7days');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [confirmedStartDate, setConfirmedStartDate] = useState(null);
  const [confirmedEndDate, setConfirmedEndDate] = useState(null);
  const [previousTimeRange, setPreviousTimeRange] = useState('7days');

  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'custom', label: 'Kustom' },
  ];

  const formatDate = (date) => {
    if (!date || !dayjs(date).isValid()) return null;
    return dayjs(date).format('YYYY-MM-DD');
  };

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-';
    try {
      return dayjs(backendDateString, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY HH:mm');
    } catch (e) {
      console.error('Error parsing date:', backendDateString, e);
      return 'Tanggal Tidak Valid';
    }
  };

  const translateErrorMessage = (message) => {
    const errorTranslations = {
      'Network Error': 'Kesalahan Jaringan',
      'Failed to fetch': 'Gagal Mengambil Data',
      'Internal Server Error': 'Kesalahan Server Internal',
      'Unauthorized': 'Tidak Berwenang',
      'Bad Request': 'Permintaan Tidak Valid',
    };
    return errorTranslations[message] || message || 'Terjadi Kesalahan';
  };

  const getDateRange = (range) => {
    const today = dayjs();
    if (range === 'custom' && confirmedStartDate && confirmedEndDate) {
      const start = dayjs(confirmedStartDate).startOf('day');
      const end = dayjs(confirmedEndDate).endOf('day');
      if (start.isAfter(end)) {
        showSnackbar('Tanggal mulai harus sebelum tanggal akhir', 'error');
        return { start: null, end: null };
      }
      return { start: formatDate(start), end: formatDate(end) };
    }
    switch (range) {
      case 'today':
        return { start: formatDate(today.startOf('day')), end: formatDate(today.endOf('day')) };
      case 'yesterday':
        return { start: formatDate(today.subtract(1, 'day').startOf('day')), end: formatDate(today.startOf('day')) };
      case '7days':
        return { start: formatDate(today.subtract(7, 'day').startOf('day')), end: formatDate(today.endOf('day')) };
      case '1month':
        return { start: formatDate(today.subtract(1, 'month').startOf('day')), end: formatDate(today.endOf('day')) };
      case '3months':
        return { start: formatDate(today.subtract(3, 'month').startOf('day')), end: formatDate(today.endOf('day')) };
      case '6months':
        return { start: formatDate(today.subtract(6, 'month').startOf('day')), end: formatDate(today.endOf('day')) };
      case '1year':
        return { start: formatDate(today.subtract(1, 'year').startOf('day')), end: formatDate(today.endOf('day')) };
      default:
        return { start: formatDate(today.subtract(7, 'day').startOf('day')), end: formatDate(today.endOf('day')) };
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, timeRange, confirmedStartDate, confirmedEndDate]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setIsLoadingTotal(true);
        const total = await laporanService.getTotalPengeluaran();
        setTotalPengeluaran(Number.isFinite(total) ? total : 0);
      } catch (error) {
        setTotalPengeluaran(0);
        showSnackbar(translateErrorMessage(error.message), 'error');
      } finally {
        setIsLoadingTotal(false);
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(timeRange);
      let response;
      if (!start || !end) {
        response = await pengeluaranService.getAllPengeluaran(page + 1, rowsPerPage);
      } else {
        response = await pengeluaranService.getPengeluaranByDateRange(start, end, page + 1, rowsPerPage);
      }
      const pengeluaranData = response?.data?.items?.map((item) => ({
        id: item.id_pengeluaran,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        nota: item.nota,
      })) || [];
      setRows(pengeluaranData);
      setTotalItems(response?.data?.total_items || 0);
      setTotalPages(response?.data?.total_pages || 0);
    } catch (error) {
      showSnackbar(translateErrorMessage(error.message), 'error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (e) => {
    const value = e.target.value;
    setPreviousTimeRange(timeRange);
    setTimeRange(value);
    if (value === 'custom') {
      setShowCustomCalendar(true);
    } else {
      setShowCustomCalendar(false);
      setTempStartDate(null);
      setTempEndDate(null);
      setConfirmedStartDate(null);
      setConfirmedEndDate(null);
      setPage(0);
    }
  };

  const handleApplyDateRange = () => {
    if (!tempStartDate || !tempEndDate) {
      showSnackbar('Silakan pilih tanggal mulai dan akhir', 'error');
      return;
    }
    const start = dayjs(tempStartDate);
    const end = dayjs(tempEndDate);
    if (start.isAfter(end)) {
      showSnackbar('Tanggal mulai harus sebelum tanggal akhir', 'error');
      return;
    }
    setConfirmedStartDate(tempStartDate);
    setConfirmedEndDate(tempEndDate);
    setPage(0);
    setShowCustomCalendar(false);
  };

  const handleCancelDateRange = () => {
    setShowCustomCalendar(false);
    setTimeRange(previousTimeRange);
    setTempStartDate(null);
    setTempEndDate(null);
    setConfirmedStartDate(null);
    setConfirmedEndDate(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'nota') {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        showSnackbar('Ukuran file terlalu besar (maksimal 5MB)', 'error');
        return;
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }
    } else if (name === 'nominal') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) {
        showSnackbar('Nominal terlalu besar (maksimal puluhan miliar)', 'error');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      tanggal: null,
      nominal: '',
      keterangan: '',
      nota: null,
    });
    setPreviewUrl('');
    setShowModal(true);
  };

  const handleEdit = (row) => {
    const date = dayjs(row.tanggal, 'DD-MM-YYYY HH:mm');
    setEditingId(row.id);
    setFormData({
      tanggal: date.isValid() ? date : null,
      nominal: row.nominal.toString(),
      keterangan: row.keterangan,
      nota: null,
    });
    if (row.nota) {
      setPreviewUrl(`${API_ENDPOINTS.BENDAHARA.UPLOAD_URL}${row.nota}`);
    } else {
      setPreviewUrl('');
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!id) {
      showSnackbar('Data tidak valid untuk dihapus', 'error');
      return;
    }
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteDialog;
    try {
      setLoading(true);
      await pengeluaranService.deletePengeluaran(id);
      if (rows.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        await fetchData();
      }
      const total = await laporanService.getTotalPengeluaran();
      setTotalPengeluaran(Number.isFinite(total) ? total : 0);
      showSnackbar(`Pengeluaran berhasil dihapus`, 'success');
    } catch (error) {
      showSnackbar(translateErrorMessage(error.message), 'error');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleShowNota = (notaPath) => {
    if (notaPath) {
      setNotaDialog({
        open: true,
        imageUrl: `${API_ENDPOINTS.BENDAHARA.UPLOAD_URL}${notaPath}`,
      });
    } else {
      showSnackbar('Nota tidak tersedia', 'warning');
    }
  };

  const handleCloseNotaDialog = () => {
    setNotaDialog({
      open: false,
      imageUrl: '',
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!formData.tanggal) throw new Error('Tanggal harus diisi');
      if (!formData.nominal) throw new Error('Nominal harus diisi');
      if (!formData.keterangan) throw new Error('Keterangan harus diisi');
      if (!editingId && !formData.nota) throw new Error('Nota harus diunggah');

      const dateObj = dayjs(formData.tanggal);
      if (!dateObj.isValid()) throw new Error('Format tanggal tidak valid');

      const formattedDate = dateObj.format('YYYY-MM-DD HH:mm');
      const dataToSend = {
        tanggal: formattedDate,
        nominal: parseFloat(formData.nominal),
        keterangan: formData.keterangan.trim(),
        nota: formData.nota,
      };

      let result;
      if (editingId) {
        const { nota, ...updateData } = dataToSend;
        result = await pengeluaranService.updatePengeluaran(editingId, formData.nota ? dataToSend : updateData);
      } else {
        result = await pengeluaranService.addPengeluaran(dataToSend);
      }

      showSnackbar(result.message, 'success');
      setShowModal(false);
      await fetchData();
      const total = await laporanService.getTotalPengeluaran();
      setTotalPengeluaran(Number.isFinite(total) ? total : 0);
    } catch (error) {
      showSnackbar(translateErrorMessage(error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const validAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(validAmount);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setShowModal(false);
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, nota: null }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <Box sx={{ padding: '24px', mt: { xs: '64px', sm: '80px' } }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              fontWeight: 500,
            }}
            action={
              <IconButton size="small" aria-label="tutup" color="inherit" onClick={handleCloseSnackbar}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <HeaderBox sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Data Pengeluaran
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Total Pengeluaran: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalPengeluaran)}
            </Typography>
          </Box>
          <DesktopAddButton variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ mt: 2 }}>
            Tambah Pengeluaran
          </DesktopAddButton>
        </HeaderBox>

        <AddButton variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Tambah Pengeluaran
        </AddButton>

        <StyledCard>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                mb: 3,
              }}
            >
              <Typography variant="h6" component="div" sx={{ color: '#1a237e' }}>
                Kelola data pengeluaran desa dengan mudah
              </Typography>
              <StyledFormControl variant="outlined" size="small">
                <InputLabel>Filter Periode</InputLabel>
                <Select value={timeRange} onChange={handleTimeRangeChange} label="Filter Periode">
                  {timeRangeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Box>
            <StyledTableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Jumlah</TableCell>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>Nota</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <MoneyOffIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                        <Typography variant="body1" color="textSecondary">
                          Tidak ada data pengeluaran
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f8f9fa',
                            '& .action-buttons': { opacity: 1 },
                          },
                        }}
                      >
                        <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                        <TableCell sx={{ color: '#d32f2f', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {formatCurrency(row.nominal)}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: { xs: '120px', sm: '200px' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.keterangan}
                        </TableCell>
                        <TableCell>
                          {row.nota ? (
                            <IconButton
                              onClick={() => handleShowNota(row.nota)}
                              size="small"
                              aria-label={`Lihat nota pengeluaran nomor ${row.id}`}
                            >
                              <ReceiptIcon />
                            </IconButton>
                          ) : (
                            <Typography variant="caption">Tidak ada</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            className="action-buttons"
                            sx={{
                              opacity: { xs: 1, sm: 0.5 },
                              transition: 'opacity 0.2s',
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Ubah">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row)}
                                sx={{ color: '#1a237e', width: { xs: '35px', sm: '30px' }, height: { xs: '35px', sm: '30px' } }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Hapus">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(row.id)}
                                sx={{ color: '#d32f2f', width: { xs: '35px', sm: '30px' }, height: { xs: '35px', sm: '30px' } }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Baris per halaman:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
                sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)', '& .MuiTablePagination-toolbar': { padding: '16px' } }}
              />
            </StyledTableContainer>
          </CardContent>
        </StyledCard>

        {/* Dialog untuk memilih rentang tanggal */}
        <Dialog
          open={showCustomCalendar}
          onClose={handleCancelDateRange}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              margin: '16px',
              width: 'calc(100% - 32px)',
              maxHeight: 'calc(100vh - 32px)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease-in-out',
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              pt: 3,
              px: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '& .MuiTypography-root': { fontSize: '1.5rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 28 }} />
            Pilih Rentang Tanggal
          </DialogTitle>
          <DialogContent sx={{ py: 4, px: { xs: 3, sm: 4 }, overflowY: 'auto', flex: 1 }}>
            <Box sx={{ pt: 2, pb: 3, mb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <DatePicker
                  label="Tanggal Mulai"
                  value={tempStartDate}
                  onChange={(newValue) => setTempStartDate(newValue)}
                  disableFuture
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#1a237e' },
                          '&.Mui-focused fieldset': { borderColor: '#1a237e', borderWidth: '2px' },
                        },
                      }}
                    />
                  )}
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={tempEndDate}
                  onChange={(newValue) => setTempEndDate(newValue)}
                  disableFuture
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover fieldset': { borderColor: '#1a237e' },
                          '&.Mui-focused fieldset': { borderColor: '#1a237e', borderWidth: '2px' },
                        },
                      }}
                    />
                  )}
                />
              </Box>
              {tempStartDate && tempEndDate && dayjs(tempStartDate).isAfter(dayjs(tempEndDate)) && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  Tanggal mulai harus sebelum tanggal akhir
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Pilih rentang tanggal untuk memfilter data pengeluaran. Tanggal yang dipilih akan diterapkan setelah Anda menekan tombol "Terapkan".
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', gap: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Button
              onClick={handleCancelDateRange}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#666',
                color: '#666',
                '&:hover': { borderColor: '#1a237e', color: '#1a237e', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                px: 3,
                py: 1,
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleApplyDateRange}
              variant="contained"
              disabled={
                !tempStartDate || !tempEndDate || !dayjs(tempStartDate).isValid() || !dayjs(tempEndDate).isValid() || dayjs(tempStartDate).isAfter(dayjs(tempEndDate))
              }
              sx={{
                borderRadius: '10px',
                bgcolor: '#1a237e',
                '&:hover': { bgcolor: '#0d47a1' },
                '&.Mui-disabled': { bgcolor: '#B0BEC5', color: '#FFFFFF' },
                px: 3,
                py: 1,
              }}
            >
              Terapkan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog untuk tambah/edit pengeluaran */}
        <Dialog
          open={showModal}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              maxHeight: '90vh',
              margin: '16px',
              width: 'calc(100% - 32px)',
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              pt: 3,
              px: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '& .MuiTypography-root': { fontSize: '1.5rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
            }}
          >
            {editingId ? (
              <>
                <EditIcon sx={{ fontSize: 28 }} />
                Ubah Pengeluaran
              </>
            ) : (
              <>
                <AddIcon sx={{ fontSize: 28 }} />
                Tambah Pengeluaran
              </>
            )}
          </DialogTitle>
          <DialogContent sx={{ py: 4, px: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#1a237e' }}>
                Informasi Pengeluaran
              </Typography>
              <Divider />
            </Box>
            <DatePicker
              label="Tanggal"
              value={formData.tanggal}
              onChange={(newValue) => setFormData((prev) => ({ ...prev, tanggal: newValue }))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#1a237e' },
                      '&.Mui-focused fieldset': { borderColor: '#1a237e', borderWidth: '2px' },
                    },
                  }}
                />
              )}
            />
            <TextField
              label="Jumlah"
              name="nominal"
              type="text"
              value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: '#666', fontWeight: 500 }}>Rp</Typography>,
              }}
              placeholder="Contoh: 1.000.000"
              inputProps={{ 'aria-label': 'Nominal pengeluaran' }}
            />
            <TextField
              label="Keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={4}
              placeholder="Masukkan detail keterangan pengeluaran"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e', borderWidth: '2px' },
                },
              }}
              inputProps={{ 'aria-label': 'Keterangan pengeluaran' }}
            />
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 500, color: (theme) => theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <ReceiptIcon sx={{ fontSize: 20 }} />
                Unggah Nota {editingId ? '(Opsional)' : '*'}
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: (theme) => theme.palette.divider,
                  borderRadius: '12px',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#1a237e', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                }}
              >
                <input
                  accept="image/*"
                  type="file"
                  name="nota"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  id="nota-upload"
                  aria-label="Unggah nota pengeluaran"
                />
                <label htmlFor="nota-upload" style={{ cursor: 'pointer' }}>
                  {previewUrl ? (
                    <Box sx={{ position: 'relative' }}>
                      <img src={previewUrl} alt="Pratinjau Nota" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                        Klik untuk mengganti nota
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ py: 3 }}>
                      <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Klik atau seret file nota ke sini
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Format yang didukung: JPG, PNG, JPEG (Maks. 5MB)
                      </Typography>
                    </Box>
                  )}
                </label>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', gap: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#666',
                color: '#666',
                '&:hover': { borderColor: '#1a237e', color: '#1a237e', bgcolor: 'rgba(26, 35, 126, 0.04)' },
                px: 3,
                py: 1,
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '10px',
                bgcolor: '#1a237e',
                '&:hover': { bgcolor: '#0d47a1' },
                px: 3,
                py: 1,
                gap: 1,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SaveIcon />
                  Simpan
                </>
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog untuk konfirmasi penghapusan */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              margin: '16px',
              width: 'calc(100% - 32px)',
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              pt: 3,
              px: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <WarningIcon sx={{ fontSize: 28 }} />
            Konfirmasi Penghapusan
          </DialogTitle>
          <DialogContent sx={{ py: 4, px: { xs: 3, sm: 4 } }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Apakah Anda yakin ingin menghapus pengeluaran ini?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </DialogContent>
          <Actions sx={{ px: 4, py: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', gap: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, id: null })}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#666',
                color: '#666',
                '&:hover': { borderColor: '#d32f2f', color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.04)' },
                px: 3,
                py: 1,
              }}
            >
              Batal
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '10px',
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' },
                px: 3,
                py: 1,
                gap: 1,
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Menghapus...
                </>
              ) : (
                <>
                  <DeleteIcon />
                  Hapus
                </>
              )}
            </Button>
          </Actions>
        </Dialog>

        {/* Dialog untuk pratinjau nota */}
        <Dialog
          open={notaDialog.open}
          onClose={handleCloseNotaDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              margin: '16px',
              width: 'calc(100% - 32px)',
              maxHeight: '90vh',
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              pt: 3,
              px: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ReceiptIcon sx={{ fontSize: 28 }} />
            Pratinjau Nota
          </DialogTitle>
          <DialogContent
            sx={{
              py: 4,
              px: { xs: 3, sm: 4 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb': { background: '#666', borderRadius: '4px', '&:hover': { background: '#888' } },
            }}
          >
            {notaDialog.imageUrl ? (
              <img
                src={notaDialog.imageUrl}
                alt="Nota Pengeluaran"
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', objectFit: 'contain' }}
                onError={() => {
                  showSnackbar('Gagal memuat gambar nota', 'error');
                  handleCloseNotaDialog();
                }}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Gambar nota tidak tersedia
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)', gap: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Button
              onClick={handleCloseNotaDialog}
              variant="contained"
              sx={{ borderRadius: '10px', bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' }, px: 3, py: 1 }}
            >
              Tutup
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}