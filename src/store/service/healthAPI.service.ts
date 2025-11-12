import apiClient from '../../services/apiClient';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  message: string;
}

export const healthAPI = {
  checkHealth: async (): Promise<HealthStatus> => {
    try {
      const query = `
        query HealthCheck {
          healthCheck {
            status
            timestamp
            uptime
            message
            
          }
        }
      `;

      const response = await apiClient.post('/graphql', {
        query,
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.healthCheck;
    } catch (error) {
      throw new Error(
        `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  ping: async (): Promise<string> => {
    try {
      const query = `
        query Ping {
          ping
        }
      `;

      const response = await apiClient.post(
        '/graphql',
        {
          query,
        },
        {
          timeout: 5000, // 5 second timeout
        }
      );

      return response.data.data.ping;
    } catch (error) {
      throw new Error(
        'Ping failed',
        error instanceof Error ? { cause: error } : undefined
      );
    }
  },
};
