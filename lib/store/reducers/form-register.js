import {
  FORM_REGISTER_CLEAR,
  FORM_REGISTER_CLEAR_ERRORS,
  FORM_REGISTER_SET_FULL_NAME,
  FORM_REGISTER_SET_EMAIL,
  FORM_REGISTER_SET_PASSWORD,
  FORM_REGISTER_SET_PASSWORD_CONFIRM,
  FORM_REGISTER_SET_COUNTRY,
  FORM_REGISTER_SET_CALLING_CODE,
  FORM_REGISTER_SET_PHONE_NUMBER,
  FORM_REGISTER_SET_AVATAR,
  FORM_REGISTER_SET_ERROR_AND_MESSAGE,
} from '../actions/form-register'

function formRegister(
  state = {
    avatar: '',
    callingCode: '',
    country: '',
    email: '',
    fullName: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    error: {
      avatar: false,
      callingCode: false,
      country: false,
      email: false,
      fullName: false,
      password: false,
      passwordConfirm: false,
      phoneNumber: false,
    },
    errorMessage: {
      avatar: '',
      callingCode: '',
      country: '',
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
      phoneNumber: '',
    },
  },
  action,
) {
  switch (action.type) {
    case FORM_REGISTER_CLEAR:
      return {
        avatar: '',
        callingCode: '',
        country: '',
        email: '',
        fullName: '',
        password: '',
        passwordConfirm: '',
        phoneNumber: '',
      }
    case FORM_REGISTER_CLEAR_ERRORS:
      return {
        ...state,
        error: {
          avatar: false,
          callingCode: false,
          country: false,
          email: false,
          fullName: false,
          password: false,
          passwordConfirm: false,
          phoneNumber: false,
        },
        errorMessage: {
          avatar: '',
          callingCode: '',
          country: '',
          email: '',
          fullName: '',
          password: '',
          passwordConfirm: '',
          phoneNumber: '',
        },
      }
    case FORM_REGISTER_SET_FULL_NAME:
      return { ...state, fullName: action.payload }
    case FORM_REGISTER_SET_EMAIL:
      return { ...state, email: action.payload }
    case FORM_REGISTER_SET_PASSWORD:
      return { ...state, password: action.payload }
    case FORM_REGISTER_SET_PASSWORD_CONFIRM:
      return { ...state, passwordConfirm: action.payload }
    case FORM_REGISTER_SET_COUNTRY:
      return { ...state, country: action.payload }
    case FORM_REGISTER_SET_CALLING_CODE:
      return { ...state, callingCode: action.payload }
    case FORM_REGISTER_SET_PHONE_NUMBER:
      return { ...state, phoneNumber: action.payload }
    case FORM_REGISTER_SET_AVATAR:
      return { ...state, avatar: action.payload }
    case FORM_REGISTER_SET_ERROR_AND_MESSAGE:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.field]: action.payload.error,
        },
        errorMessage: {
          ...state.errorMessage,
          [action.payload.field]: action.payload.errorMessage,
        },
      }
    default:
      return state
  }
}

export default formRegister