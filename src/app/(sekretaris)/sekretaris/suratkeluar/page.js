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
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useCallback, useEffect, useState } from 'react';

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
});

const HeaderBox = styled(Box)({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AddButton = styled(Button)({
  backgroundColor: '#ffffff',
  color: '#800000',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
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

export default function SuratKeluar() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: null,
    perihal: '',
    ditujukan: '',
    file: null,
    existingFile: '',
    existingTitle: '',
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_GET_ALL}?page=${page + 1}&limit=${rowsPerPage}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );
      if (!response.ok) throw new Error('Gagal mengambil data surat keluar');

      const data = await response.json();
      if (Array.isArray(data.items)) {
        setRows(data.items);
        setTotalItems(data.totalItems || 0);
      } else {
        setRows([]);
        setTotalItems(0);
      }
    } catch (err) {
      setRows([]);
      setTotalItems(0);
      if (err.message !== 'Gagal mengambil data surat keluar') {
        setSnackbar({
          open: true,
          message: 'Terjadi kesalahan saat mengambil data',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = (data) => {
    if (!data.nomor || data.nomor.length < 3) return 'Nomor surat harus diisi dan minimal 3 karakter';
    if (!data.tanggal || !dayjs(data.tanggal).isValid()) return 'Tanggal harus diisi dan valid';
    if (!data.perihal || data.perihal.length < 5) return 'Perihal harus diisi dan minimal 5 karakter';
    if (!data.ditujukan || data.ditujukan.length < 3) return 'Ditujukan harus diisi dan minimal 3 karakter';
    if (!editingId && !data.file && !data.existingFile) return 'File harus diunggah untuk surat baru';
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Ukuran file terlalu besar (maksimal 5MB)',
          severity: 'error',
        });
        return;
      }
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

  const mapFormDataToSurat = (template, formData, content) => {
    let nomor = formData.no_surat || '';
    let perihal = template;
    let ditujukan = formData.tujuan || '';
    let fileContent = content;

    switch (template) {
      case 'Surat Keterangan Domisili':
        perihal = 'Keterangan Domisili';
        break;
      case 'Surat Keterangan Tidak Mampu':
        perihal = 'Keterangan Tidak Mampu';
        break;
      case 'Surat Keterangan Usaha':
        perihal = 'Keterangan Usaha';
        break;
      case 'Surat Pengantar SKCK':
        perihal = 'Pengantar SKCK';
        break;
      default:
        perihal = template;
    }

    return { nomor, perihal, ditujukan, fileContent };
  };

  const handleSave = async (isFromPrint = false, printData = null) => {
    let dataToSave;

    if (isFromPrint && printData) {
      const { template, formData: printFormData, content } = printData;
      const { nomor, perihal, ditujukan, fileContent } = mapFormDataToSurat(template, printFormData, content);

      if (!nomor || !perihal || !ditujukan || !fileContent) {
        setSnackbar({
          open: true,
          message: 'Data dari cetak surat tidak lengkap',
          severity: 'error',
        });
        return;
      }

      const blob = new Blob([fileContent], { type: 'text/html' });
      const file = new File([blob], `${nomor}_${template.replace(/\s/g, '_')}.html`, { type: 'text/html' });

      dataToSave = new FormData();
      dataToSave.append('nomor', nomor);
      dataToSave.append('tanggal', printFormData.tanggal || dayjs().format('YYYY-MM-DD'));
      dataToSave.append('perihal', perihal);
      dataToSave.append('ditujukan', ditujukan);
      dataToSave.append('file', file);
    } else {
      const validationError = validateForm(formData);
      if (validationError) {
        setSnackbar({
          open: true,
          message: validationError,
          severity: 'error',
        });
        return;
      }

      dataToSave = new FormData();
      dataToSave.append('nomor', formData.nomor);
      dataToSave.append('tanggal', dayjs(formData.tanggal).format('YYYY-MM-DD'));
      dataToSave.append('perihal', formData.perihal);
      dataToSave.append('ditujukan', formData.ditujukan);

      if (formData.file && typeof formData.file === 'object') {
        dataToSave.append('file', formData.file);
      } else if (formData.existingFile) {
        dataToSave.append('existing_file', formData.existingFile);
        dataToSave.append('existing_title', formData.existingTitle);
      }
    }

    setLoading(true);
    try {
      const endpoint = editingId
        ? API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_UPDATE(editingId)
        : API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_ADD;

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: isFromPrint ? getHeaders() : {},
        body: dataToSave,
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
        ditujukan: '',
        file: null,
        existingFile: '',
        existingTitle: '',
      });
      setPreviewFile(null);
      setExistingFile(null);
      fetchData();
      setSnackbar({
        open: true,
        message: editingId ? 'Surat berhasil diperbarui!' : 'Surat berhasil ditambahkan!',
        severity: 'success',
      });
    } catch (err) {
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
      nomor: row.nomor,
      tanggal: dayjs(row.tanggal),
      perihal: row.perihal,
      ditujukan: row.ditujukan,
      file: null,
      existingFile: row.file,
      existingTitle: row.title,
    };

    setFormData(formattedData);
    setInitialFormData(formattedData);
    setEditingId(row.id);

    if (row.file) {
      setExistingFile(row.file);
      const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8088';
      const filePath = row.file.startsWith('.') ? row.file.replace('.', '') : row.file;
      const previewUrl = `${backendBaseUrl}${filePath}`;
      setPreviewFile(previewUrl);
    } else {
      setExistingFile(null);
      setPreviewFile(null);
    }

    setShowModal(true);
  };

  const isFormChanged = () => {
    if (!initialFormData) return true;

    return (
      formData.nomor !== initialFormData.nomor ||
      formData.tanggal?.format('YYYY-MM-DD') !== dayjs(initialFormData.tanggal).format('YYYY-MM-DD') ||
      formData.perihal !== initialFormData.perihal ||
      formData.ditujukan !== initialFormData.ditujukan ||
      formData.file instanceof File
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
      const response = await fetch(API_ENDPOINTS.SEKRETARIS.SURAT_KELUAR_DELETE(deleteDialog.id), {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Gagal menghapus data');

      setSnackbar({
        open: true,
        message: 'Surat keluar berhasil dihapus.',
        severity: 'success',
      });
      fetchData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Gagal menghapus surat.',
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const handlePostRequest = async (data) => {
      await handleSave(true, data);
    };

    window.__handleSuratKeluarPost = handlePostRequest;
    return () => {
      delete window.__handleSuratKeluarPost;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewFile && previewFile.startsWith('blob:')) {
        URL.revokeObjectURL(previewFile);
      }
    };
  }, [previewFile]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StyledCard>
          <HeaderBox>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Pengelolaan Surat Keluar
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
                  ditujukan: '',
                  file: null,
                  existingFile: '',
                  existingTitle: '',
                });
                setPreviewFile(null);
                setExistingFile(null);
              }}
            >
              Tambah Surat
            </AddButton>
          </HeaderBox>

          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DescriptionIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  Belum ada data surat keluar.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Nomor Surat</strong></TableCell>
                      <TableCell><strong>Tanggal</strong></TableCell>
                      <TableCell><strong>Perihal</strong></TableCell>
                      <TableCell><strong>File</strong></TableCell>
                      <TableCell><strong>Aksi</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.nomor}</TableCell>
                        <TableCell>{dayjs(row.tanggal).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{row.perihal}</TableCell>
                        <TableCell>
                          {row.file ? (
                            <Tooltip title="Lihat File">
                              <IconButton
                                component="a"
                                href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8088'}/api/sekretaris/suratkeluar/file/${encodeURIComponent(row.file.replace(/^\.\//, '').replace('static/suratkeluar/', ''))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DescriptionIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption">Tidak ada file</Typography>
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
                  count={totalItems}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Baris per halaman:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
                />
              </TableContainer>
            )}
          </CardContent>

          <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{editingId ? 'Edit Surat Keluar' : 'Tambah Surat Keluar'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                margin="dense"
                label="Nomor Surat"
                name="nomor"
                value={formData.nomor}
                onChange={handleInputChange}
                required
                inputProps={{ minLength: 3 }}
                helperText={formData.nomor && formData.nomor.length < 3 ? 'Minimal 3 karakter' : ''}
                error={formData.nomor && formData.nomor.length < 3}
              />
              <DatePicker
                label="Tanggal"
                value={formData.tanggal}
                onChange={handleDateChange}
                disableFuture
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    required: true,
                    helperText: formData.tanggal && !dayjs(formData.tanggal).isValid() ? 'Tanggal tidak valid' : '',
                    error: formData.tanggal && !dayjs(formData.tanggal).isValid(),
                  },
                }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Perihal"
                name="perihal"
                value={formData.perihal}
                onChange={handleInputChange}
                required
                inputProps={{ minLength: 5 }}
                helperText={formData.perihal && formData.perihal.length < 5 ? 'Minimal 5 karakter' : ''}
                error={formData.perihal && formData.perihal.length < 5}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Ditujukan"
                name="ditujukan"
                value={formData.ditujukan}
                onChange={handleInputChange}
                required
                inputProps={{ minLength: 3 }}
                helperText={formData.ditujukan && formData.ditujukan.length < 3 ? 'Minimal 3 karakter' : ''}
                error={formData.ditujukan && formData.ditujukan.length < 3}
              />
              <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                Pilih File {editingId ? '(Opsional)' : '*'}
                <input
                  type="file"
                  name="file"
                  hidden
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.html"
                />
              </Button>
              {(previewFile || existingFile) && (
                <FilePreviewBox>
                  <Avatar><DescriptionIcon /></Avatar>
                  <Typography variant="body2">
                    {formData.file?.name || existingFile?.split('/').pop()}
                  </Typography>
                  {(previewFile || existingFile) && (
                    <a
                      href={previewFile || `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8088'}/api/sekretaris/suratkeluar/file/${encodeURIComponent(existingFile.replace(/^\.\//, '').replace('static/suratkeluar/', ''))}`}
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
              <Button onClick={() => setShowModal(false)} disabled={loading}>
                Batal
              </Button>
              <Button
                onClick={() => handleSave(false)}
                variant="contained"
                disabled={loading || (editingId && !isFormChanged())}
              >
                {loading ? <CircularProgress size={20} /> : editingId ? 'Update' : 'Simpan'}
              </Button>
            </DialogActions>
          </Dialog>

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

          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Konfirmasi Hapus</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} disabled={loading}>
                Batal
              </Button>
              <Button onClick={handleDeleteConfirm} color="error" disabled={loading} autoFocus>
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </Button>
            </DialogActions>
          </Dialog>
        </StyledCard>
      </Box>
    </LocalizationProvider>
  );
}