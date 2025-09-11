import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Layout, List, Skeleton, Tag, Typography } from "antd";
import { RedoOutlined } from "@ant-design/icons";

import { fetchHistories } from "store/slices/customerSlice";
import HeadingTitle from "components/HeadingTitle";
import AccountSider from "../AccountSider";
import Breadcrumb from "components/Breadcrumb";
import useBreakpoint from "hooks/useBreakpoint";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";
import { formatCurrency } from "helpers/formatter";
import { PRODUCTS_GRID } from "constants/breakpoints";

const Password = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.customer.histories);
  const { navigate } = useSmartNavigate(); 
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    dispatch(fetchHistories());
  }, [dispatch]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        title={data.heading_title}
        level={2}
        style={{ marginTop: 0, marginBottom: 30 }}
      />
      <Layout>
        <AccountSider />
        <Layout.Content className={isDesktop ? "pl-30" : ""}>
          <List
            grid={PRODUCTS_GRID}
            className="rn-product-grid"
            itemLayout="horizontal"
            dataSource={data.orders || Array(4).fill({})}
            renderItem={(item, index) => (
              <Skeleton active loading={status !== loadingStatus.SUCCEEDED}>
                <List.Item className="white">
                  <div className="m-0 p-20">
                    <Tag
                      style={{ fontSize: 16, fontWeight: 500, marginBottom: 10 }}
                      onClick={() => navigate(`/account/history/${item.order_id}`)}
                    >
                      <Typography.Link onClick={() => navigate(`/account/history/${item.order_id}`)}>
                        #{item.order_id}
                      </Typography.Link>
                    </Tag>
                    <br />
                    <Typography.Link onClick={() => navigate(`/account/history/${item.order_id}`)}>
                      {item.name}
                    </Typography.Link>
                    <div style={{ marginTop: 4 }}>{item.date_added}</div>
                    <div>
                      <Typography.Title level={4} className="mt-10 text-right">
                        {formatCurrency(item.total)}
                      </Typography.Title>
                      <p><Alert message={item.status} type="info" /></p>
                    </div>
                  </div>
                  <div className="p-10">
                    <div style={{}}>
                      {item.products?.map(p => (
                        <img
                          key={p.product_id}
                          src={p.image}
                          alt={p.name}
                          style={{ verticalAlign: "bottom", maxWidth: 70, maxHeight: 70 }}
                        />
                      ))}
                    </div>
                    <div className="p-20">
                      <Button
                        type="primary"
                        block
                        icon={<RedoOutlined />}
                        onClick={() => navigate(`/account/history/${item.order_id}`)}
                      >
                        Детали заказа
                      </Button>
                    </div>
                  </div>
                </List.Item>
              </Skeleton>
            )}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Password;
