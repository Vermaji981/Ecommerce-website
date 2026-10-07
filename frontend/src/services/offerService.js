import {
  getOffersApi,
  createOfferApi,
  updateOfferApi,
  deleteOfferApi
} from "./api";

export const offerService = {
  getOffers: async () => {
    const response = await getOffersApi();
    return response.data;
  },

  createOffer: async (offerData) => {
    const response = await createOfferApi(offerData);
    return response.data;
  },

  updateOffer: async (id, offerData) => {
    const response = await updateOfferApi(id, offerData);
    return response.data;
  },

  deleteOffer: async (id) => {
    const response = await deleteOfferApi(id);
    return response.data;
  }
};

export default offerService;
