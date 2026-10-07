import {
  getUserProfileApi,
  updateUserProfileApi,
  addAddressApi,
  deleteAddressApi,
  getAllAdminUsersApi,
  updateUserStatusApi
} from "./api";

export const userService = {
  getProfile: async () => {
    const response = await getUserProfileApi();
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await updateUserProfileApi(profileData);
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await addAddressApi(addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await deleteAddressApi(addressId);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await getAllAdminUsersApi();
    return response.data;
  },

  updateUserStatus: async (id, statusData) => {
    const response = await updateUserStatusApi(id, statusData);
    return response.data;
  }
};

export default userService;
