import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, AutoComplete, Flex, Button } from "antd";

import { fetchSearch } from "store/slices/productSlice";
import useSmartNavigate from "hooks/useSmartNavigate";
import { formatCurrency, formatWeightWithUnit } from "helpers/formatter";
import CartQtyButtonGroup from "components/cart/CartQtyButtonGroup";

const SearchWithSuggest = ({ listHeight = 700, isDesktop = true, onClose = () => {} }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.product.search);
  const { navigate } = useSmartNavigate();

  const handleSuggest = (s) => {
    dispatch(fetchSearch(s));
  };

  const handleGoSearchPage = (s) => {
    console.log(`К поиску: ${s}`)
  };

  const handleGoProductPage = (s, option) => {
    onClose();
    navigate(`/product/${option.path}`);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus({ cursor: "end" });
    }
  }, []);

  return (
    <AutoComplete
      options={data.products?.map((p) => ({
        label: <SuggestItem item={p} isDesktop={isDesktop} />,
        value: p.name,
        path: `${p.product_id}/${p.slug}`
      }))}
      onSelect={handleGoProductPage}
      onSearch={handleSuggest}
      style={{ width: "100%" }}
      listHeight={listHeight}
    >
      {isDesktop ? (
        <Flex gap={0} style={{ width: "100%", alignItems: "center" }}>
          <Input
          size="large"
          placeholder="поиск по товарам"
            prefix={
              <img
                src={`${process.env.PUBLIC_URL}/icons/icon-search.svg`}
                alt=""
                style={{ width: 24, height: 24 }}
              />
            }
            className="search-input"
            onPressEnter={(e) => {
              e.stopPropagation();
              handleGoSearchPage(e.target.value);
            }}
            ref={inputRef}
          />
          <Button
            type="primary"
            className="search-button"
            onClick={() => {
              if (inputRef.current) {
                handleGoSearchPage(inputRef.current.input.value);
              }
            }}
          >
            Найти
          </Button>
        </Flex>
      ) : (
        <Input
          size="large"
          placeholder="поиск по товарам"
          onPressEnter={(e) => e.stopPropagation()}
          ref={inputRef}
        />
      )}
    </AutoComplete>
  );
}

export default SearchWithSuggest;



const SuggestItem = ({ item, isDesktop }) => (
  <Flex justify="space-between" align="center" style={{ padding: "10px 0" }}>
    <Flex>
      <img
        alt={item.name}
        src={item.thumb}
        style={{ maxWidth: 60, maxHeight: 60 }}
      />
      <div style={{ whiteSpace: "normal", marginLeft: 20 }}>
        <div style={{ fontSize: "1.1em" }}>
          {`${item.name}, ${formatWeightWithUnit(item.weight)}`}
        </div>
        {isDesktop ? (
          <strong>{formatCurrency(item.price)}</strong>
        ) : (
          <Flex justify="space-between" align="center">
            <strong>{formatCurrency(item.price)}</strong>
            <CartQtyButtonGroup item={item} size="small" />
          </Flex>
        )}
      </div>
    </Flex>
    {isDesktop ? (
      <Flex style={{ paddingLeft: 20 }}>
        <CartQtyButtonGroup item={item} size="small" />
      </Flex>
    ) : ""}
  </Flex>
);
