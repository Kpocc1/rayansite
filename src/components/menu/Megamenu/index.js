import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { fetchCategoriesList } from "store/slices/menuSlice";
import useSmartNavigate from "hooks/useSmartNavigate";
import useBreakpoint from "hooks/useBreakpoint";
import { loadingStatus } from "helpers/fetcher";
import useAdditionalMenu from "hooks/useAdditionalMenu";
import { menuFlatter } from "helpers";

const Megamenu = ({ buttonIcon, topMenuOnly, ...rest }) => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.menu.categoriesList);
  const { isDesktop } = useBreakpoint();
  const additionalMenu = useAdditionalMenu();

  const { categoryNavigate, navigate } = useSmartNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategoriesList());
  }, [dispatch]);

  // Функция для поиска категории в структуре
  const findCategoryByKey = (categories, targetKey) => {
    for (const cat of categories || []) {
      if (cat.key === targetKey) {
        return cat;
      }
      if (cat.children) {
        const found = findCategoryByKey(cat.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  // Создаем mapping между label категорий с подкатегориями и их path
  const categoryLabelPathMap = useMemo(() => {
    const map = new Map();
    const processCategory = (category) => {
      if (category.children && category.children.length > 0 && category.path && category.label) {
        map.set(category.label, category.path);
      }
      if (category.children) {
        category.children.forEach(processCategory);
      }
    };
    (data.categories || []).forEach(processCategory);
    return map;
  }, [data.categories]);

  // Обработчик клика для всех элементов меню
  const handleMenuClick = ({ key }) => {
    categoryNavigate({ key });
  };

  // Обработчик клика на уровне DOM для категорий с подкатегориями
  useEffect(() => {
    const handleClick = (e) => {
      // Ищем элемент SubMenu title (заголовок подменю)
      // В Ant Design это может быть элемент с классом ant-dropdown-menu-submenu-title
      let submenuTitle = e.target.closest('.ant-dropdown-menu-submenu-title');
      
      // Если не нашли, пробуем другие возможные селекторы
      if (!submenuTitle) {
        submenuTitle = e.target.closest('[role="menuitem"]');
      }
      
      if (submenuTitle) {
        // Получаем текст заголовка
        const labelText = submenuTitle.textContent?.trim();
        
        if (labelText && categoryLabelPathMap.has(labelText)) {
          const path = categoryLabelPathMap.get(labelText);
          e.preventDefault();
          e.stopPropagation();
          navigate(`/catalog/${path}`);
        }
      }
    };

    // Добавляем обработчик на document с capture фазой для перехвата кликов
    document.addEventListener('mousedown', handleClick, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClick, true);
    };
  }, [navigate, categoryLabelPathMap]);

  // Преобразуем структуру категорий
  const menuItems = useMemo(() => {
    const categories = topMenuOnly
      ? (data.categories?.map(({ children, ...m }) => ({ ...m })) || [])
      : (data.categories || []);

    return [
      ...categories,
      ...(!isDesktop ? [{ type: 'divider' }, ...additionalMenu] : []),
    ];
  }, [data.categories, topMenuOnly, isDesktop, additionalMenu]);

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      trigger={["hover", "focus"]}
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
