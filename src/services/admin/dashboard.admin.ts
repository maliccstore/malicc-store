import apiClient from "../apiClient";
import {
  DashboardStats,
  ProductPerformance,
  FunnelStep,
} from "@/types/analytics";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const ordersQuery = `
      query AdminOrders {
        adminOrders {
          totalCount
          orders {
            totalAmount
          }
        }
      }
    `;

    const usersQuery = `
      query GetAllUsers {
        users {
          id
        }
      }
    `;

    const couponsQuery = `
      query ListCoupons($isActive: Boolean) {
        listCoupons(isActive: $isActive) {
          totalCount
        }
      }
    `;

    const productsQuery = `
      query GetAllProducts {
        products {
          totalCount
        }
      }
    `;

    const [ordersRes, usersRes, couponsRes, productsRes] = await Promise.all([
      apiClient.post("", { query: ordersQuery }),
      apiClient.post("", { query: usersQuery }),
      apiClient.post("", {
        query: couponsQuery,
        variables: { isActive: true },
      }),
      apiClient.post("", { query: productsQuery }),
    ]);

    if (ordersRes.data.errors) {
      throw new Error(ordersRes.data.errors[0].message);
    }

    if (usersRes.data.errors) {
      throw new Error(usersRes.data.errors[0].message);
    }

    if (couponsRes.data.errors) {
      throw new Error(couponsRes.data.errors[0].message);
    }

    if (productsRes.data.errors) {
      throw new Error(productsRes.data.errors[0].message);
    }

    const ordersData = ordersRes.data.data.adminOrders;
    const usersData = usersRes.data.data.users;
    const couponsData = couponsRes.data.data.listCoupons;
    const productsData = productsRes.data.data.products;

    const totalOrders = ordersData.totalCount || 0;

    const totalRevenue =
      ordersData.orders?.reduce(
        (sum: number, order: { totalAmount: number }) =>
          sum + (order.totalAmount || 0),
        0,
      ) || 0;

    const totalCustomers = usersData?.length || 0;
    const activeCoupons = couponsData?.totalCount || 0;
    const totalProducts = productsData?.totalCount || 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      activeCoupons,
      totalProducts,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      activeCoupons: 0,
      totalProducts: 0,
    };
  }
};
export const getProductAnalytics = async (): Promise<ProductPerformance[]> => {
  try {
    const query = ` 
      query GetAnalyticsProducts {
        analyticsProducts {
          productId
          productName
          views
          addToCart
          purchases
        }
      }
    `;

    const response = await apiClient.post("", { query });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.analyticsProducts || [];
  } catch (error) {
    console.error("Product analytics error:", error);
    return [];
  }
};

export const getAnalyticsFunnel = async (): Promise<FunnelStep[]> => {
  try {
    const query = `
      query GetAnalyticsFunnel {
        analyticsFunnel {
          step
          count
          dropOff
          conversionRate
        }
      }
     `;

    const response = await apiClient.post("", { query });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.analyticsFunnel || [];
  } catch (error) {
    console.error("Funnel analytics error:", error);
    return [];
  }
};
