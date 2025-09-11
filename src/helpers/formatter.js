import moment from "moment";
// не трогать
import ru from "moment/locale/ru";

const formatCurrency = (total, add = 0) => {
  // if (!parseInt(text)) return null;
  // return text ? `${text} ₽` : "";
  const number = +`${total}`.replaceAll(" ", "") + +add;
  const format = new Intl.NumberFormat("ru-RU").format(number);
  return `${format} ₽`;
};

const formatWeightWithUnit = (weightUnit = "", quantity = 1) => {
  const [weight, unit] = weightUnit.split(" ");
  const format = new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(weight * quantity);
  return `${(format)} ${unit}`;
};

const formatDate = (date, toFormat, fromFormat = "DD.MM.YYYY") => {
  let res;
  if (!date && !fromFormat) res = moment();
  else if (date && fromFormat) res = moment(date, fromFormat);
  else res = moment(date);

  if (!toFormat) return res.locale("ru");
  return res.locale("ru").format(toFormat);
};

export {
  formatCurrency,
  formatWeightWithUnit,
  formatDate,
};
