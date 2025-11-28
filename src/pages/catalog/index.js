import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, List, Skeleton, Typography, Flex } from "antd";

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
    <div className="region catalog-section">
      {breadcrumb ? breadcrumb : <Breadcrumb />}
      <div className="catalog-section-header">
        <h2 className="catalog-title">КАТАЛОГ</h2>
        <a href="/catalog" onClick={(e) => { e.preventDefault(); navigate('/catalog'); }} className="catalog-link-all">
          <span className="catalog-link-text">Перейти в каталог</span>
          <img
            src={`${process.env.PUBLIC_URL}/icons/icon-arrow-right-gray.svg`}
            alt=""
            className="catalog-link-icon"
          />
        </a>
      </div>

      <List
        grid={grid || PRODUCTS_GRID}
        className="catalog-products-list"
        // dataSource={data.categories || Array(5 * 3).fill({})}
        dataSource={dataCategories}
        renderItem={(item) => (
          <Skeleton active avatar loading={status !== loadingStatus.SUCCEEDED}>
            <List.Item>
              <Card 
                onClick={() => navigate(`/catalog/${item.path}`)}
                className="catalog-card"
                bodyStyle={{ padding: 0, height: '100%', position: 'relative' }}
              >
                <img
                  src={getImage(item.image)}
                  alt=""
                  className="catalog-card-image"
                />
                <div className="catalog-card-title">{item.name}</div>
              </Card>
            </List.Item>
          </Skeleton>
        )}
      />
    </div>
  );
};

export default Catalog;
