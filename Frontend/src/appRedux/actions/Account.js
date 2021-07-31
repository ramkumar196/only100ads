import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_URL,
  AD_CREATE,
  USER_DETAILS
} from "../../constants/ActionTypes";
import axios from 'util/Api'

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};


export const getAccountDetails = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.get('account/userDetails'
    ).then(({data}) => {
      console.log("userDetails: ", data);
      if (data && data.details) {
       // dispatch({type: FETCH_SUCCESS});
       console.log("USER_DETAILS",data.details);
        dispatch({type: USER_DETAILS, payload: data.details});
      } else {
        console.log("Error-",data);
        dispatch({type: FETCH_ERROR, payload: data.message});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const updateProfile = (inputData) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('account/updateProfile', inputData
    ).then(({data}) => {
      console.log("updateProfile: ", data);
      if (data && data.details) {
       // dispatch({type: FETCH_SUCCESS});
      //  dispatch({type: AD_CREATE, payload: data.details});
      } else {
        console.log("Error-",data);
        dispatch({type: FETCH_ERROR, payload: data.message});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const updatePassword = (inputData) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('account/updatePassword', inputData
    ).then(({data}) => {
      console.log("updateProfile: ", data);
      if (data && data.details) {
       // dispatch({type: FETCH_SUCCESS});
        //dispatch({type: AD_CREATE, payload: data.details});
      } else {
        console.log("Error-",data);
        dispatch({type: FETCH_ERROR, payload: data.message});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};


