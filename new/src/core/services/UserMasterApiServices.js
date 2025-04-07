import Password from "antd/es/input/Password";
import axios from "axios";

const base_path = process.env.REACT_APP_API_URL;

//User Masters.......

export const getUserList = async () => {
  const response = await axios.get(`${base_path}/api/UserMaster/GetAll`);
  return response.data;
};
export const getUserguid = async (guid) => {
  const response = await axios.get(
    `${base_path}/api/UserMaster/GetById/${guid}`
  );
  return response.data;
};
export const addNewUser= async (userdata) => {
    console.log(userdata,"daaata");
    
      const response = await axios.post(`${base_path}/api/UserMaster/AddUserMaster`, userdata);
      return response;
    };


    export const editUser = async (userdata) => {
      const response = await axios.put(`${base_path}/api/UserMaster/UpdateUserMaster`, userdata);
      return response;
    };

    export const getUserLogin = async ({username,password}) => {
      const response = await axios.get(
        `${base_path}/api/UserMaster/GetLogin/${username}/${password}`
      )
      return response.data;
  }
  export const deleteUser = async (guid) => {
    const response = await axios.delete(
      `${base_path}/api/UserMaster/DeleteUserMaster/${guid}`,
     );
    return response;
  };


  