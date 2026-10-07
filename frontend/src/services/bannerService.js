import {
  getBannersApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi
} from "./api";

export const bannerService = {
  getBanners: async () => {
    const response = await getBannersApi();
    return response.data;
  },

  createBanner: async (bannerData) => {
    const response = await createBannerApi(bannerData);
    return response.data;
  },

  updateBanner: async (id, bannerData) => {
    const response = await updateBannerApi(id, bannerData);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await deleteBannerApi(id);
    return response.data;
  }
};

export default bannerService;
