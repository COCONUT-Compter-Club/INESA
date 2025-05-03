'use client'

import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Card } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './styles.css';

const faqData = [
  {
    question: 'Bagaimana cara mengajukan surat keterangan domisili?',
    answer: 'Untuk mengajukan surat keterangan domisili, Anda dapat mengisi form pengajuan surat yang tersedia di website ini. Pastikan Anda melengkapi data seperti NIK, nama lengkap, dan tujuan pengajuan. Setelah itu, serahkan dokumen pendukung seperti KTP dan KK ke kantor desa.',
  },
  {
    question: 'Apa saja dokumen yang diperlukan untuk surat keterangan tidak mampu?',
    answer: 'Dokumen yang diperlukan meliputi KTP, KK, surat pengantar dari RT/RW, dan bukti pendapatan (jika ada). Anda juga perlu mengisi form pengajuan di website kami.',
  },
  {
    question: 'Berapa lama proses pengajuan surat?',
    answer: 'Proses pengajuan surat biasanya memakan waktu 1-3 hari kerja, tergantung pada jenis surat dan kelengkapan dokumen.',
  },
  {
    question: 'Apakah ada biaya untuk pengajuan surat?',
    answer: 'Pengajuan surat di Desa Bontomanai tidak dikenakan biaya, kecuali untuk keperluan tertentu yang memerlukan materai atau biaya administrasi resmi.',
  },
];

const FAQSuratDesa = () => {
  return (
    <Box className="page-background" id="faq" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Card sx={{ p: 4, bgcolor: 'background.card', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6, color: 'text.primary' }}
          >
            Pertanyaan Umum (FAQ)
          </Typography>
          <Box className="faq-container">
            {faqData.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 2, borderRadius: '8px !important' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <Typography variant="h5" className="faq-question" sx={{ fontWeight: 'bold' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'background.paper' }}>
                  <Typography sx={{ fontSize: '14px', lineHeight: '28px' }} className="faq-answer">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default FAQSuratDesa;