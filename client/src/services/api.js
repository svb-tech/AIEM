const API_BASE_URL='/api';

const apiCall=async (endpoint,options={})=>{
    const token=localStorage.getItem('token');
    
    
    
    const config={
        headers:{
            'Content-Type':'application/json',
            ...(token && {'Authorization':`Bearer ${token}`}),
            ...options.headers
        },
        ...options,
    };

    //convert body to json if it is an object
    
    if(config.body && typeof config.body=='object')
    {
        config.body=JSON.stringify(config.body);
    }

    try{
        // console.log(`🔄 API Call: ${endpoint}`, config);

        const response=await fetch(`${API_BASE_URL}${endpoint}`,config);
        const data=await response.json();

        if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    //  console.log(`✅ API Success: ${endpoint}`, data);
    return data;
    }
    catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    
    // Handle specific error cases
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if backend is running.');
    }
    
    if (error.message.includes('401')) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};
// HTTP methods
export const api = {
  get: (endpoint) => apiCall(endpoint),
  post: (endpoint, data) => apiCall(endpoint, { method: 'POST', body: data }),
  put: (endpoint, data) => apiCall(endpoint, { method: 'PUT', body: data }),
 delete: (endpoint, data) =>
    apiCall(endpoint, {
      method: 'DELETE',
      body: data,
    }),
};

export default api;

