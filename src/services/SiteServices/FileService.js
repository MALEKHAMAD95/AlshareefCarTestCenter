// FileService.js
// Handles file upload and download API calls

import ApiService from '../ApiService';

/**
 * File Upload API
 * Payload: FormData with field 'file' (binary)
 */
const upload = async (formData) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'POST',
      url: '/File/Upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    return error.response;
  }
};

/**
 * File Download API
 * Path param: fileId (string)
 */
const download = async (fileId) => {
  try {
    const response = await ApiService.fetchDataWithAxios({
      method: 'GET',
      url: `/File/DownloadFile/${fileId}`,
    });
    return response;
  } catch (error) {
    console.error('Error downloading file:', error);
    return error.response;
  }
};

export { upload, download };
