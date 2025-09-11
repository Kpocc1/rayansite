import { useState } from "react";

import {
  getCustomer,
  setCustomer as setLocalStorage,
  removeCustomer as removeLocalStorage,
} from "helpers/customer";

const useCustomer = () => {
  const [customer, setCustomer] = useState(getCustomer());

  const saveCustomer = (customer) => {
    setCustomer(customer);
    setLocalStorage(customer);
  };

  const removeCustomer = () => {
    setCustomer();
    removeLocalStorage();
  };

  return {
    customer,
    setCustomer: saveCustomer,
    removeCustomer,
  };
};

export default useCustomer;
