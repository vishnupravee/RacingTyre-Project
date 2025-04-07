import axios from "axios";

const base_path = process.env.REACT_APP_API_URL;

//Transactions.......

export const getEventRegistrationList = async () => {
  const response = await axios.get(`${base_path}/api/EventRegistration/GetAll`);
  return response.data;
};
export const addNewEventRegistration = async (eventdata) => {
  console.log(eventdata,"daaata");
  
    const response = await axios.post(`${base_path}/api/EventRegistration/AddEventRegistration`, eventdata);
    return response;
  };
export const editEventRegistrationGuid = async (eventregistration) => {
    const response = await axios.put(`${base_path}/api/EventRegistration/UpdateEventRegistration/{GuId}`, eventregistration);
    return response;
  };
  export const deleteEventRegistration = async (guid) => {
    const response = await axios.delete(
      `${base_path}/api/EventRegistration/DeleteEventRegistration/{GuId}?guid=${guid}`,
     
    );
    return response;
  };

export const getTyreRegistrationList = async () => {
    const response = await axios.get(`${base_path}/api/TyreRegistration/GetAll`);
    return response.data;
  };
  export const addNewTyreRegistration = async (tyredata) => {
    console.log(tyredata,"daaata");
    
      const response = await axios.post(`${base_path}/api/TyreRegistration/AddTyreRegistration`, tyredata);
      console.log(response.data,"reponeeeeeee");
      
      return response;
    };

    export const getTyreRegistrationRacerist = async (fname) => {
      const response = await axios.get(`${base_path}/api/TyreRegistration/getRacerEventdetails/${fname}`);
      return response.data;
    };

    export const deleteTyreRegistration = async (guid) => {
      const response = await axios.delete(
        `${base_path}/api/TyreRegistration/DeleteTyreRegistration/${guid}`,
       
      );
      return response;
    };
    export const editTyreRegistration = async (tyredata) => {
      const response = await axios.put(`${base_path}/api/TyreRegistration/UpdateTyreRegistration`,tyredata);
      return response;
    };
    export const getTyreRegistrationguid = async (guid) => {
      const response = await axios.get(
        `${base_path}/api/TyreRegistration/GetById/${guid}`
      );
      return response;
    };