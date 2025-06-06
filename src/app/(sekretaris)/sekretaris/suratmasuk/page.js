'use client';
import { API_ENDPOINTS, getHeaders } from '@/config/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Impor js-cookie

// Fungsi untuk memformat tanggal ke format Indonesia
const formatTanggalIndonesia = (tanggal) => {
  if (!tanggal) return '-';
  const date = new Date(tanggal);
  if (isNaN(date.getTime())) return '-';
  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
};

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.05)',
  overflow: 'hidden',
});

const HeaderBox = styled(Box)({
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AddButton = styled(Button)({
  backgroundColor: '#ffffff',
  color: '#2e7d32',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.1)',
  },
});

const FilePreviewBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  marginTop: theme.spacing(1),
}));

// Error Boundary Component
function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <Alert severity="error">
        Terjadi kesalahan: {error.message}. Silakan coba lagi atau hubungi
        administrator.
      </Alert>
    );
  }

  try {
    return children;
  } catch (err) {
    setError(err);
    return null;
  }
}

export default function SuratMasuk() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: null,
    perihal: '',
    asal: '',
    file: null,
    existingFile: '',
    existingTitle: '',
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  // Ambil token dari cookie
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || ''; // Menggunakan js-cookie untuk mengambil token
    }
    return '';
  };

  // Pastikan fetchData hanya dijalankan di sisi klien
  const fetchData = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setLoading(true);
    try {
      console.log('Fetching data from:', API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_GET_ALL);
      console.log('Headers:', getHeaders(getToken()));
      const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_GET_ALL, {
        method: 'GET',
        headers: getHeaders(getToken()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data surat masuk');
      }

      const data = await response.json();
      console.log('Data fetched:', data);
      setRows(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Gagal mengambil data surat masuk');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, file }));
      setPreviewFile(URL.createObjectURL(file));
      setExistingFile(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, tanggal: date }));
  };

  const handleSave = async () => {
    if (!formData.nomor || !formData.tanggal || !formData.perihal || !formData.asal) {
      setError('Semua field harus diisi');
      setSnackbar({
        open: true,
        message: 'Semua field harus diisi',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('nomor', formData.nomor);
      data.append('tanggal', dayjs(formData.tanggal).format('YYYY-MM-DD'));
      data.append('perihal', formData.perihal);
      data.append('asal', formData.asal);

      if (formData.file && typeof formData.file === 'object') {
        data.append('file', formData.file);
      } else if (formData.existingFile) {
        data.append('existing_file', formData.existingFile);
        data.append('existing_title', formData.existingTitle);
      }

      const endpoint = editingId
        ? API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_UPDATE(editingId)
        : API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_ADD;

      const headers = getHeaders(getToken());
      delete headers['Content-Type'];

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }

      setShowModal(false);
      setFormData({
        nomor: '',
        tanggal: null,
        perihal: '',
        asal: '',
        file: null,
        existingFile: '',
        existingTitle: '',
      });
      setPreviewFile(null);
      setExistingFile(null);
      fetchData();
      setSnackbar({
        open: true,
        message: editingId ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message || 'Gagal menyimpan data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    const formattedData = {
      nomor: row.nomor || '',
      tanggal: row.tanggal && dayjs(row.tanggal).isValid() ? dayjs(row.tanggal) : null,
      perihal: row.perihal || '',
      asal: row.asal || '',
      file: null,
      existingFile: row.file || '',
      existingTitle: row.title || '',
    };

    setFormData(formattedData);
    setInitialFormData(formattedData);
    setEditingId(row.id);

    if (row.file) {
      setExistingFile(row.file);
      const backendBaseUrl = 'https://bontomanai.inesa.id';
      const filePath = row.file.startsWith('.') ? row.file.replace('.', '') : row.file;
      setPreviewFile(`${backendBaseUrl}${filePath}`);
    } else {
      setExistingFile(null);
      setPreviewFile(null);
    }

    setShowModal(true);
  };

  const isFormChanged = () => {
    if (!initialFormData) return true;

    const compareDates = () => {
      if (!formData.tanggal && !initialFormData.tanggal) return true;
      if (!formData.tanggal || !initialFormData.tanggal) return false;
      return formData.tanggal.format('YYYY-MM-DD') === initialFormData.tanggal.format('YYYY-MM-DD');
    };

    return (
      formData.nomor !== initialFormData.nomor ||
      !compareDates() ||
      formData.perihal !== initialFormData.perihal ||
      formData.asal !== initialFormData.asal ||
      (formData.file instanceof File)
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({ open: false, id: null });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_MASUK_DELETE(deleteDialog.id), {
        method: 'DELETE',
        headers: getHeaders(getToken()),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus data');
      }

      setSnackbar({
        open: true,
        message: 'Data surat masuk telah dihapus.',
        severity: 'success',
      });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Terjadi kesalahan saat menghapus.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      handleDeleteDialogClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StyledCard>
          <HeaderBox>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Pengelolaan Surat Masuk
            </Typography>
            <AddButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowModal(true);
                setEditingId(null);
                setFormData({
                  nomor: '',
                  tanggal: null,
                  perihal: '',
                  asal: '',
                  file: null,
                  existingFile: '',
                  existingTitle: '',
                });
                setPreviewFile(null);
                setExistingFile(null);
                setError(null);
              }}
            >
              Tambah Surat
            </AddButton>
          </HeaderBox>

          <CardContent>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Nomor Surat</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tanggal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Perihal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Asal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>File</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Aksi</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.nomor || '-'}</TableCell>
                      <TableCell>{formatTanggalIndonesia(row.tanggal)}</TableCell>
                      <TableCell>{row.perihal || '-'}</TableCell>
                      <TableCell>{row.asal || '-'}</TableCell>
                      <TableCell>
                        {row.file && (
                          <Tooltip title="Lihat File">
                            <IconButton
                              component="a"
                              href={`https://bontomanai.inesa.id/${row.file.replace(/^\./, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <DescriptionIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton onClick={() => handleDeleteClick(row.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </CardContent>

          {/* Dialog Form */}
          <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{editingId ? 'Edit Surat Masuk' : 'Tambah Surat Masuk'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Nomor Surat"
                name="nomor"
                value={formData.nomor}
                onChange={handleInputChange}
                error={!formData.nomor && error}
                helperText={!formData.nomor && error ? 'Nomor surat wajib diisi' : ''}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal"
                  value={formData.tanggal}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      error={!formData.tanggal && error}
                      helperText={!formData.tanggal && error ? 'Tanggal wajib diisi' : ''}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                margin="dense"
                label="Perihal"
                name="perihal"
                value={formData.perihal}
                onChange={handleInputChange}
                error={!formData.perihal && error}
                helperText={!formData.perihal && error ? 'Perihal wajib diisi' : ''}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Asal Surat"
                name="asal"
                value={formData.asal}
                onChange={handleInputChange}
                error={!formData.asal && error}
                helperText={!formData.asal && error ? 'Asal surat wajib diisi' : ''}
              />
              <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                Pilih File
                <input type="file" name="file" hidden onChange={handleInputChange} />
              </Button>
              {(previewFile || existingFile) && (
                <FilePreviewBox>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                  <Typography variant="body2">
                    {formData.file?.name || existingFile?.split('/').pop() || 'File tidak tersedia'}
                  </Typography>
                  {(previewFile || existingFile) && (
                    <a
                      href={previewFile || `https://bontomanai.inesa.id${existingFile.replace(/^\./, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="small">Lihat</Button>
                    </a>
                  )}
                </FilePreviewBox>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowModal(false)}>Batal</Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={loading || (editingId && !isFormChanged())}
              >
                {loading ? <CircularProgress size={24} /> : editingId ? 'Update' : 'Simpan'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Apakah Anda yakin?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Data yang dihapus tidak dapat dikembalikan.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>Batal</Button>
              <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Ya, Hapus
              </Button>
            </DialogActions>
          </Dialog>
        </StyledCard>
      </Box>
    </ErrorBoundary>
  );
}