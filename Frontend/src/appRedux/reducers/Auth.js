import { INIT_URL, SIGNOUT_USER_SUCCESS, USER_DATA, USER_TOKEN_SET,AD_CREATE,AD_LIST,USER_DETAILS,HASHTAG_LIST, CLEAR_AD_LIST,AD_NO_AUTH_LIST} from "../../constants/ActionTypes";

const INIT_STATE = {
  token: JSON.parse(localStorage.getItem('token')),
  initURL: '',
  authUser: JSON.parse(localStorage.getItem('user')),

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {


    case INIT_URL: {
      return {...state, initURL: action.payload};
    }

    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        token: null,
        authUser: null,
        initURL: ''
      }
    }

    case USER_DATA: {
      return {
        ...state,
        authUser: action.payload,
      };
    }

    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload,
      };
    }

    case AD_CREATE: {
      return {
        ...state,
        ads: action.payload,
      };
    }

    case AD_LIST: {
      return {
        ...state,
        adsList: action.payload,
      };
    }
    case AD_NO_AUTH_LIST: {
      return {
        ...state,
        adNoAuthList: action.payload,
      };
    }
    case CLEAR_AD_LIST: {
      return {
        ...state,
        adsList: [],
      };
    }

    case USER_DETAILS: {
      return {
        ...state,
        userDetails: action.payload,
      };
    }

    case HASHTAG_LIST: {
      return {
        ...state,
        hashtagsList: action.payload,
      };
    }

    default:
      return state;
  }
}
