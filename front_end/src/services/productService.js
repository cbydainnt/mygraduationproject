// src/services/productService.js
import apiClient from '../config/axiosConfig';

export const getProducts = (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== '')
  );
  return apiClient.get('/products', { params: filteredParams });
};

export const getProductById = (id) => {
  return apiClient.get(`/products/${id}`);
};

// Sử dụng productPayload tương ứng với ProductRequestDTO
export const createProduct = (productPayload) => {
  return apiClient.post('/products', productPayload);
};

export const updateProduct = (id, productPayload) => {
  return apiClient.put(`/products/${id}`, productPayload);
};

export const deleteProduct = (id) => {
  return apiClient.delete(`/products/${id}`);
};

export const uploadProductImagesAPI = (files) => {
  const formData = new FormData();
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]); // Key 'files' khớp với backend
    }
  }
  return apiClient.post('/products/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};