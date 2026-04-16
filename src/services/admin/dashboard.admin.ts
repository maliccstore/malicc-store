import apiClient from "../apiClient";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  views: number;
  addToCart: number;
  purchases: number;
}

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

    const [ordersRes, usersRes] = await Promise.all([
      apiClient.post("", { query: ordersQuery }),
      apiClient.post("", { query: usersQuery }),
    ]);

    if (ordersRes.data.errors) {
      throw new Error(ordersRes.data.errors[0].message);
    }

    if (usersRes.data.errors) {
      throw new Error(usersRes.data.errors[0].message);
    }

    const ordersData = ordersRes.data.data.adminOrders;
    const usersData = usersRes.data.data.users;

    const totalOrders = ordersData.totalCount || 0;

    const totalRevenue =
      ordersData.orders?.reduce(
        (sum: number, order: { totalAmount: number }) =>
          sum + (order.totalAmount || 0),
        0
      ) || 0;

    const totalCustomers = usersData?.length || 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
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
