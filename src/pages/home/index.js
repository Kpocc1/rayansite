import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, List, Skeleton, Typography } from "antd";

import { fetchBottomModules, fetchTopModules } from "store/slices/moduleSlice";
import Catalog from "pages/catalog";
// import HeadingTitle from "components/HeadingTitle";
// import ProductItem from "components/product/ProductItem";
import useSmartNavigate from "hooks/useSmartNavigate";
import { loadingStatus } from "helpers/fetcher";
import { PRODUCTS_GRID } from "constants/breakpoints";
// import { PRODUCTS_GRID } from "constants/breakpoints";

const Home = () => {
  const dispatch = useDispatch();
  // const bottomModules = useSelector((state) => state.module.bottomModules);
  const topModules = useSelector((state) => state.module.topModules);
  const { navigate } = useSmartNavigate();

  const slideshow = topModules.data.modules?.find((d) => d.code === "slideshow");
  // const featured = bottomModules.data.modules?.find((d) => d.code === "featured");

  useEffect(() => {
    dispatch(fetchTopModules());
    // dispatch(fetchBottomModules());
  }, [dispatch]);

  return (
    <>
      <div className="region">
        <div className="text-center mb-30">
          {loadingStatus.SUCCEEDED === topModules.status ? (
            <Carousel autoplay>
              {slideshow.banners.map((b, index) => (
                <div key={index} onClick={() => navigate(b.link)}>
                  <img src={b.image} alt={b.title} style={{ margin: "0 auto"}} />
                </div>
              ))}
            </Carousel>
          ) : (
            <Skeleton.Image active style={{ width: 859, height: 360 }} />
          )}
        </div>
      </div>

      {/* <HeadingTitle title={featured?.heading_title} />
      <List
        grid={PRODUCTS_GRID}
        className="rn-product-grid"
        dataSource={featured?.products || Array(5).fill({})}
        renderItem={(item) => (
          <Skeleton active loading={loadingStatus.SUCCEEDED !== bottomModules.status}>
            <ProductItem item={item} />
          </Skeleton>
        )}
      /> */}

      <br />
      <Catalog breadcrumb={<></>} grid={{ ...PRODUCTS_GRID, xs: 2, gutter: 5 }} />

      <div className="region">
        <div className="white p-30 mt-30">
          <Typography.Paragraph>
            Почти все самые высокие вершины Европы, в том числе и Эльбрус, расположены на территории этой
            небольшой республики.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Скот здесь выращивают  на   высокогорных  пастбищах  в  зоне   альпийских  лугов.  Животные
            питаются  сочной  травой пьют  ледниковую талую воду и  дышат  звенящим  горным  воздухом.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Мясо  таких  животных  обладает  особой ценностью. Мы понимаем, что  качество  начинается
            уже  с  откорма  животных,  поэтому имеем собственную животноводческую  ферму, где выращиваются
            животные на естественных  кормах, без  применения  антибиотиков и стимуляторов роста, что
            позволяет получить  высококачественное  сырье для  комбината.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Вся  продукция мясокомбината  выпускается  под  брендом «РАЙЯН».
          </Typography.Paragraph>
        </div>
      </div>
    </>
  );
};

export default Home;
