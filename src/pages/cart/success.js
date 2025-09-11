import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Result, Skeleton } from "antd";

import { fetchCartProducts, fetchSuccessPage } from "store/slices/cartSlice";
import Breadcrumb from "components/Breadcrumb";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";

const Success = () => {
  const { navigate } = useSmartNavigate();
  const dispatch = useDispatch();
  const { "*": orderId } = useParams();
  const { data, status } = useSelector((state) => state.cart.successPage);

  useEffect(() => {
    dispatch(fetchSuccessPage(orderId));
    dispatch(fetchCartProducts());
  }, [dispatch, orderId]);

  return (
    <div className="region">
      <Breadcrumb />
      <div className="white p-30">
        {loadingStatus.SUCCEEDED === status ? (
          <Result
            status="success"
            title={data.order_text}
            subTitle={
              <>
                <p>Ваш заказ послупил в обработку</p>
                <br />
                <p>Всю информацию о стадии заказа Вы будете получать по смс</p>
                <p>Вы можете просматривать историю заказов в <Button type="link" onClick={() => navigate("/account")}>Личном кабинете</Button></p>
              </>
            }
            extra={[
              <Button type="primary" onClick={() => navigate("/catalog")}>
                Продолжить покупки
              </Button>
            ]}
          />
        ) : (
          <Skeleton active paragraph={{ rows: 6 }} />
        )}
      </div>
    </div>
  );
};

export default Success;
