import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, List, Skeleton, Typography } from "antd";

import Breadcrumb from "components/Breadcrumb";
import { fetchCategory } from "store/slices/productSlice";
import useSmartNavigate from "hooks/useSmartNavigate";
import { getImage } from "helpers";
import { loadingStatus } from "helpers/fetcher";
import { useParams } from "react-router-dom";
import { PRODUCTS_GRID } from "constants/breakpoints";

const dataCategories = [
  {
      "name": "Говядина",
      "image": "catalog/cat-cover/cat-goviadina.jpg",
      "path": "govyadina",
  },
  {
      "name": "Баранина",
      "image": "catalog/cat-cover/cat-baranina.jpg",
      "path": "baranina",
  },
  {
      "name": "Птица",
      "image": "catalog/cat-cover/cat-ptica.jpg",
      "path": "ptitsa",
  },
  {
      "name": "Полуфабрикаты (охлажд.)",
      "image": "catalog/cat-cover/cat-polufabricaty.jpg",
      "path": "polufabrikaty-ohlazhd",
  },
  {
      "name": "Полуфабрикаты (заморож.)",
      "image": "catalog/cat-cover/zampolufabr.jpg",
      "path": "polufabrikaty-zamorozh",
  },
  {
      "name": "Колбасные изделия",
      "image": "catalog/cat-cover/cat-kolbasy.jpg",
      "path": "kolbasnye-izdeliya",
  },
  {
      "name": "Деликатесы",
      "image": "catalog/cat-cover/cat-delikatesy.jpg",
      "path": "delikatesy",
  },
  {
      "name": "Маринады",
      "image": "catalog/cat-cover/cat-marinady.jpg",
      "path": "marinady",
  },
  {
      "name": "Корм для животных",
      "image": "catalog/cat-cover/cat-korm.jpg",
      "path": "korm-dlya-zhivotnyh",
  },
  {
      "name": "Сопутствующие товары",
      "image": "catalog/cat-cover/cat-copurstvuyushie.jpg",
      "path": "soputstvuyushtie-tovary",
  },
  {
      "name": "Субпродукты",
      "image": "catalog/cat-cover/cat-subproducty.jpg",
      "path": "subprodukty",
  }
];

const Catalog = ({ breadcrumb, grid }) => {
  const dispatch = useDispatch();
  const { "*": path } = useParams();
  const { data, status } = useSelector((state) => state.product.category);
  const { navigate, getHref } = useSmartNavigate();
  const url = getHref(path);

  useEffect(() => {
    if (url) dispatch(fetchCategory({ url }));
  }, [dispatch, url]);

  return (
    <div className="region">
      {breadcrumb ? breadcrumb : <Breadcrumb />}
      <Typography.Title level={3}>Каталог</Typography.Title>

      <List
        grid={grid || PRODUCTS_GRID}
        // dataSource={data.categories || Array(5 * 3).fill({})}
        dataSource={dataCategories}
        renderItem={(item) => (
          <Skeleton active avatar loading={status !== loadingStatus.SUCCEEDED}>
            <List.Item>
              <Card onClick={() => navigate(`/catalog/${item.path}`)}>
                <img
                  src={getImage(item.image)}
                  alt=""
                  className="img-responsive"
                />
                <strong>{item.name}</strong>
              </Card>
            </List.Item>
          </Skeleton>
        )}
      />
    </div>
  );
};

export default Catalog;
