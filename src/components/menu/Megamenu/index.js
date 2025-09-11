import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { fetchCategoriesList } from "store/slices/menuSlice";
import useSmartNavigate from "hooks/useSmartNavigate";
import useBreakpoint from "hooks/useBreakpoint";
import { loadingStatus } from "helpers/fetcher";
import useAdditionalMenu from "hooks/useAdditionalMenu";

const Megamenu = ({ buttonIcon, topMenuOnly, ...rest }) => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.menu.categoriesList);
  const { isDesktop } = useBreakpoint();
  const additionalMenu = useAdditionalMenu();

  const { categoryNavigate } = useSmartNavigate();

  useEffect(() => {
    dispatch(fetchCategoriesList());
  }, [dispatch]);

  return (
    <Dropdown
      menu={{
        items: [
          ...(topMenuOnly ? (data.categories?.map(({ children, ...m }) => ({ ...m })) || []) : (data.categories || [])),
          ...(!isDesktop ? [{ type: 'divider' }, ...additionalMenu] : []),
        ],
        onClick: categoryNavigate,
      }}
      trigger={["click"]}
    >
      <Button
        type="primary"
        size="large"
        loading={status !== loadingStatus.SUCCEEDED}
        {...(rest ? rest : {})}
      >
        {buttonIcon ? buttonIcon : <>Каталог <DownOutlined /></>}
      </Button>
    </Dropdown>
  );
};

export default Megamenu;
