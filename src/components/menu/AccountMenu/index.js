import { Button, Menu } from "antd";
import {
  HeartOutlined,
  HistoryOutlined,
  UserOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";

import useSmartNavigate from "hooks/useSmartNavigate";
import { removeCustomer } from "helpers/customer";

const accountItems = [
  {
    label: "Профиль",
    key: "/account",
    icon: <UserOutlined />,
  },
  {
    label: "Безопасность",
    key: "/account/password",
    icon: <SecurityScanOutlined />,
  },
  {
    label: "История заказов",
    key: "/account/history",
    icon: <HistoryOutlined />,
  },
  {
    label: "Избранные",
    key: "/account/wishlist",
    icon: <HeartOutlined />,
  },
  // {
  //   label: "Возвраты",
  //   key: "/account/return",
  //   icon: <RedoOutlined />,
  // },
  // {
  //   label: "Бонусные баллы",
  //   key: "/account/reward",
  //   icon: <PoundCircleOutlined />,
  // },
];

const AccountMenu = () => {
  const { navigate } = useSmartNavigate();

  const handleMenuClick = ({ item, key, keyPath, domEvent }) => {
    navigate(key);
  };

  const handleLogout = () => {
    removeCustomer();
    window.location = "/";
  };

  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        items={accountItems}
        onClick={handleMenuClick}
      />
      <br />
      <Button
        block
        danger
        type="primary"
        onClick={handleLogout}
      >
        Выход
      </Button>
    </>
  );
};

export default AccountMenu;
