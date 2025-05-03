import Cookies from 'js-cookie';
import { format, isValid } from 'date-fns';

// Fungsi untuk memformat tanggal dari datetime-local ke format backend
const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) {
        throw new Error('Format tanggal tidak valid');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const pemasukanService = {
    /**
     * Add new income record
     * @param {Object} data - Income data including optional file
     * @returns {Promise<Object>} Response data
     */
    async addPemasukan(data) {
        try {
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal));
            formData.append('nominal', Number(data.nominal.toString().replace(/\D/g, '')));
            formData.append('kategori', data.kategori.trim());
            formData.append('keterangan', data.keterangan.trim());
            if (data.nota) {
                if (!(data.nota instanceof File)) {
                    throw new Error('Nota harus berupa file yang valid');
                }
                formData.append('nota', data.nota);
            }

            console.log('Sending FormData to server:', {
                tanggal: formData.get('tanggal'),
                nominal: formData.get('nominal'),
                kategori: formData.get('kategori'),
                keterangan: formData.get('keterangan'),
                nota: formData.get('nota') ? {
                    name: data.nota.name,
                    size: data.nota.size,
                    type: data.nota.type
                } : 'No file'
            }); // Enhanced debugging

            const response = await fetch('/api/pemasukan/add', {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: result.message || 'Pemasukan berhasil ditambahkan'
            };
        } catch (error) {
            console.error('Error in addPemasukan:', error);
            throw error;
        }
    },

    /**
     * Update income record
     * @param {string} id - Record ID
     * @param {Object} data - Updated data including optional file
     * @returns {Promise<Object>} Response data
     */
    async updatePemasukan(id, data) {
        try {
            const formData = new FormData();
            formData.append('tanggal', formatDateForBackend(data.tanggal));
            formData.append('nominal', Number(data.nominal.toString().replace(/\D/g, '')));
            formData.append('kategori', data.kategori.trim());
            formData.append('keterangan', data.keterangan.trim());
            if (data.nota) {
                if (!(data.nota instanceof File)) {
                    throw new Error('Nota harus berupa file yang valid');
                }
                formData.append('nota', data.nota);
            }

            console.log('Updating FormData for ID:', id, {
                tanggal: formData.get('tanggal'),
                nominal: formData.get('nominal'),
                kategori: formData.get('kategori'),
                keterangan: formData.get('keterangan'),
                nota: formData.get('nota') ? {
                    name: data.nota.name,
                    size: data.nota.size,
                    type: data.nota.type
                } : 'No file'
            }); // Enhanced debugging

            const response = await fetch(`/api/pemasukan/update/${id}`, {
                method: 'PUT',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include',
                body: formData,
            });

            const result = await response.json();
            console.log('Update response:', result); // Log response for debugging

            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengupdate pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: result.message || 'Pemasukan berhasil diupdate'
            };
        } catch (error) {
            console.error('Error in updatePemasukan:', error);
            throw error;
        }
    },

    /**
     * Delete income record
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Response data
     */
    async deletePemasukan(id) {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            // Log response for debugging
            console.log('Delete response status:', response.status);
            console.log('Delete response headers:', Object.fromEntries(response.headers));

            // Handle 204 No Content or successful responses
            if (response.status === 204) {
                return {
                    success: true,
                    message: 'Pemasukan berhasil dihapus'
                };
            }

            const result = await response.json();
            console.log('Delete response body:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menghapus pemasukan');
            }

            return {
                success: true,
                data: result.data,
                message: result.message || 'Pemasukan berhasil dihapus'
            };
        } catch (error) {
            console.error('Error in deletePemasukan:', error);
            throw error;
        }
    },

    /**
     * Get all income records
     * @param {number} page - Page number
     * @param {number} pageSize - Number of records per page
     * @returns {Promise<Object>} Pagination response with income records
     */
    async getAllPemasukan(page, pageSize) {
        try {
            const response = await fetch(`/api/pemasukan/getall?page=${page}&page_size=${pageSize}`, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getAllPemasukan:', error);
            throw error;
        }
    },

    /**
     * Get income records by date range
     * @param {string} start - Start date in YYYY-MM-DD format
     * @param {string} end - End date in YYYY-MM-DD format
     * @param {number} page - Page number
     * @param {number} pageSize - Number of records per page
     * @returns {Promise<Object>} Pagination response with income records
     */
    async getPemasukanByDateRange(start, end, page, pageSize) {
        try {
            if (!start || !end) {
                throw new Error('Tanggal mulai dan akhir harus diisi');
            }

            const response = await fetch(`/api/pemasukan/getall?page=${page}&page_size=${pageSize}&start_date=${start}&end_date=${end}`, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan berdasarkan rentang tanggal');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getPemasukanByDateRange:', error);
            throw error;
        }
    },

    /**
     * Get income record by ID
     * @param {string} id - Record ID
     * @returns {Promise<Object>} Income record
     */
    async getPemasukanById(id) {
        try {
            if (!id) {
                throw new Error('ID tidak valid');
            }

            const response = await fetch(`/api/pemasukan/get/${id}`, {
                method: 'GET',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data pemasukan');
            }

            const { data } = await response.json();
            return data;
        } catch (error) {
            console.error('Error in getPemasukanById:', error);
            throw error;
        }
    }
};