import axios from "axios";

const base_path = process.env.REACT_APP_API_URL;

//Masters.......

export const getEventList = async () => {
  const response = await axios.get(`${base_path}/api/Events/GetAll`);
  return response.data;
};
export const getcategoryList = async () => {
    const response = await axios.get(`${base_path}/api/Category/GetAll`);
    return response.data;
  };
  export const getRacerList = async () => {
    const response = await axios.get(`${base_path}/api/RacerRegistration/GetAll`);
    return response.data;
  };

export const addNewEvent = async (eventdata) => {
  const response = await axios.post(`${base_path}/api/Events/AddEvents`, eventdata);
  return response;
};

export const editEvent = async (eventdata) => {
  const response = await axios.put(`${base_path}/api/Events/UpdateEvents`, eventdata);
  return response;
};
export const getEventguid = async (guid) => {
  const response = await axios.get(
    `${base_path}/api/Events/GetById/${guid}`
  );
  return response.data;
};
export const getCategoryguid = async (guid) => {
  const response = await axios.get(
    `${base_path}/api/Category/GetById/${guid}`
  );
  return response;
};
export const getRcerguid = async (guid) => {
  const response = await axios.get(
    `${base_path}/api/RacerRegistration/GetByGuid/{GuId}?guid=${guid}`
  );
  return response;
};
export const addNewCategory = async (categorydata) => {
  const response = await axios.post(`${base_path}/api/Category/AddCategory`, categorydata);
  return response;
};

export const editCategory = async (categorydata) => {
  const response = await axios.put(`${base_path}/api/Category/UpdateCategory`, categorydata);
  return response;
};
export const addNewRacer = async (racerdata) => {
  const response = await axios.post(`${base_path}/api/RacerRegistration/AddRacerRegistration`, racerdata);
  return response;
};

export const editRacer = async (racerdata) => {
  const response = await axios.put(`${base_path}/api/RacerRegistration/UpdateRacerRegistration/{GuId}`, racerdata);
  return response;
};
export const deleteEvent = async (guid) => {
  const response = await axios.delete(
    `${base_path}/api/Events/DeleteEvents/${guid}`,
   );
  return response;
};
export const deleteCategory = async (guid) => {
  const response = await axios.delete(
    `${base_path}/api/Category/DeleteCategory/${guid}`,
   
  );
  return response;
};
export const deleteRacer = async (guid) => {
  const response = await axios.delete(
    `${base_path}/api/RacerRegistration/DeleteRacerRegistration/{GuId}?guid=${guid}`,
    );
  return response;
};
export const getbarcode = async (strtyre) =>{
  const response = await axios.get(
`${base_path}/api/TyreRegistration/TyreBarCode_CheckStatus/${strtyre}`
);
  return response;
};
