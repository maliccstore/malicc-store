import apiClient from "./apiClient";

import { Address, CreateAddressInput, UpdateAddressInput } from "../types/address";

export const addressAPI = {
    getUserAddresses: async (): Promise<Address[]> => {
        const query = `
      query GetUserAddresses {
        getUserAddresses {
          id
          fullName
          phoneNumber
          addressLine1
          addressLine2
          city
          state
          postalCode
          country
          isDefault
        }
      }
    `;

        try {
            const response = await apiClient.post("", { query });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.getUserAddresses;
        } catch (error) {
            throw error;
        }
    },

    createAddress: async (input: CreateAddressInput): Promise<Address> => {
        const query = `
      mutation CreateAddress($input: CreateAddressInput!) {
        createAddress(input: $input) {
          id
          fullName
          phoneNumber
          addressLine1
          addressLine2
          city
          state
          postalCode
          country
          isDefault
        }
      }
    `;

        try {
            // Ensure defaults
            const payload = {
                ...input,
                country: input.country || "IN",
                isDefault: input.isDefault || false
            }
            const response = await apiClient.post("", {
                query,
                variables: { input: payload },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.createAddress;
        } catch (error) {
            throw error;
        }
    },

    updateAddress: async (id: string, input: UpdateAddressInput): Promise<Address> => {
        const query = `
      mutation UpdateAddress($id: ID!, $input: UpdateAddressInput!) {
        updateAddress(id: $id, input: $input) {
          id
          fullName
          phoneNumber
          addressLine1
          addressLine2
          city
          state
          postalCode
          country
          isDefault
        }
      }
    `;

        try {
            const response = await apiClient.post("", {
                query,
                variables: { id, input },
            });

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data.updateAddress;
        } catch (error) {
            throw error;
        }
    },

    deleteAddress: async (id: string): Promise<boolean> => {
        const query = `
        mutation DeleteAddress($id: ID!) {
            deleteAddress(id: $id)
        }
    `;
        try {
            const response = await apiClient.post("", {
                query,
                variables: { id }
            });
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            return response.data.data.deleteAddress;
        } catch (error) {
            throw error;
        }
    },

    setDefaultAddress: async (id: string): Promise<Address> => {
        // We use updateAddress which handles isDefault logic for Customers.
        return await addressAPI.updateAddress(id, { isDefault: true });
    }
};
