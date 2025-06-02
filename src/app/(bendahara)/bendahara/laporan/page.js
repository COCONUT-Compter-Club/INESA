'use client'

import { API_ENDPOINTS } from '@/config/api'
import { laporanService } from '@/services/laporanService'
import {
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarTodayIcon,
  TableView as ExcelIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
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
  keyframes,
  styled
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

// Fungsi untuk menerjemahkan pesan kode
const translateErrorMessage = (message) => {
  const translations = {
    'Failed to fetch data': 'Gagal mengambil data',
    'Failed to load image': 'Gagal memuat gambar',
    'Network Error': 'Kesalahan jaringan',
    'Invalid date format': 'Format tanggal tidak valid',
    'Failed to generate PDF': 'Gagal membuat PDF',
    'Failed to generate Excel': 'Gagal membuat Excel',
    'Unsupported format': 'Format tidak didukung',
  }
  return translations[message] || message || 'Terjadi Kesalahan'
}

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const AnimatedContainer = styled(Container)`
  animation: ${fadeIn} 0.5s ease-out;
`

const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 0.8s ease-out;
`

const StyledCard = styled(Card)(({ theme, variant, delay = 0 }) => ({
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? variant === 'income'
      ? 'linear-gradient(135deg, #2196F3 30%, #64B5F6 100%)'
      : variant === 'expense'
      ? 'linear-gradient(135deg, #1E88E5 30%, #42A5F5 100%)'
      : 'linear-gradient(135deg, #1976D2 30%, #2196F3 100%)'
    : variant === 'income'
    ? 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)'
    : variant === 'expense'
    ? 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)'
    : 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
  color: '#ffffff',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 16px rgba(0,0,0,0.4)'
    : '0 8px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  animation: `${slideUp} 0.5s ease-out ${delay}s both`,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 20px rgba(0,0,0,0.6)'
      : '0 12px 20px rgba(0,0,0,0.15)',
  },
  '& .MuiTypography-root': {
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  }
}))

const IconWrapper = styled(Box)({
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.2,
  fontSize: 48,
})

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
  '& .MuiTable-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableRow-root': {
        backgroundColor: '#f8f9fa',
        '& .MuiTableCell-root': {
          color: '#1976D2',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          borderBottom: '2px solid #1976D2',
          padding: '16px'
        }
      }
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          transform: 'scale(1.01)',
          transition: 'all 0.2s'
        },
        '& .MuiTableCell-root': {
          padding: '16px',
          borderBottom: '1px solid rgba(224, 224, 224, 0.8)'
        }
      }
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 24px',
  background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976D2',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: '#1976D2',
    },
  },
}))

export default function LaporanKeuangan() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [timeRange, setTimeRange] = useState('7days')
  const [loading, setLoading] = useState(true)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [saldoAkhir, setSaldoAkhir] = useState(0)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })
  const [showCustomCalendar, setShowCustomCalendar] = useState(false)
  const [tempStartDate, setTempStartDate] = useState(null)
  const [tempEndDate, setTempEndDate] = useState(null)
  const [confirmedStartDate, setConfirmedStartDate] = useState(null)
  const [confirmedEndDate, setConfirmedEndDate] = useState(null)
  const [previousTimeRange, setPreviousTimeRange] = useState('7days')
  const [showNotaPopup, setShowNotaPopup] = useState(false)
  const [notaUrl, setNotaUrl] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const open = Boolean(anchorEl)

  const loadImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) throw new Error(`Gagal memuat gambar: ${response.statusText}`)
      const blob = await response.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Kesalahan saat memuat gambar:', error)
      return null
    }
  }

  const getImageFormat = (url) => {
    if (/\.png$/i.test(url)) return 'PNG'
    if (/\.jpe?g$/i.test(url)) return 'JPEG'
    return null
  }

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url)

  const handleOpenNotaPopup = (url) => {
    setNotaUrl(url)
    setShowNotaPopup(true)
  }

  const handleCloseNotaPopup = () => {
    setShowNotaPopup(false)
    setNotaUrl(null)
  }

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoadingSummary(true)
        const [pemasukan, pengeluaran, saldo] = await Promise.all([
          laporanService.getTotalPemasukan(),
          laporanService.getTotalPengeluaran(),
          laporanService.getSaldo()
        ])
        setTotalPemasukan(Number.isFinite(pemasukan) ? pemasukan : 0)
        setTotalPengeluaran(Number.isFinite(pengeluaran) ? pengeluaran : 0)
        setSaldoAkhir(Number.isFinite(saldo) ? saldo : 0)
      } catch (error) {
        setAlert({
          open: true,
          message: translateErrorMessage('Gagal memuat ringkasan keuangan'),
          severity: 'error'
        })
        setTotalPemasukan(0)
        setTotalPengeluaran(0)
        setSaldoAkhir(0)
      } finally {
        setIsLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [])

  const formatDate = (date) => {
    if (!date || !dayjs(date).isValid()) return null
    return dayjs(date).format('YYYY-MM-DD')
  }

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-'
    try {
      return dayjs(backendDateString, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY HH:mm')
    } catch (e) {
      console.error('Error parsing date:', backendDateString, e)
      return 'Tanggal Tidak Valid'
    }
  }

  const formatNota = (nota) => {
    return nota && nota.trim() !== '' ? 'Ada' : 'Tidak Ada'
  }

  const getNotaLink = (nota) => {
    return nota && nota.trim() !== '' ? `${API_ENDPOINTS.BENDAHARA.UPLOAD_URL}${nota}` : null
  }

  const getDateRange = (range) => {
    const today = dayjs()
    if (range === 'custom' && confirmedStartDate && confirmedEndDate) {
      const start = dayjs(confirmedStartDate).startOf('day')
      const end = dayjs(confirmedEndDate).endOf('day')
      if (start.isAfter(end)) {
        setAlert({
          open: true,
          message: 'Tanggal mulai harus sebelum tanggal akhir',
          severity: 'error'
        })
        return { start: null, end: null, startDateObj: null, endDateObj: null }
      }
      return { start: formatDate(start), end: formatDate(end), startDateObj: start, endDateObj: end }
    }

    switch (range) {
      case 'today':
        return { start: formatDate(today.startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.startOf('day'), endDateObj: today.endOf('day') }
      case 'yesterday':
        return { start: formatDate(today.subtract(1, 'day').startOf('day')), end: formatDate(today.startOf('day')), startDateObj: today.subtract(1, 'day').startOf('day'), endDateObj: today.startOf('day') }
      case '7days':
        return { start: formatDate(today.subtract(7, 'day').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(7, 'day').startOf('day'), endDateObj: today.endOf('day') }
      case '1month':
        return { start: formatDate(today.subtract(1, 'month').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(1, 'month').startOf('day'), endDateObj: today.endOf('day') }
      case '3months':
        return { start: formatDate(today.subtract(3, 'month').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(3, 'month').startOf('day'), endDateObj: today.endOf('day') }
      case '6months':
        return { start: formatDate(today.subtract(6, 'month').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(6, 'month').startOf('day'), endDateObj: today.endOf('day') }
      case '1year':
        return { start: formatDate(today.subtract(1, 'year').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(1, 'year').startOf('day'), endDateObj: today.endOf('day') }
      default:
        return { start: formatDate(today.subtract(7, 'day').startOf('day')), end: formatDate(today.endOf('day')), startDateObj: today.subtract(7, 'day').startOf('day'), endDateObj: today.endOf('day') }
    }
  }

  const fetchDataByRange = async (range) => {
    try {
      setLoading(true)
      const { start, end } = getDateRange(range)
      let rangeData
      if (!start || !end) {
        const defaultStart = dayjs().subtract(7, 'day')
        rangeData = await laporanService.getLaporanByDateRange(
          formatDate(defaultStart),
          formatDate(dayjs())
        )
      } else {
        rangeData = await laporanService.getLaporanByDateRange(start, end)
      }
      setData(rangeData)
      setFilteredData(rangeData)
    } catch (error) {
      setError(translateErrorMessage('Gagal mengambil data laporan: ' + error.message))
      setData([])
      setFilteredData([])
      setAlert({
        open: true,
        message: translateErrorMessage('Gagal memuat data laporan'),
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataByRange(timeRange)
  }, [timeRange, confirmedStartDate, confirmedEndDate])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const formatRupiah = (number) => {
    const validNumber = Number.isFinite(Number(number)) ? Number(number) : 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validNumber)
  }

  const generatePDF = async () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 15
      let currentY = margin

      const addHeader = (isNewPage = false) => {
        const headerY = isNewPage ? margin : currentY
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(20)
        doc.setTextColor(25, 118, 210)
        doc.text('Laporan Keuangan Desa', pageWidth / 2, headerY + 8, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('Desa Bontomanai, Kec. Rumbia, Kab. Jeneponto', pageWidth / 2, headerY + 15, { align: 'center' })

        const { startDateObj, endDateObj } = getDateRange(timeRange)
        const periodLabel = startDateObj && endDateObj
          ? `${startDateObj.format('DD MMMM YYYY')} - ${endDateObj.format('DD MMMM YYYY')}`
          : 'Periode Tidak Diketahui'
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.text(`Periode: ${periodLabel}`, pageWidth / 2, headerY + 20, { align: 'center' })

        doc.setLineWidth(0.5)
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, headerY + 25, pageWidth - margin, headerY + 25)

        if (!isNewPage) {
          currentY = headerY + 30
        }
      }

      const addFooter = (pageNumber, totalPages) => {
        const footerY = pageHeight - 20
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`Halaman ${pageNumber} dari ${totalPages}`, pageWidth - margin, footerY, { align: 'right' })
        doc.text('Sistem Keuangan Desa Bontomanai', margin, footerY)
        doc.text(
          `Dicetak: ${dayjs().format('DD MMMM YYYY HH:mm')}`,
          margin,
          footerY + 5
        )
      }

      addHeader()

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210)
      doc.text('Ringkasan Keuangan', margin, currentY)
      currentY += 8

      const summaryData = [
        ['Total Pemasukan', formatRupiah(totalPemasukan)],
        ['Total Pengeluaran', formatRupiah(totalPengeluaran)],
        ['Saldo Akhir', formatRupiah(saldoAkhir)]
      ]

      autoTable(doc, {
        startY: currentY,
        head: [['Kategori', 'Jumlah']],
        body: summaryData,
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 10
        },
        bodyStyles: {
          halign: 'right',
          fillColor: [245, 245, 245]
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255]
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 80 },
          1: { halign: 'right', cellWidth: pageWidth - margin - 80 - margin }
        },
        margin: { left: margin, right: margin },
        theme: 'grid',
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1
      })

      currentY = doc.lastAutoTable.finalY + 15

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210)
      doc.text('Detail Transaksi', margin, currentY)
      currentY += 8

      if (filteredData.length === 0) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text('Tidak ada transaksi untuk periode ini', margin, currentY)
        currentY += 10
      } else {
        const imagePromises = filteredData
          .slice(0, 30) // Batasi hingga 30 gambar untuk performa
          .map((row, index) => row.nota && isImage(getNotaLink(row.nota)) ? ({ index, url: getNotaLink(row.nota) }) : null)
          .filter(Boolean)
          .map(async ({ index, url }) => ({
            index,
            data: await loadImageAsBase64(url)
          }))
        const images = await Promise.all(imagePromises)
        const imageMap = images.reduce((acc, { index, data }) => ({ ...acc, [index]: data }), {})

        const tableData = filteredData.map(row => [
          formatDateTime(row.tanggal),
          row.keterangan,
          formatRupiah(row.pemasukan || 0),
          formatRupiah(row.pengeluaran || 0),
          row.nota ? (isImage(getNotaLink(row.nota)) ? 'Lihat Gambar' : 'Lihat File') : 'Tidak Ada',
          formatRupiah(row.total_saldo || 0)
        ])

        const tableColumns = ['Tanggal', 'Keterangan', 'Pemasukan', 'Pengeluaran', 'Nota', 'Saldo']

        autoTable(doc, {
          startY: currentY,
          head: [tableColumns],
          body: tableData,
          styles: {
            font: 'helvetica',
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak',
            minCellHeight: 10
          },
          headStyles: {
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
          },
          bodyStyles: {
            textColor: [0, 0, 0],
            valign: 'middle'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          columnStyles: {
            0: { cellWidth: 40, halign: 'center' },
            1: { cellWidth: 100, halign: 'left', overflow: 'linebreak' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 30, halign: 'center' },
            5: { cellWidth: 35, halign: 'right' }
          },
          margin: { left: margin, right: margin },
          theme: 'grid',
          tableLineColor: [200, 200, 200],
          tableLineWidth: 0.1,
          didDrawCell: (data) => {
            if (data.column.index === 4 && data.cell.section === 'body' && filteredData[data.row.index]?.nota) {
              const notaUrl = getNotaLink(filteredData[data.row.index].nota)
              if (isImage(notaUrl)) {
                const imgData = imageMap[data.row.index]
                if (imgData) {
                  const format = getImageFormat(notaUrl)
                  if (format) {
                    const imgWidth = 12
                    const imgHeight = 6
                    const x = data.cell.x + (data.cell.width - imgWidth) / 2
                    const y = data.cell.y + (data.cell.height - imgHeight) / 2
                    doc.addImage(imgData, format, x, y, imgWidth, imgHeight)
                  } else {
                    doc.setFont('helvetica', 'normal')
                    doc.setFontSize(7)
                    doc.text('Format tidak didukung', data.cell.x + 2, data.cell.y + data.cell.height / 2 + 2)
                  }
                } else {
                  doc.setFont('helvetica', 'normal')
                  doc.setFontSize(7)
                  doc.text('Gagal memuat', data.cell.x + 2, data.cell.y + data.cell.height / 2 + 2)
                }
              } else {
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(7)
                doc.text('File Eksternal', data.cell.x + 2, data.cell.y + data.cell.height / 2 + 2)
              }
            }
          },
          didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages()
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber
            addHeader(true)
            addFooter(currentPage, pageCount)
            if (data.cursor) {
              data.cursor.y = margin + 30
            }
          },
          pageBreak: 'auto'
        })

        currentY = doc.lastAutoTable.finalY + 15
      }

      doc.addPage()
      currentY = margin
      addHeader(true)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      doc.save('laporan-keuangan-desa.pdf')
      handleClose()
    } catch (error) {
      console.error('Kesalahan saat membuat PDF:', error)
      setAlert({
        open: true,
        message: translateErrorMessage(`Terjadi kesalahan saat membuat PDF: ${error.message}`),
        severity: 'error'
      })
    }
  }

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
        Tanggal: formatDateTime(row.tanggal),
        Keterangan: row.keterangan,
        Pemasukan: row.pemasukan || 0,
        Pengeluaran: row.pengeluaran || 0,
        Nota: row.nota ? { t: 's', v: 'Buka Nota', l: { Target: getNotaLink(row.nota) } } : 'Tidak Ada',
        Saldo: row.total_saldo || 0
      })))
      const colWidths = [
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 }
      ]
      ws['!cols'] = colWidths
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan')
      XLSX.writeFile(wb, 'laporan-keuangan.xlsx')
      handleClose()
    } catch (error) {
      console.error('Kesalahan saat membuat Excel:', error)
      setAlert({
        open: true,
        message: translateErrorMessage('Terjadi kesalahan saat membuat Excel'),
        severity: 'error'
      })
    }
  }

  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun' },
    { value: 'custom', label: 'Custom' }
  ]

  const handleTimeRangeChange = (e) => {
    const value = e.target.value
    setPreviousTimeRange(timeRange)
    setTimeRange(value)
    if (value === 'custom') {
      setShowCustomCalendar(true)
    } else {
      setShowCustomCalendar(false)
      setTempStartDate(null)
      setTempEndDate(null)
      setConfirmedStartDate(null)
      setConfirmedEndDate(null)
      setPage(0)
    }
  }

  const handleApplyDateRange = () => {
    if (!tempStartDate || !tempEndDate) {
      setAlert({
        open: true,
        message: 'Silakan pilih tanggal mulai dan akhir',
        severity: 'error'
      })
      return
    }
    const start = dayjs(tempStartDate)
    const end = dayjs(tempEndDate)
    if (start.isAfter(end)) {
      setAlert({
        open: true,
        message: 'Tanggal mulai harus sebelum tanggal akhir',
        severity: 'error'
      })
      return
    }
    setConfirmedStartDate(tempStartDate)
    setConfirmedEndDate(tempEndDate)
    setPage(0)
    setShowCustomCalendar(false)
  }

  const handleCancelDateRange = () => {
    setShowCustomCalendar(false)
    setTimeRange(previousTimeRange)
    setTempStartDate(null)
    setTempEndDate(null)
    setConfirmedStartDate(null)
    setConfirmedEndDate(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
      <AnimatedContainer maxWidth="lg" sx={{
        mt: 4,
        mb: 4,
        backgroundColor: 'transparent',
        borderRadius: '16px',
        padding: { xs: '16px', sm: '24px' }
      }}>
        <Fade in={alert.open}>
          <Alert
            severity={alert.severity}
            sx={{
              position: 'fixed',
              top: 20,
              right: 16,
              zIndex: 9999,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: '12px'
            }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Fade>

        <Dialog open={showNotaPopup} onClose={handleCloseNotaPopup} maxWidth="sm" fullWidth>
          <DialogTitle sx={{
              pb: '2rem',
              color: '#fff',
              background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <VisibilityIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Lihat Nota
              </Typography>
            </DialogTitle>
            <DialogContent sx={{
              padding: { xs: '16px', sm: '24px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}
          >
            {notaUrl && isImage(notaUrl) ? (
              <Box
                component="img"
                src={notaUrl}
                alt="Nota"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  File bukan gambar (misalnya, PDF). Silakan unduh untuk melihat.
                </Typography>
                <Button
                  variant="contained"
                  href={notaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#1976D2',
                    '&:hover': { bgcolor: '#1565C0' }
                  }}
                >
                  Unduh File
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'rgba(0, 0, 0, 0.02)'
          }}>
            <Button
              onClick={handleCloseNotaPopup}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#666',
                color: '#666',
                '&:hover': { borderColor: '#1976D2', color: '#1976D2' }
              }}
            >
              Tutup
            </Button>
          </DialogActions>
        </Dialog>

        {loading && isLoadingSummary ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <AnimatedTypography variant="h4" sx={{ fontWeight: 600, color: '#1976D2' }}>
                Laporan Keuangan
              </AnimatedTypography>
              <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
                <StyledFormControl variant="outlined" size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                  <InputLabel>Filter Periode</InputLabel>
                  <Select value={timeRange} onChange={handleTimeRangeChange} label="Filter Periode">
                    {timeRangeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <Button
                  variant="outlined"
                  onClick={() => fetchDataByRange(timeRange)}
                  sx={{ borderRadius: '12px', minWidth: { xs: '100%', sm: 120 } }}
                >
                  Refresh Data
                </Button>
                <StyledButton
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleClick}
                  sx={{ minWidth: { xs: '100%', sm: 160 } }}
                >
                  Unduh Laporan
                </StyledButton>
              </Box>
            </Box>

            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={4}>
                <StyledCard variant="income" delay={0.2}>
                  <IconWrapper><TrendingUpIcon /></IconWrapper>
                  <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8 }}>Total Pemasukan</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPemasukan)}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard variant="expense" delay={0.4}>
                  <IconWrapper><TrendingDownIcon /></IconWrapper>
                  <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8 }}>Total Pengeluaran</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPengeluaran)}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard delay={0.6}>
                  <IconWrapper><AccountBalanceIcon /></IconWrapper>
                  <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.8 }}>Saldo Akhir</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(saldoAkhir)}
                  </Typography>
                </StyledCard>
              </Grid>
            </Grid>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={generatePDF}><PdfIcon sx={{ mr: 2, color: '#f44336' }} /> Unduh PDF</MenuItem>
              <MenuItem onClick={exportToExcel}><ExcelIcon sx={{ mr: 2, color: '#4CAF50' }} /> Unduh Excel</MenuItem>
            </Menu>

            <Dialog open={showCustomCalendar} onClose={handleCancelDateRange} maxWidth="xs" fullWidth>
              <DialogTitle sx={{
                background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <CalendarTodayIcon />
                Pilih Rentang Tanggal
              </DialogTitle>
              <DialogContent sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <DatePicker
                    label="Tanggal Mulai"
                    value={tempStartDate}
                    onChange={(newValue) => setTempStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <DatePicker
                    label="Tanggal Akhir"
                    value={tempEndDate}
                    onChange={(newValue) => setTempEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDateRange}>Batal</Button>
                <Button onClick={handleApplyDateRange} variant="contained">Terapkan</Button>
              </DialogActions>
            </Dialog>

            <StyledCard sx={{ display: { xs: 'none', md: 'block' } }}>
              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Keterangan</TableCell>
                      <TableCell align="right">Nominal</TableCell>
                      <TableCell align="center">Nota</TableCell>
                      <TableCell align="right">Saldo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center"><CircularProgress /></TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc' }} />
                          <Typography variant="body1" color="textSecondary">Tidak ada data</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        <TableRow key={row.id_pemasukan || row.id_pengeluaran || index}>
                          <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                          <TableCell>{row.keterangan}</TableCell>
                          <TableCell align="right" sx={{ color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f' }}>
                            {row.pemasukan > 0 ? `+ ${formatRupiah(row.pemasukan)}` : `- ${formatRupiah(row.pengeluaran)}`}
                          </TableCell>
                          <TableCell align="center">
                            {row.nota ? (
                              <IconButton onClick={() => handleOpenNotaPopup(getNotaLink(row.nota))}>
                                <VisibilityIcon />
                              </IconButton>
                            ) : 'Tidak Ada'}
                          </TableCell>
                          <TableCell align="right">{formatRupiah(row.total_saldo)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </StyledTableContainer>
            </StyledCard>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <Card key={row.id_pemasukan || row.id_pengeluaran || index} sx={{ mb: 2, borderRadius: '12px' }}>
                  <CardContent>
                    <Typography variant="body2">Tanggal: {formatDateTime(row.tanggal)}</Typography>
                    <Typography variant="body2">Keterangan: {row.keterangan}</Typography>
                    <Typography variant="body2" sx={{ color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f' }}>
                      Nominal: {row.pemasukan > 0 ? `+ ${formatRupiah(row.pemasukan)}` : `- ${formatRupiah(row.pengeluaran)}`}
                    </Typography>
                    <Typography variant="body2">
                      Nota: {row.nota ? (
                        <IconButton onClick={() => handleOpenNotaPopup(getNotaLink(row.nota))}>
                          <VisibilityIcon />
                        </IconButton>
                      ) : 'Tidak Ada'}
                    </Typography>
                    <Typography variant="body2">Saldo: {formatRupiah(row.total_saldo)}</Typography>
                  </CardContent>
                </Card>
              ))}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </div>
        )}
      </AnimatedContainer>
    </LocalizationProvider>
  )
}