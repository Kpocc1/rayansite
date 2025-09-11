const init = {
  store_id: 0,
};

const getCustomer = () => localStorage.getItem("customer") ? JSON.parse(localStorage.getItem("customer")) : init;

const setCustomer = (data) => {
  const customer = getCustomer();
  Object.keys(data).forEach((k) => customer[k] = data[k]);
  localStorage.setItem("customer", JSON.stringify(customer));
};

const removeCustomer = () => localStorage.removeItem("customer");

export {
  getCustomer,
  setCustomer,
  removeCustomer,
};
