import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    INIT_URL,
    SIGNOUT_USER_SUCCESS,
    USER_DATA,
    USER_TOKEN_SET,
    AD_CREATE
  } from "../../constants/ActionTypes";
  import axios from 'util/Api'

  export const setInitUrl = (url) => {
    return {
      type: INIT_URL,
      payload: url
    };
  };


  export const adCreate = (inputData) => {
    return (dispatch) => {
      dispatch({type: FETCH_START});
      axios.post('ads/create', inputData
      ).then(({data}) => {
        console.log("adCreate: ", data);
        if (data && data.details) {
         // dispatch({type: FETCH_SUCCESS});
          dispatch({type: AD_CREATE, payload: data.details});
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

