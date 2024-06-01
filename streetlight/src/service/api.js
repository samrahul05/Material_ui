import axios from 'axios';

const API_URL = 'http://localhost:3005/users';

export const addUser = async (data) => {
  try {
    await axios.post(API_URL, data);
  } catch (err) {
    console.log("Error addUser Api", err.message);
  }
};
export const getUsers= async () => {
    try {
      return await axios.get(API_URL);
    } catch (err) {
      console.log("Error getUsers Api", err.message);
    }
  };



  export const getdatathinkspeak = async () => {
    try {
      return await axios.get("https://api.thingspeak.com/channels/2386238/feeds.json?api_key=9GG4PNUDQERSCE13&results");
    } catch (err) {
      console.log("Error getUsers Api", err.message);
    }
  };

export const getUser = async (data) => {
  try {
    return await axios.get(`${API_URL}/${data}`);
  } catch (err) {
    console.log("Error getUserdata Api", err.message);
  }
};



// export const EditUser = async (id, data) => {
//   try {
//     await axios.put(`${API_URL}/${id}`, data);
//   } catch (err) {
//     console.log("Error editUser Api", err.message);
//   }
// };

export const RemoveUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (err) {
    console.log("Error removeUser Api", err.message);
  }
};
