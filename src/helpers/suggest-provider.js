/**
 * Форматирование адреса из геообъекта
 * Возвращает человекочитаемый адрес
 */
const geoObjectDisplayName = geoObject => {
	const addr = geoObject.properties.get(
		'metaDataProperty.GeocoderMetaData.Address'
	);
	const locality = addr.Components.find(c => c.kind === 'locality');
	const street = addr.Components.find(c => c.kind === 'street');
	const house = addr.Components.find(c => c.kind === 'house');

	// Гибкий формат: показываем что есть, без строгих требований
	if (locality && street && house) {
		return `${locality.name}, ${street.name}, ${house.name}`;
	} else if (locality && street) {
		return `${locality.name}, ${street.name}`;
	} else if (locality) {
		return locality.name;
	}

	// Фоллбэк на полное имя объекта
	return geoObject.properties.get('name') || geoObject.properties.get('text');
};

export { geoObjectDisplayName };
