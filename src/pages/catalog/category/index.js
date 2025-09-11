import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Divider,
  Flex,
  Layout,
  List,
  Menu,
  Pagination,
  Row,
  Select,
  Skeleton,
  Typography,
} from "antd";

import { fetchCategory } from "store/slices/productSlice";
import ProductItem from "components/product/ProductItem";
import Breadcrumb from "components/Breadcrumb";
import useBreakpoint from "hooks/useBreakpoint";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";
import { PRODUCTS_GRID } from "constants/breakpoints";

const Category = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.product.category);
  const categoriesList = useSelector((state) => state.menu.categoriesList);
  const { "*": path } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const { navigate, categoryNavigate, getHref } = useSmartNavigate();
  const { isTablet, isDesktop } = useBreakpoint();
  const url = getHref(path);

  const handleSortSelect = (_, obj) => {
    const params = new URLSearchParams(searchParams);
    const params2 = new URLSearchParams(obj.query);
    params.set("sort", params2.get("sort"))
    params.set("order", params2.get("order"))
    setSearchParams(`&${params.toString()}`);
  };

  const handlePagination = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page)
    setSearchParams(`&${params.toString()}`);
  };

  useEffect(() => {
    if (url) dispatch(fetchCategory({ url, searchParams }));
  }, [dispatch, url, searchParams]);

  return (
    <div className="region">
      <Breadcrumb />
      <Layout>
        {isTablet && (
          <Layout.Content className="mb-30">
            {(data.category_id && categoriesList.status === loadingStatus.SUCCEEDED) ? (
              <Menu
                items={categoriesList.data.categories}
                mode="inline"
                defaultOpenKeys={data.parent_ids}
                defaultSelectedKeys={[`${data.category_id}`]}
                onClick={categoryNavigate}
              />
            ) : (
              <Skeleton active paragraph={{ rows: 10 }} />
            )}
          </Layout.Content>
        )}
        {isDesktop && (
          <Layout.Sider width={280} className="pr-30">
            {(data.category_id && categoriesList.status === loadingStatus.SUCCEEDED) ? (
              <Menu
                items={categoriesList.data.categories}
                defaultOpenKeys={data.parent_ids}
                defaultSelectedKeys={[`${data.category_id}`]}
                onClick={categoryNavigate}
              />
            ) : (
              <Skeleton active paragraph={{ rows: 10 }} />
            )}
          </Layout.Sider>
        )}
        <Layout.Content>
          {status === loadingStatus.SUCCEEDED ? (
            <>
              <Typography.Title level={2} style={{ marginTop: 0 }}>
                {data.heading_title}
              </Typography.Title>
              {data.categories.length > 0 && (
                <Row className="mb-20">
                  {data.categories.map((c, index) => (
                    <Button
                      onClick={() => navigate(`/catalog/${c.path}`)}
                      key={index}
                      type="dashed"
                      style={{ margin: "5px" }}
                    >
                      {c.name}
                    </Button>
                  ))}
                </Row>
              )}
              {data.sorts?.length > 0 && (
                <div className="text-left">
                  <Select
                    onChange={handleSortSelect}
                    defaultValue={`${data.sort}-${data.order}`}
                    options={data.sorts}
                  />
                </div>
              )}
            </>
          ) : (
            <Skeleton active />
          )}
          <Divider />
          <List
            grid={PRODUCTS_GRID}
            className="rn-product-grid"
            dataSource={data.products || Array(4 * 3).fill({})}
            renderItem={(item) => (
              <Skeleton active avatar loading={status !== loadingStatus.SUCCEEDED}>
                <ProductItem item={item} />
              </Skeleton>
            )}
          />
          <br />
          <div className="text-center mt-30">
            <Pagination
              current={data.current_page}
              pageSize={data.limit}
              total={data.product_total}
              showTotal={() => isDesktop ? <div className="text-gray">{data.results}</div> : ""}
              onChange={handlePagination}
            />
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Category;
