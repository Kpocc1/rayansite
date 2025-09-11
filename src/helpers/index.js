import { SERVER_URL } from "./fetcher";

const getImage = (path, parent = "/image/") => `${SERVER_URL}${parent}${path}`;

const menuFlatter = (categories = []) => {
  const flat = [];
  categories.forEach(({ children, ...rest }) => {
    flat.push(rest);
    children?.forEach(({ children, ...rest }) => {
      flat.push(rest);
      children?.forEach((cat3) => {
        flat.push(cat3);
      });
    });
  });
  return flat;
};

export {
  getImage,
  menuFlatter,
};
