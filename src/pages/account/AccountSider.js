import { Layout } from "antd";

import AccountMenu from "components/menu/AccountMenu";
import useBreakpoint from "hooks/useBreakpoint";

const AccountSider = () => {
  const { isDesktop } = useBreakpoint();

  return (
    isDesktop ? (
      <Layout.Sider width={280} className="pr-30">
        <AccountMenu />
      </Layout.Sider>
    ) : (
      <div className="mb-30">
        <AccountMenu />
      </div>
    )
  );
};

export default AccountSider;
