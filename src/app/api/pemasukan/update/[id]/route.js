import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function PUT(request, { params }) {
  try {
    // 1. Parse FormData
    const formData = await request.formData();
    const { id } = params;

    // 2. Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 3. Validate Authorization (optional, commented out to match pengeluaran)
    // const token = request.headers.get('Authorization');
    // if (!token || !token.startsWith('Bearer ')) {
    //   return NextResponse.json(
    //     { success: false, message: 'Authorization token required' },
    //     { status: 401, headers: CORS_HEADERS }
    //   );
    // }

    // 4. Extract and validate required fields
    const tanggal = formData.get('tanggal');
    const nominal = formData.get('nominal');
    const kategori = formData.get('kategori');
    const keterangan = formData.get('keterangan');
    const nota = formData.get('nota');

    const requiredFields = ['tanggal', 'nominal', 'kategori', 'keterangan'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing fields: ${missingFields.join(', ')}`,
          missingFields
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 5. Validate date format (YYYY-MM-DD HH:mm)
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(tanggal)) {
      return NextResponse.json(
        { success: false, message: 'Date format must be YYYY-MM-DD HH:mm' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 6. Validate nominal
    const nominalValue = Number(nominal);
    if (isNaN(nominalValue) || nominalValue <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nominal must be a positive number' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 7. Validate kategori and keterangan
    if (!kategori.trim() || !keterangan.trim()) {
      return NextResponse.json(
        { success: false, message: 'Kategori and keterangan cannot be empty' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 8. Validate nota (if provided)
    if (nota) {
      if (!(nota instanceof File)) {
        return NextResponse.json(
          { success: false, message: 'Nota harus berupa file yang valid' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      // Validate file type
      const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!allowedFileTypes.includes(nota.type)) {
        return NextResponse.json(
          { success: false, message: 'Nota harus berupa file PNG, JPEG, atau PDF' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      // Validate file size (max 5MB)
      if (nota.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Ukuran nota tidak boleh melebihi 5MB' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      console.log('Received nota:', {
        name: nota.name,
        size: nota.size,
        type: nota.type
      }); // Log nota details
    }

    // 9. Prepare FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('tanggal', tanggal);
    backendFormData.append('nominal', nominalValue);
    backendFormData.append('kategori', kategori.trim());
    backendFormData.append('keterangan', keterangan.trim());
    if (nota) {
      backendFormData.append('nota', nota);
    }

    // 10. Forward to backend API
    const response = await fetch(`${API_ENDPOINTS.BENDAHARA.PEMASUKAN_UPDATE(id)}`, {
      method: 'PUT',
      headers: {
        // 'Authorization': token,
        'ngrok-skip-browser-warning': 'true'
      },
      body: backendFormData
    });

    // 11. Handle backend response
    const responseData = await response.json();
    console.log('Backend response:', responseData); // Log backend response

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || 'Gagal mengupdate pemasukan'
        },
        { status: response.status, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Berhasil mengupdate pemasukan',
        data: responseData.data
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Error updating pemasukan:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate pemasukan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}