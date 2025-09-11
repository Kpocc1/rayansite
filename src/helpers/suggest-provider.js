const geoObjectDisplayName = (geoObject) => {
  const addr = geoObject.properties.get("metaDataProperty.GeocoderMetaData.Address");
  const locality = addr.Components.find((c) => c.kind === 'locality');
  const street = addr.Components.find((c) => c.kind === 'street');
  const house = addr.Components.find((c) => c.kind === 'house');
  if (!street) return;
  return `${locality.name}, ${street.name}${house ? `, ${house.name}` : ""}`;
};

const suggestViewProvider = (ymaps) => ({
  suggest: function (request, options) {
    delete options["provider"];
    return ymaps.suggest(request, options).then((items) => {
      const arrayResult = [];
      const arrayPromises = [];
      items.forEach((item) => {
        arrayPromises.push(
          ymaps.geocode(item.value).then((res) => {
            const geoObject = res.geoObjects.get(0);
            const displayName = geoObjectDisplayName(geoObject);
            if (displayName) {
              arrayResult.push({ displayName, value: displayName });
            }            
          })
        );
      });

      return Promise.all(arrayPromises).then(function () {
        return ymaps.vow.resolve(arrayResult);
      });
    });
  },
});

export { suggestViewProvider, geoObjectDisplayName };