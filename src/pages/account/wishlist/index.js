import { Layout, List, Skeleton } from "antd";

import Breadcrumb from "components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadingStatus } from "helpers/fetcher";
import { fetchWishlist } from "store/slices/customerSlice";
import ProductItem from "components/product/ProductItem";
import AccountSider from "../AccountSider";
import HeadingTitle from "components/HeadingTitle";
import { PRODUCTS_GRID } from "constants/breakpoints";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.customer.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        level={2}
        title="Избранные товары"
        style={{ marginTop: 0 }}
      />
      <Layout>
        <AccountSider />
        <Layout.Content>
          <List
            grid={PRODUCTS_GRID}
            className="rn-product-grid"
            dataSource={data?.products || Array(4).fill({})}
            renderItem={(item) => (
              <Skeleton active loading={status !== loadingStatus.SUCCEEDED}>
                <ProductItem
                  item={item}
                  wishlistProps={{
                    active: true,
                    actionAfterDelete: () => dispatch(fetchWishlist()),
                  }}
                />
              </Skeleton>
            )}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Wishlist;
