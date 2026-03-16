import axios from 'axios';
import Cookies from 'js-cookie';

const uploadService = {
  uploadProductImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = Cookies.get('auth-token');
    
    // Updated modular endpoint
    const response = await axios.post('http://localhost:8000/admin/uploads/product-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      withCredentials: true,
    });

    if (response.data && response.data.success && response.data.data) {
      return response.data.data.url;
    }
    
    throw new Error('Upload failed or returned invalid response');
  },
};

export default uploadService;
