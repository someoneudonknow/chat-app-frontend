export const BASE_URL = `${import.meta.env.VITE_BASE_URL}/v1/api`;

// auth endpoints
export const LOGIN = "auth/login";
export const REGISTER = "auth/signup";
export const LOGOUT = "auth/logout";
export const REFRESH_TOKEN = "auth/refresh";

// users endpoints
export const USER_PROFILE = "users/profile";
export const PROFILE_COMPLETION = "users/profile/profileCompletion";
export const FORGOT_PASSWORD = "users/forgotPassword";
export const RESET_PASSWORD = "users/resetPassword";
export const SEARCH_USERS = "users/search";
export const USER_INTERESTS = "users/profile/interests";
export const USER_RECOMMENDED = "users/recommended";
export const USER_DISCOVER = "users/discover";
export const USER_CONTACTS = "users/contacts";
export const USER_CONSERVATIONS = "users/conservations";

// contacts endpoints
export const CONTACT_REQUEST = "contact-request";
export const CONTACT_REQUEST_RECEIVED = "contact-request/received";
export const CONTACT_REQUEST_SENT = "contact-request/sent";

// interests endpoints
export const INTEREST = "interests";
export const SEARCH_INTEREST = "interests/search";

// industry endpoints
export const INDUSTRY = "industries";

// upload endpoints
export const UPLOAD_ONE = "upload/attachment";
export const UPLOAD_MANY = "upload/attachments";

// conservations endpoints
export const CONSERVATION = "conservations";
export const JOINED_CONSERVATION = "conservations/joined/all";

// messages endpoints
export const MESSAGE = "messages";
export const MESSAGES_IN_CONSERVATION = "messages/conservations";
export const MESSAGE_ATTACHMENTS =
  "messages/conservations/:conservationId/attachments";
// call endpoints
export const CALL = "calls";
export const JOIN_CALL = "calls/join";
export const END_CALL = "calls/end";
