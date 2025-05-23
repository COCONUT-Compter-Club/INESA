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
  TableRow,
  TextField,
  Tooltip,
  Typography,
  keyframes,
  styled
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { endOfDay, isValid, startOfDay, format } from 'date-fns'
import id from 'date-fns/locale/id'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'

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

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const AnimatedContainer = styled(Container)`
  animation: ${fadeIn} 0.5s ease-out;
`

const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 1000px 100%;
    animation: ${shimmer} 2s infinite linear;
  }
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
  const open = Boolean(anchorEl)

  const loadImageAsBase64 = async (url) => {
    try {
      console.log('Fetching image:', url)
      const response = await fetch(url, { mode: 'cors' })
      console.log('Response status:', response.status)
      if (!response.ok) throw new Error(`Gagal memuat gambar: ${response.statusText}`)
      const blob = await response.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error loading image:', error)
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
          message: 'Gagal memuat ringkasan keuangan',
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
    if (!date) return null
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-'
    try {
      const [datePart, timePart] = backendDateString.split(' ')
      const [day, month, year] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return new Date(year, month - 1, day, hours, minutes).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return backendDateString
    }
  }

  const formatNota = (nota) => {
    return nota && nota.trim() !== '' ? 'Ada' : 'Tidak Ada'
  }

  const getNotaLink = (nota) => {
    return nota && nota.trim() !== '' ? `${API_ENDPOINTS.BENDAHARA.UPLOAD_URL}${nota}` : null
  }

  const getDateRange = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    if (range === 'custom' && confirmedStartDate && confirmedEndDate) {
      const start = startOfDay(new Date(confirmedStartDate))
      const end = endOfDay(new Date(confirmedEndDate))
      if (start > end) {
        setAlert({
          open: true,
          message: 'Tanggal mulai harus sebelum tanggal akhir',
          severity: 'error'
        })
        return { start: null, end: null }
      }
      return { start: formatDate(start), end: formatDate(end), startDateObj: start, endDateObj: end }
    }

    switch (range) {
      case 'today':
        return { start: formatDate(today), end: formatDate(today.setHours(24, 0, 0, 0)), startDateObj: today, endDateObj: today }
      case 'yesterday':
        startDate.setDate(today.getDate() - 1)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      case '7days':
        today.setHours(24, 0, 0, 0)
        startDate.setDate(today.getDate() - 7)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      case '1month':
        today.setHours(24, 0, 0, 0)
        startDate.setMonth(today.getMonth() - 1)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      case '3months':
        today.setHours(24, 0, 0, 0)
        startDate.setMonth(today.getMonth() - 3)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      case '6months':
        today.setHours(24, 0, 0, 0)
        startDate.setMonth(today.getMonth() - 6)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      case '1year':
        today.setHours(24, 0, 0, 0)
        startDate.setFullYear(today.getFullYear() - 1)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
      default:
        today.setHours(24, 0, 0, 0)
        startDate.setDate(today.getDate() - 7)
        return { start: formatDate(startDate), end: formatDate(today), startDateObj: startDate, endDateObj: today }
    }
  }

  const fetchDataByRange = async (range) => {
    try {
      setLoading(true)
      const { start, end } = getDateRange(range)
      let rangeData
      if (!start || !end) {
        const defaultStart = new Date()
        defaultStart.setDate(defaultStart.getDate() - 7)
        rangeData = await laporanService.getLaporanByDateRange(
          formatDate(defaultStart),
          formatDate(new Date())
        )
      } else {
        const startDate = formatDate(start)
        const endDate = formatDate(end)
        rangeData = await laporanService.getLaporanByDateRange(startDate, endDate)
      }
      console.log('Fetched data:', rangeData)
      setData(rangeData)
      setFilteredData(rangeData)
    } catch (error) {
      setError('Gagal mengambil data laporan: ' + error.message)
      setData([])
      setFilteredData([])
      setAlert({
        open: true,
        message: 'Gagal memuat data laporan',
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

      // Helper function to add header
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
          ? `${format(startDateObj, 'dd MMMM yyyy', { locale: id })} - ${format(endDateObj, 'dd MMMM yyyy', { locale: id })}`
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

      // Helper function to add footer
      const addFooter = (pageNumber, totalPages) => {
        const footerY = pageHeight - 20
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`Halaman ${pageNumber} dari ${totalPages}`, pageWidth - margin, footerY, { align: 'right' })
        doc.text('Sistem Keuangan Desa Bontomanai', margin, footerY)
        doc.text(
          `Dicetak: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`,
          margin,
          footerY + 5
        )
      }

      // Initial header
      addHeader()

      // Ringkasan Keuangan
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

      // Detail Transaksi
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
          .slice(0, 50)
          .map((row, index) => row.nota ? ({ index, url: getNotaLink(row.nota) }) : null)
          .filter(Boolean)
          .map(async ({ index, url }) => ({
            index,
            data: await loadImageAsBase64(url)
          }))
        const images = await Promise.all(imagePromises)
        const imageMap = images.reduce((acc, { index, data }) => ({ ...acc, [index]: data }), {})
        console.log('Image map:', imageMap)

        const tableData = filteredData.map(row => [
          formatDateTime(row.tanggal),
          row.keterangan,
          formatRupiah(row.pemasukan || 0),
          formatRupiah(row.pengeluaran || 0),
          row.nota ? 'Lihat Nota' : 'Tidak Ada',
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
            minCellHeight: 12
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
            1: { cellWidth: 90, halign: 'left', overflow: 'linebreak' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 40, halign: 'center' },
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
                    const imgWidth = 10
                    const imgHeight = 5
                    const x = data.cell.x + 3 + (data.cell.width - imgWidth - 6) / 2
                    const y = data.cell.y + 3 + (data.cell.height - imgHeight - 6) / 2
                    console.log(`Image position: x=${x}, y=${y}, cell: x=${data.cell.x}, y=${data.cell.y}, width=${data.cell.width}, height=${data.cell.height}`)
                    doc.saveGraphicsState()
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'clip')
                    doc.addImage(imgData, format, x, y, imgWidth, imgHeight)
                    doc.restoreGraphicsState()
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

      // Add signature section on a new page to avoid overlap
      doc.addPage()
      currentY = margin
      addHeader(true)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text('Disetujui oleh:', pageWidth - margin - 80, currentY)
      doc.text('___________________________', pageWidth - margin - 80, currentY + 15)
      doc.text('Kepala Desa Bontomanai', pageWidth - margin - 80, currentY + 22)

      doc.save('laporan-keuangan-desa.pdf')
      handleClose()
    } catch (error) {
      console.error('PDF generation error:', error)
      setAlert({
        open: true,
        message: `Terjadi kesalahan saat membuat PDF: ${error.message}`,
        severity: 'error'
      })
    }
  }

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Laporan Keuangan')

      // Define columns with consistent width for Nota
      worksheet.columns = [
        { header: 'Tanggal', key: 'tanggal', width: 20 },
        { header: 'Keterangan', key: 'keterangan', width: 30 },
        { header: 'Pemasukan', key: 'pemasukan', width: 15, style: { numFmt: '"Rp"#,##0' } },
        { header: 'Pengeluaran', key: 'pengeluaran', width: 15, style: { numFmt: '"Rp"#,##0' } },
        { header: 'Nota', key: 'nota', width: 25 }, // 25 units ≈ 175 pixels
        { header: 'Saldo', key: 'saldo', width: 15, style: { numFmt: '"Rp"#,##0' } }
      ]

      // Style header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1976D2' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })

      // Fetch images for rows with nota
      const imagePromises = filteredData
        .map((row, index) => row.nota ? ({ index, url: getNotaLink(row.nota) }) : null)
        .filter(Boolean)
        .map(async ({ index, url }) => ({
          index,
          data: await loadImageAsBase64(url)
        }))
      const images = await Promise.all(imagePromises)
      const imageMap = images.reduce((acc, { index, data }) => ({ ...acc, [index]: data }), {})
      console.log('Excel image map:', imageMap)

      // Add data rows
      filteredData.forEach((row, index) => {
        const rowData = {
          tanggal: formatDateTime(row.tanggal),
          keterangan: row.keterangan,
          pemasukan: row.pemasukan || 0,
          pengeluaran: row.pengeluaran || 0,
          nota: row.nota ? (isImage(getNotaLink(row.nota)) ? 'Ada' : 'File Eksternal') : 'Tidak Ada',
          saldo: row.total_saldo || 0
        }
        const excelRow = worksheet.addRow(rowData)

        // Set minimum row height for consistency
        excelRow.height = 70 // Default height for all rows (pixels)

        // Style cells
        excelRow.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          cell.alignment = {
            vertical: 'middle',
            horizontal: colNumber === 1 ? 'left' : colNumber === 2 ? 'left' : 'center' // Center Nota column
          }
          if (colNumber === 3 && row.pemasukan > 0) {
            cell.font = { color: { argb: 'FF2E7D32' } }
          }
          if (colNumber === 4 && row.pengeluaran > 0) {
            cell.font = { color: { argb: 'FFD32F2F' } }
          }
          if (colNumber === 5 && row.nota && isImage(getNotaLink(row.nota))) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } } // Subtle background for image cells
          }
        })

        // Add image to Nota column
        if (row.nota && isImage(getNotaLink(row.nota))) {
          const imageData = imageMap[index]
          if (imageData) {
            const imageId = workbook.addImage({
              base64: imageData,
              extension: getImageFormat(getNotaLink(row.nota)).toLowerCase()
            })
            const columnWidthUnits = worksheet.columns[4].width || 25 // 25 units
            const columnWidthPixels = columnWidthUnits * 7 // Approximate: 1 unit ≈ 7 pixels
            const maxImageWidth = 120 // Fixed max width for uniformity
            const padding = 15 // Increased padding
            const imageWidth = Math.min(maxImageWidth, columnWidthPixels - padding * 2) // Fit within column with padding
            const imageHeight = (imageWidth / 140) * 45 // Maintain aspect ratio (original: 140x45)
            const rowHeight = imageHeight + padding * 2 // Row height includes padding
            excelRow.height = Math.max(excelRow.height, rowHeight) // Ensure row height fits image

            // Calculate offsets for centering
            const colOffset = (columnWidthPixels - imageWidth) / 2 / 7 // Convert pixels to column units
            const rowOffset = (excelRow.height - imageHeight) / 2 / 15 // Approximate: 1 pixel ≈ 1/15 row unit

            worksheet.addImage(imageId, {
              tl: { col: 4 + colOffset, row: index + 1 + rowOffset }, // Center image
              ext: { width: imageWidth, height: imageHeight },
              editAs: 'absolute' // Fixed positioning
            })
            excelRow.getCell(5).value = '' // Clear text to avoid overlap
            console.log(
              `Excel image: col=${4 + colOffset}, row=${index + 1 + rowOffset}, ` +
              `width=${imageWidth}, height=${imageHeight}, ` +
              `columnWidth=${columnWidthPixels}, rowHeight=${excelRow.height}`
            )
          } else {
            excelRow.getCell(5).value = 'Gagal Memuat'
            excelRow.getCell(5).font = { color: { argb: 'FFD32F2F' }, size: 10 } // Red text for failed loads
            excelRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' }
          }
        } else if (row.nota && !isImage(getNotaLink(row.nota))) {
          excelRow.getCell(5).font = { color: { argb: 'FF1976D2' }, size: 10 } // Blue text for external files
          excelRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' }
        }
      })

      // Add header information
      const { startDateObj, endDateObj } = getDateRange(timeRange)
      const periodLabel = startDateObj && endDateObj
        ? `${format(startDateObj, 'dd MMMM yyyy', { locale: id })} - ${format(endDateObj, 'dd MMMM yyyy', { locale: id })}`
        : 'Periode Tidak Diketahui'
      worksheet.spliceRows(1, 0, [], [], [], [])
      worksheet.mergeCells('A1:F1')
      worksheet.getCell('A1').value = 'Laporan Keuangan Desa'
      worksheet.getCell('A1').font = { size: 16, bold: true }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }
      worksheet.mergeCells('A2:F2')
      worksheet.getCell('A2').value = 'Desa Bontomanai, Kec. Rumbia, Kab. Jeneponto'
      worksheet.getCell('A2').font = { size: 12 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }
      worksheet.mergeCells('A3:F3')
      worksheet.getCell('A3').value = `Periode: ${periodLabel}`
      worksheet.getCell('A3').font = { size: 10, italic: true }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      // Adjust column widths and row heights
      worksheet.getRow(1).height = 30
      worksheet.getRow(2).height = 20
      worksheet.getRow(3).height = 20
      worksheet.getRow(4).height = 20

      // Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'laporan-keuangan.xlsx'
      link.click()
      URL.revokeObjectURL(link.href)

      handleClose()
    } catch (error) {
      console.error('Excel generation error:', error)
      setAlert({
        open: true,
        message: 'Terjadi kesalahan saat membuat Excel',
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
    { value: '1year', label: '1 Tahun Terakhir' },
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
    const start = startOfDay(new Date(tempStartDate))
    const end = endOfDay(new Date(tempEndDate))
    if (start > end) {
      setAlert({
        open: true,
        message: 'Tanggal mulai harus sebelum tanggal akhir',
        severity: 'error'
      })
      return
    }
    setConfirmedStartDate(tempStartDate)
    setConfirmedEndDate(tempEndDate)
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AnimatedContainer maxWidth="lg" sx={{
        mt: 4,
        mb: 4,
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#121212' : 'transparent',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <Fade in={alert.open}>
          <Alert
            severity={alert.severity}
            sx={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 9999,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              borderRadius: '12px'
            }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Fade>

        <Dialog
          open={showNotaPopup}
          onClose={handleCloseNotaPopup}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              margin: '16px',
              width: 'calc(100% - 32px)',
              maxHeight: 'calc(100vh - 32px)',
            }
          }}
        >
          <DialogTitle sx={{
            pb: 2,
            pt: 3,
            px: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '& .MuiTypography-root': {
              fontSize: '1.5rem',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <VisibilityIcon sx={{ fontSize: 28 }} />
            Lihat Nota
          </DialogTitle>
          <DialogContent sx={{
            py: 4,
            px: { xs: 3, sm: 4 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
          }}>
            {notaUrl && isImage(notaUrl) ? (
              <Box
                component="img"
                src={notaUrl}
                alt="Nota"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
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
                    '&:hover': {
                      bgcolor: '#1565C0'
                    }
                  }}
                >
                  Unduh File
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{
            px: 4,
            py: 3,
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: 'rgba(0, 0, 0, 0.02)',
          }}>
            <Button
              onClick={handleCloseNotaPopup}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#1976D2',
                  color: '#1976D2',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
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
              <AnimatedTypography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme => theme.palette.mode === 'dark' ? '#42A5F5' : '#1976D2',
                  textShadow: theme => theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                Laporan Keuangan
              </AnimatedTypography>
              <Box sx={{
                display: 'flex',
                gap: 2,
                width: { xs: '100%', sm: 'auto' },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <StyledFormControl
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: { xs: '100%', sm: '250px' }
                  }}
                >
                  <InputLabel>Filter Periode</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    label="Filter Periode"
                  >
                    {timeRangeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
                <Button
                  variant="outlined"
                  onClick={() => fetchDataByRange(timeRange)}
                  fullWidth={false}
                  sx={{
                    borderRadius: '12px',
                    minWidth: { xs: '100%', sm: '120px' }
                  }}
                >
                  Refresh Data
                </Button>
                <StyledButton
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleClick}
                  fullWidth={false}
                  sx={{
                    minWidth: { xs: '100%', sm: '160px' }
                  }}
                >
                  Unduh Laporan
                </StyledButton>
              </Box>
            </Box>

            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={4}>
                <StyledCard variant="income" delay={0.2} sx={{
                  p: { xs: 2, sm: 3 },
                  minHeight: { xs: '120px', sm: '140px' }
                }}>
                  <IconWrapper>
                    <TrendingUpIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                  </IconWrapper>
                  <Typography variant="subtitle1" sx={{
                    mb: 1,
                    opacity: 0.8,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Total Pemasukan
                  </Typography>
                  <Typography variant="h4" sx={{
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPemasukan)}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard variant="expense" delay={0.4} sx={{
                  p: { xs: 2, sm: 3 },
                  minHeight: { xs: '120px', sm: '140px' }
                }}>
                  <IconWrapper>
                    <TrendingDownIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                  </IconWrapper>
                  <Typography variant="subtitle1" sx={{
                    mb: 1,
                    opacity: 0.8,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Total Pengeluaran
                  </Typography>
                  <Typography variant="h4" sx={{
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(totalPengeluaran)}
                  </Typography>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledCard delay={0.6} sx={{
                  p: { xs: 2, sm: 3 },
                  minHeight: { xs: '120px', sm: '140px' }
                }}>
                  <IconWrapper>
                    <AccountBalanceIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
                  </IconWrapper>
                  <Typography variant="subtitle1" sx={{
                    mb: 1,
                    opacity: 0.8,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}>
                    Saldo Akhir
                  </Typography>
                  <Typography variant="h4" sx={{
                    fontWeight: 600,
                    position: 'relative',
                    zIndex: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    {isLoadingSummary ? 'Memuat...' : formatRupiah(saldoAkhir)}
                  </Typography>
                </StyledCard>
              </Grid>
            </Grid>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  minWidth: { xs: '200px', sm: '250px' }
                },
              }}
            >
              <MenuItem onClick={generatePDF} sx={{ py: { xs: 1.5, sm: 1 } }}>
                <PdfIcon sx={{ mr: 1, color: '#f44336' }} /> Unduh PDF
              </MenuItem>
              <MenuItem onClick={exportToExcel} sx={{ py: { xs: 1.5, sm: 1 } }}>
                <ExcelIcon sx={{ mr: 1, color: '#4CAF50' }} /> Unduh Excel
              </MenuItem>
            </Menu>

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
                  flexDirection: 'column'
                }
              }}
            >
              <DialogTitle sx={{
                pb: 2,
                pt: 3,
                px: 3,
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '& .MuiTypography-root': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <CalendarTodayIcon sx={{ fontSize: 28 }} />
                Pilih Rentang Tanggal
              </DialogTitle>
              <DialogContent sx={{
                py: 4,
                px: { xs: 3, sm: 4 },
                overflowY: 'auto',
                flex: 1
              }}>
                <Box sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                  pt: 2,
                  pb: 3,
                  mb: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                  }}>
                    <DatePicker
                      label="Tanggal Mulai"
                      value={tempStartDate}
                      onChange={(newValue) => setTempStartDate(newValue)}
                      disableFuture
                      maxDate={tempEndDate || undefined}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          fullWidth
                          helperText={tempStartDate && !isValid(tempStartDate) ? 'Tanggal tidak valid' : null}
                          error={tempStartDate && !isValid(tempStartDate)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&:hover fieldset': {
                                borderColor: '#1976D2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1976D2',
                                borderWidth: '2px',
                              }
                            }
                          }}
                        />
                      )}
                    />
                    <DatePicker
                      label="Tanggal Akhir"
                      value={tempEndDate}
                      onChange={(newValue) => setTempEndDate(newValue)}
                      disableFuture
                      minDate={tempStartDate || undefined}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          size="small"
                          fullWidth
                          helperText={tempEndDate && !isValid(tempEndDate) ? 'Tanggal tidak valid' : null}
                          error={tempEndDate && !isValid(tempEndDate)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&:hover fieldset': {
                                borderColor: '#1976D2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1976D2',
                                borderWidth: '2px',
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                  {tempStartDate && tempEndDate && startOfDay(tempStartDate) > endOfDay(tempEndDate) && (
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      Tanggal mulai harus sebelum tanggal akhir
                    </Typography>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Pilih rentang tanggal untuk memfilter data laporan keuangan. Tanggal yang dipilih akan diterapkan setelah Anda menekan tombol "Terapkan".
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{
                px: 4,
                py: 3,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                flexShrink: 0,
                position: 'sticky',
                bottom: 0,
                background: 'inherit',
                zIndex: 1
              }}>
                <Button
                  onClick={handleCancelDateRange}
                  variant="outlined"
                  sx={{
                    borderRadius: '10px',
                    borderColor: '#666',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#1976D2',
                      color: '#1976D2',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    },
                    px: 3,
                    py: 1
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleApplyDateRange}
                  variant="contained"
                  disabled={!tempStartDate || !tempEndDate || !isValid(tempStartDate) || !isValid(tempEndDate) || startOfDay(tempStartDate) > endOfDay(tempEndDate)}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#1976D2',
                    '&:hover': {
                      bgcolor: '#1565C0'
                    },
                    '&.Mui-disabled': {
                      bgcolor: '#B0BEC5',
                      color: '#FFFFFF'
                    },
                    px: 3,
                    py: 1
                  }}
                >
                  Terapkan
                </Button>
              </DialogActions>
            </Dialog>

            <StyledCard sx={{
              p: 0,
              background: 'white',
              color: 'inherit',
              display: { xs: 'none', md: 'block' }
            }}>
              <Box sx={{ p: 3 }}>
                <Box sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 2,
                  borderRadius: '8px 8px 0 0',
                  fontWeight: 500
                }}>
                  Kelola data keuangan desa dengan mudah
                </Box>
                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Keterangan</TableCell>
                        <TableCell align='right'>Nominal</TableCell>
                        <TableCell align='center'>Nota</TableCell>
                        <TableCell align='right'>Saldo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                            <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                            <Typography variant="body1" color="textSecondary">
                              Tidak ada data untuk periode ini
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((row, index) => (
                          <TableRow
                            key={row.id_pemasukan || row.id_pengeluaran || index}
                            sx={{
                              '&:hover': {
                                bgcolor: '#f8f9fa',
                                '& .action-buttons': {
                                  opacity: 1
                                }
                              }
                            }}
                          >
                            <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                            <TableCell sx={{
                              maxWidth: { md: '300px' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>{row.keterangan}</TableCell>
                            <TableCell
                              align='right'
                              sx={{
                                color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row.pemasukan > 0
                                ? `+ ${formatRupiah(row.pemasukan)}`
                                : `- ${formatRupiah(row.pengeluaran)}`
                              }
                            </TableCell>
                            <TableCell align='center' sx={{ fontWeight: 500 }}>
                              {row.nota ? (
                                <Tooltip title="Lihat Nota">
                                  <IconButton
                                    onClick={() => handleOpenNotaPopup(getNotaLink(row.nota))}
                                    sx={{ color: '#1976D2' }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                'Tidak Ada'
                              )}
                            </TableCell>
                            <TableCell align='right' sx={{
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}>
                              {formatRupiah(row.total_saldo)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </StyledCard>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
              {filteredData.map((row, index) => (
                <Card
                  key={row.id_pemasukan || row.id_pengeluaran || index}
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'visible',
                    bgcolor: 'background.paper'
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Tanggal
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDateTime(row.tanggal)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Keterangan
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {row.keterangan}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Nominal
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f'
                        }}
                      >
                        {row.pemasukan > 0
                          ? `+ ${formatRupiah(row.pemasukan)}`
                          : `- ${formatRupiah(row.pengeluaran)}`
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Nota
                      </Typography>
                      {row.nota ? (
                        <Tooltip title="Lihat Nota">
                          <IconButton
                            onClick={() => handleOpenNotaPopup(getNotaLink(row.nota))}
                            sx={{ color: '#1976D2' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Tidak Ada
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Saldo
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatRupiah(row.total_saldo)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {filteredData.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    bgcolor: 'background.paper',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    Tidak ada data untuk periode ini
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
        )}
      </AnimatedContainer>
    </LocalizationProvider>
  )
}