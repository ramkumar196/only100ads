import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    INIT_URL,
    AD_CREATE,
    AD_LIST,
    USER_DETAILS,
    HASHTAG_LIST,
    CLEAR_AD_LIST,
    AD_NO_AUTH_LIST
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

  export const adList = (params) => {
    return (dispatch) => {
      dispatch({type: FETCH_START});
      let query_txt = '';
      if(params && (params.keyword || params.hashtags)){
        query_txt = "?" + new URLSearchParams(params)
      }
      axios.get('ads/list'+query_txt
      ).then(({data}) => {
        console.log("adCreate: ", data);
        if (data && data.details) {
          console.log("AD_LIST",data.details)
          //dispatch({type: CLEAR_AD_LIST, payload: data.details});
          dispatch({type: AD_LIST, payload: data.details});
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

  export const adListNoAuth = (params) => {
    return (dispatch) => {
      dispatch({type: FETCH_START});
      let query_txt = '';
      if(params && (params.keyword || params.hashtags)){
        query_txt = "?" + new URLSearchParams(params)
      }
      axios.get('ads/list-no-auth'+query_txt
      ).then(({data}) => {
        console.log("adCreate: ", data);
        if (data && data.details) {
          console.log("AD_NO_AUTH_LIST",data.details)
          //dispatch({type: CLEAR_AD_LIST, payload: data.details});
          dispatch({type: AD_NO_AUTH_LIST, payload: data.details});
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

  export const hashtagList = (keyword) => {
    return (dispatch) => {
      dispatch({type: FETCH_START});
      let query_txt = '';
      if(keyword){
        query_txt = "?keyword="+keyword;
      }
      axios.get('hashtags/list'+query_txt
      ).then(({data}) => {
        console.log("hashtaglist: ", data);
        if (data && data.details) {
         // dispatch({type: FETCH_SUCCESS});
         console.log("HASHTAG_LIST",data.details)
          dispatch({type: HASHTAG_LIST, payload: data.details});
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


