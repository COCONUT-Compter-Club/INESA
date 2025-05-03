import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request) {
  try {
    // 1. Validate Content-Type
    const contentType = request.headers.get('Content-Type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be multipart/form-data' },
        { status: 415, headers: CORS_HEADERS }
      );
    }

    // 2. Parse FormData
    let data;
    try {
      data = await request.formData();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid FormData format' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // // 3. Validate Authorization (opsional, uncomment jika diperlukan)
    // const token = request.headers.get('Authorization');
    // if (!token || !token.startsWith('Bearer ')) {
    //   return NextResponse.json(
    //     { success: false, message: 'Authorization token required' },
    //     { status: 401, headers: CORS_HEADERS }
    //   );
    // }

    // 4. Validate required fields
    const requiredFields = ['tanggal', 'nominal', 'keterangan', 'kategori'];
    const formValues = {};
    for (const field of requiredFields) {
      formValues[field] = data.get(field);
      if (!formValues[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing fields: ${field}`,
            missingFields: [field],
          },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    // 5. Validate date format (YYYY-MM-DD HH:mm)
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!dateRegex.test(formValues.tanggal)) {
      return NextResponse.json(
        { success: false, message: 'Date format must be YYYY-MM-DD HH:mm' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 6. Validate nominal
    const nominal = Number(formValues.nominal.toString().replace(/\D/g, ''));
    if (isNaN(nominal) || nominal <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nominal must be a positive number' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 7. Validate string fields
    if (!formValues.kategori.trim() || !formValues.keterangan.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category and description cannot be empty' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // 8. Handle file (nota) if present - File upload is optional
    const notaFile = data.get('nota');
    if (notaFile) {
      // Validate that notaFile is a valid file if provided
      if (!(notaFile instanceof File) || notaFile.size === 0) {
        return NextResponse.json(
          { success: false, message: 'Nota must be a valid file if provided' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      // Optional: Validate file size (e.g., max 5MB)
      if (notaFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Nota file size must not exceed 5MB' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      // Optional: Validate file type (e.g., only images)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(notaFile.type)) {
        return NextResponse.json(
          { success: false, message: 'Nota must be an image (JPEG, PNG, JPG)' },
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    // 9. Prepare payload for backend
    const formDataPayload = new FormData();
    formDataPayload.append('tanggal', formValues.tanggal);
    formDataPayload.append('nominal', nominal);
    formDataPayload.append('kategori', formValues.kategori.trim());
    formDataPayload.append('keterangan', formValues.keterangan.trim());
    if (notaFile) {
      formDataPayload.append('nota', notaFile);
    }

    console.log('Forwarding to backend:', {
      tanggal: formValues.tanggal,
      nominal: nominal,
      kategori: formValues.kategori,
      keterangan: formValues.keterangan,
      nota: notaFile ? `File attached: ${notaFile.name}` : 'No file provided (optional)',
    });

    // 10. Forward to backend API
    const backendResponse = await fetch(API_ENDPOINTS.BENDAHARA.PEMASUKAN_ADD, {
      method: 'POST',
      headers: {
        // 'Authorization': token, // Uncomment jika autentikasi diperlukan
        // Tidak perlu set 'Content-Type' karena FormData akan otomatis menanganinya
      },
      body: formDataPayload,
    });

    // 11. Handle backend response
    if (!backendResponse.ok) {
      let errorData;
      try {
        errorData = await backendResponse.json();
      } catch {
        errorData = { message: await backendResponse.text() };
      }

      console.error('Backend error:', backendResponse.status, errorData);

      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Backend processing failed',
          backendError: errorData,
        },
        {
          status: backendResponse.status,
          headers: CORS_HEADERS,
        }
      );
    }

    // 12. Return success response
    const result = await backendResponse.json();
    return NextResponse.json(
      {
        success: true,
        message: 'Income data saved successfully',
        data: result.data || result,
      },
      {
        status: 201,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}