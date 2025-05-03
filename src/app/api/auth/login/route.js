// src/app/api/authentication/sign-in/route.js
import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

export async function POST(request) {
  try {
    const { nik, password } = await request.json();

    if (!nik || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIK dan password harus diisi',
        },
        { status: 400 }
      );
    }

    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ nik, password }),
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok || responseData.status !== 'OK') {
      return NextResponse.json(
        {
          success: false,
          message: responseData.message || 'Login gagal',
        },
        { status: response.status }
      );
    }

    const { token, user } = responseData.data;
    return NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        data: {
          token,
          user: {
            name: user.name || 'Admin',
            role: user.role || 'admin',
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat login',
        error: error.message,
      },
      { status: 500 }
    );
  }
}