import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET
} from "../../constants/ActionTypes";
import axios from 'util/Api'

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const userSignUp = (values) => {

  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/register', values
    ).then(({data}) => {
      console.log("data:", data);
      if (data && data.token) {
        localStorage.setItem("token", JSON.stringify(data.token));
        axios.defaults.headers.common['access-token'] = "Bearer " + data.token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.token});
       // dispatch({type: USER_DATA, payload: data.user});
      } else {
        console.log("payload: data.error", data.error);
        dispatch({type: FETCH_ERROR, payload: "Network Error"});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const userSignIn = ({email, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/login', {
        email: email,
        password: password,
      }
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data && data.token) {
        console.log("hererre");
        localStorage.setItem("token", JSON.stringify(data.token));
        axios.defaults.headers.common['access-token'] = "Bearer " + data.token;
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.token});
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

export const forgotPassword = ({email, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/forgotPassword', {
        email: email,
        password: password,
      }
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data && data.token) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.token.access_token});
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

export const changePassword = ({email, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/forgotPassword', {
        email: email,
        password: password,
      }
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data) {
        dispatch({type: FETCH_SUCCESS});
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

export const resetPassword = (id,inputData) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/resetPassword/'+id, inputData
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data) {
        dispatch({type: FETCH_SUCCESS});
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

export const getUser = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    axios.post('users/auth',
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data.result) {
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_DATA, payload: data.user});
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      setTimeout(() => {
        localStorage.removeItem("token");
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: SIGNOUT_USER_SUCCESS});
      }, 2000);
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const validateExistingFields = (data) => {
  return (dispatch) => {
    axios.post('users/validateExistingFields',
    ).then(({data}) => {
      console.log("validateExistingFields: ", data);
      if (data) {
        return true
      } else {
        return false
      }
    }).catch(function (error) {
      return false
    });
  }
};



export const userSignOut = () => {
  alert("herer!!!!!!!!!!!!!!!:-)")
  return (dispatch) => {
    dispatch({type: FETCH_START});
    setTimeout(() => {
      localStorage.removeItem("token");
      dispatch({type: FETCH_SUCCESS});
      dispatch({type: SIGNOUT_USER_SUCCESS});
    }, 2000);
  }
};
