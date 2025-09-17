import { useNavigate } from 'react-router-dom';

import { menuFlatter } from 'helpers';
import { useSelector } from 'react-redux';
import { product } from 'constants/endpoints';

const useSmartNavigate = () => {
	const navigate = useNavigate();
	const { data } = useSelector(state => state.menu.categoriesList);

	const hrefNavigate = path => {
		return e => {
			e.preventDefault();
			navigate(path);
		};
	};

	const getHref = path => {
		if (!path) return product.CATALOG;
		const flat = menuFlatter(data.categories);
		const item = flat.find(f => f.path === path);
		return item?.href;
		// navigate(`/catalog/${item.path}`, { state: { href: item.href }});
	};

	const categoryNavigate = ({ key }) => {
		const flat = menuFlatter(data.categories);
		const item = flat.find(f => f.key === key);

		if (item && item.path) {
			// Это категория каталога
			navigate(`/catalog/${item.path}`);
		} else {
			// Это дополнительный пункт меню, используем key как путь напрямую
			navigate(key);
		}
	};

	return {
		navigate,
		hrefNavigate,
		getHref,
		categoryNavigate,
	};
};

export default useSmartNavigate;
