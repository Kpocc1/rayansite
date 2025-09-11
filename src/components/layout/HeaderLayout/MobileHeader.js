import { useDispatch } from "react-redux";
import { Dropdown, Flex, Button, Skeleton } from "antd";
import {
  DownOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  AppstoreOutlined,
  PhoneOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Megamenu from "components/menu/Megamenu";
import { setMobileSearchModalIsOpen } from "store/slices/layoutSlice";
import InlineSpace from "components/layout/InlineSpace";
import useSmartNavigate from "hooks/useSmartNavigate";
import { formatCurrency } from "helpers/formatter";
import { getImage } from "helpers";

const MobileHeader = ({
  customer,
  handleSigninModalOpen,
  data,
  total,
  handleCityClick,
  handleLogoClick,
}) => {
  const dispatch = useDispatch();
  const { hrefNavigate } = useSmartNavigate();

  return (
    <>
      <div className="rm-mob-nav white">
        <Flex wrap justify="space-around">
          <a onClick={customer.token ? hrefNavigate("/account") : handleSigninModalOpen}>
            <UserOutlined style={{ fontSize: 18 }} /><br />{customer.token ? "Кабинет" : "Войти"}
          </a>
          <a href={`tel: ${data.telephone}`}>
            <PhoneOutlined style={{ fontSize: 18 }} /><br />Поддержка
          </a>
          <a href="/catalog" onClick={hrefNavigate("/catalog")}>
            <AppstoreOutlined style={{ fontSize: 18 }} /><br />Каталог
          </a>
          <a href="/account/wishlist" onClick={customer.token ? hrefNavigate("/account/wishlist") : handleSigninModalOpen}>
            <HeartOutlined style={{ fontSize: 18 }} /><br />Избранное
          </a>
          <a href="/cart" onClick={hrefNavigate("/cart")}>
            <ShoppingCartOutlined style={{ fontSize: 18 }} /><br />{total ? formatCurrency(total) : "Корзина"}
          </a>
        </Flex>
      </div>

      <div className="region lightgray">
        <Dropdown menu={{ items: data.cities_list, onClick: handleCityClick }}>
          {data.cities_list ? (
            <Button type="link">
              {data.cities_list[customer.store_id].label} <DownOutlined />
            </Button>
          ) : (
            <Skeleton.Button active />
          )}
        </Dropdown>
      </div>
      <div className="region white p-20">
        <Flex align="center" justify="space-between" style={{ width: "100%" }}>
          <Megamenu
            buttonIcon={<MenuOutlined style={{ fontSize: "1.5em" }} />}
            topMenuOnly
            type="link"
          />
          <InlineSpace width={10} />
          <a href="/" onClick={handleLogoClick}>
            <img
              src={getImage("catalog/logo_new-new-mirror.jpg")}
              alt=""
              style={{ width: 48 }}
            />
          </a>
          <InlineSpace width={20} />
          <Button
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
            size="large"
            onClick={() => dispatch(setMobileSearchModalIsOpen( true ))}
          />
        </Flex>
      </div>
    </>
  );
};

export default MobileHeader;
