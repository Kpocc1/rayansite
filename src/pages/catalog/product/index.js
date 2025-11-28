import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image, Rate, Tabs, Skeleton, Col, List, Row } from "antd";

import { fetchProduct, fetchReview } from "store/slices/productSlice";
import Breadcrumb from "components/Breadcrumb";
import HeadingTitle from "components/HeadingTitle";
import ProductItem from "components/product/ProductItem";
import ProductItemMain from "./ProductItemMain";
import Reviews from "./Reviews";
import useBreakpoint from "hooks/useBreakpoint";
import { loadingStatus } from "helpers/fetcher";
import { PRODUCTS_GRID } from "constants/breakpoints";

const ProductInfoTabs = ({ data, review }) => [
  {
    key: "1",
    label: "О товаре",
    children: (
      <div
        className="rn-description"
        dangerouslySetInnerHTML={{ __html: data.onec_description }}
      />
    ),
  },
  {
    key: "2",
    label: (
      <>
        Отзывы
        <Rate
          allowHalf
          disabled
          value={data.rating}
          style={{ fontSize: 13, marginLeft: 25 }}
        />
      </>
    ),
    children: <Reviews review={review} />,
  },
];

const Product = () => {
  const dispatch = useDispatch();
  const { product, review }= useSelector((state) => state.product);
  const { "*": path } = useParams();
  const { breakpoint } = useBreakpoint();
  const [product_id] = path.split("/");

  useEffect(() => {
    dispatch(fetchProduct(product_id));
    dispatch(fetchReview(product_id));
  }, [dispatch, product_id]);

  return (
    <div className="region">
      <Breadcrumb />

      <Row
        vertical={!["xxl", "xl"].includes(breakpoint)}
        justify="space-between"
        className="mb-30 white"
      >
        <Col sm={24} md={10}>
          <Row className="p-20">
            <Col className="mr-10" style={{ width: 90 }}>
              {product.status === loadingStatus.SUCCEEDED && product.data && product.data.images ? (
                product.data.images.map((d, i) => (
                  <Image
                    key={i}
                    width={90}
                    src={d.thumb}
                    preview={{ src: d.popup }}
                  />
                ))
              ) : product.status === loadingStatus.LOADING ? (
                <Skeleton.Image active style={{ width: 90, height: 90 }} />
              ) : null}
            </Col>
            <Col>
              {product.status === loadingStatus.SUCCEEDED && product.data && product.data.popup ? (
                <Image className="img-responsive" src={product.data.popup} />
              ) : product.status === loadingStatus.LOADING ? (
                <Skeleton.Image active style={{ width: "100%", maxWidth: 500 }} />
              ) : null}
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={14}>
          <div className="p-20">
            {product.status === loadingStatus.SUCCEEDED && product.data && product.data.heading_title ? (
              <ProductItemMain product_id={product_id} data={product.data} />
            ) : product.status === loadingStatus.LOADING ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <div>Товар не найден</div>
            )}
          </div>
        </Col>
      </Row>

      {product.status === loadingStatus.SUCCEEDED && product.data && product.data.heading_title ? (
        <>
          <div className="white p-30">
            <Tabs
              defaultActiveKey="1"
              onChange={console.log}
              items={ProductInfoTabs({ data: product.data, review })}
            />
          </div>
          {product.data.text_related && (
            <HeadingTitle title={product.data.text_related} />
          )}
          <List
            grid={PRODUCTS_GRID}
            className="rn-product-grid"
            itemLayout="horizontal"
            dataSource={product.data.products || Array(4).fill({})}
            renderItem={(item, index) => (
              <Skeleton active avatar loading={product.status !== loadingStatus.SUCCEEDED}>
                <ProductItem item={item} />
              </Skeleton>
            )}
          />
        </>
      ) : product.status === loadingStatus.LOADING ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </>
      ) : null}
    </div>
  );
};

export default Product;
