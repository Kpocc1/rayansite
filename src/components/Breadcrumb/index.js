import { Breadcrumb as AntdBreadcrumb } from "antd";

const Breadcrumb = () => {
  return (
    <AntdBreadcrumb
      className="mb-20"
      separator="-"
      items={[
        {
          title: "Главная",
          href: "/",
        },
        {
          title: "Каталог",
          href: "/catalog",
        },
        {
          title: "Категория",
        },
      ]}
    />
  )
};

export default Breadcrumb;
