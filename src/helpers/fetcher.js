import { getCustomer } from "./customer";

const loadingStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

const getHeaders = () => {
  return getCustomer().token ? { Authorization: `${getCustomer().token}` } : {};
};

const SERVER_URL = process.env.NODE_ENV === "production" ?
  process.env.REACT_APP_SERVER_URL :
  process.env.REACT_APP_DEV_URL;

const fetcher = async (endpoint, options = {}) => {
  try {
    const url = new URL(`${SERVER_URL}${endpoint}`);
    const params = new URLSearchParams(url.search);
    params.set("store_id", getCustomer().store_id);
    const response = await fetch(`${url.origin}${url.pathname}?${params.toString()}`, {
      headers: getHeaders(),
      ...options,
    });
    return response;
  } catch (e) {
    // TODO: logger
    alert(`Fatal error from fetcher: ${e.toString()}`);
  }
  return false;
};

export default fetcher;

export {
  SERVER_URL,
  getHeaders,
  loadingStatus,
};
