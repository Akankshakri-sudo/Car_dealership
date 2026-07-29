import axiosInstance from './axiosInstance';

export const vehicleApi = {
  getVehicles: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/vehicles?page=${page}&limit=${limit}`);
    return response.data;
  },

  searchVehicles: async (params) => {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.model) query.append('model', params.model);
    if (params.category) query.append('category', params.category);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);

    const response = await axiosInstance.get(`/vehicles/search?${query.toString()}`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await axiosInstance.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },

  purchaseVehicle: async (id, quantity = 1) => {
    const response = await axiosInstance.post(`/vehicles/${id}/purchase`, { quantity });
    return response.data;
  },

  restockVehicle: async (id, quantity) => {
    const response = await axiosInstance.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  },
};
