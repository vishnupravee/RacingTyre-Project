import axios from "axios";

const base_path = process.env.REACT_APP_API_URL;

//Masters.......

export const getTyreIssueReportList = async (category,name,racernumber) => {
  console.log(name,"naaaaaam");
  
  try {
    // Conditionally build the query parameters array
    const queryParams = [];
    if (category) queryParams.push(`cGuId=${encodeURIComponent(category)}`);
    if (name) queryParams.push(`fullname=${encodeURIComponent(name)}`);
    if (racernumber) queryParams.push(`RacerNumber=${encodeURIComponent(racernumber)}`);
    
    // If there are query parameters, join them into the query string
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    // Send the GET request to the API
    const response = await axios.get(`${base_path}/api/Reports/GetTyreReport${queryString}`);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors appropriately, such as logging or rethrowing
    console.error('Error fetching tyre issue report:', error);
    throw new Error('Failed to fetch tyre issue report');
  }
 
 
  
};
export const getTyreregisterReportList = async (category,name,racernumber) => {

  try {
    // Conditionally build the query parameters array
    const queryParams = [];
    if (category) queryParams.push(`cGuId=${encodeURIComponent(category)}`);
    if (name) queryParams.push(`fullname=${encodeURIComponent(name)}`);
    if (racernumber) queryParams.push(`RacerNumber=${encodeURIComponent(racernumber)}`);
    
    // If there are query parameters, join them into the query string
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    // Send the GET request to the API
    const response = await axios.get(`${base_path}/api/Reports/GetTyreReport${queryString}`);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors appropriately, such as logging or rethrowing
    console.error('Error fetching tyre issue report:', error);
    throw new Error('Failed to fetch tyre issue report');
  }
  };
export const getTyreScanningReportList = async (name) => {
  console.log(name,"naaaaam");

  try {
    // Conditionally build the query parameters array
    const queryParams = [];
    // if (category) queryParams.push(`cGuId=${encodeURIComponent(category)}`);
    if (name) queryParams.push(`fullname=${encodeURIComponent(name)}`);
    // if (racernumber) queryParams.push(`RacerNumber=${encodeURIComponent(racernumber)}`);
    
    // If there are query parameters, join them into the query string
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    // Send the GET request to the API
    const response = await axios.get(`${base_path}/api/Reports/GetTyreScanningReport${queryString}`);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle errors appropriately, such as logging or rethrowing
    console.error('Error fetching tyre issue report:', error);
    throw new Error('Failed to fetch tyre issue report');
  }
  };

  

  export const getRejectionReportList = async (category,name,racernumber) => {
    console.log(name,"naaaaaaam");
    
    try {
      // Conditionally build the query parameters array
      const queryParams = [];
      if (category) queryParams.push(`cGuId=${encodeURIComponent(category)}`);
      if (name) queryParams.push(`fullname=${encodeURIComponent(name)}`);
      if (racernumber) queryParams.push(`RacerNumber=${encodeURIComponent(racernumber)}`);
      
      // If there are query parameters, join them into the query string
      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
  
      // Send the GET request to the API
      const response = await axios.get(`${base_path}/api/Reports/GetTyreRejectionReport${queryString}`);
  
      // Return the data from the response
      return response.data;
    } catch (error) {
      // Handle errors appropriately, such as logging or rethrowing
      console.error('Error fetching tyre issue report:', error);
      throw new Error('Failed to fetch tyre issue report');
    }
  };

  export const getTyreSubReportguid = async (guid) => {
    console.log(guid,"iddddddd");
    
    const response = await axios.get(
      `${base_path}/api/Reports/GetTyreSubReport/${guid}`
    );
    return response.data;
  };
  export const getScanningTyreSubReportguid = async (guid) => {
    console.log(guid,"iddddddd");
    
    const response = await axios.get(
      `${base_path}/api/Reports/GetTyreScanningSubReport/${guid}`
    );
    return response.data;
  };
  export const getRejectionTyreSubReportguid = async (guid) => {
    console.log(guid,"iddddddd");
    
    const response = await axios.get(
      `${base_path}/api/Reports/GetTyreRejectSubReport/${guid}`
    );
    return response.data;
  };