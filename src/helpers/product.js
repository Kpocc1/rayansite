
const getStock = (item) => {
  const PRE_ORDER_STATES = {
    0: "pre-order",
    999: "always-yes",
    450: "by-1c-balance",
  };

  const prop = item.weight.split(" ");
  let cn = prop[0].replace(",", ".");
  if (prop[1].includes("гр")) cn = cn / 1000;

  let stock = {
    quantity: item.quantity,
    stock: Math.floor(item.quantity / cn),
    label: `доступно: ${Math.floor(item.quantity / cn)} ${item.main_unit}`,
  };

  if (["pre-order", "always-yes"].includes(PRE_ORDER_STATES[item.pre_order])) {
    stock.quantity = item.pre_order;
    stock.stock = item.pre_order;
  }

  if (stock.quantity < cn) {
    stock = {
      quantity: 0,
      stock: 0,
      label: "нет в наличии",
    };
  }
  if (stock.quantity === 999) stock.label = "доступно много";

  return stock;
};

export { getStock };
