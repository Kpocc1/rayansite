import { Card, Divider, List } from "antd";

import useBreakpoint from "hooks/useBreakpoint";
import { getImage } from "helpers";

const FooterLayout = () => {
  const { isDesktop } = useBreakpoint(); 

  return (
    <div className="rn-footer region">
      {/* {isDesktop ? (
        <List
          grid={{ gutter: 16, column: 5 }}
          className="advantages-list"
          dataSource={[
            {
              img: getImage("icon-halal.png", "/catalog/view/theme/default/image/"),
              title: "БЕЗ СВИНИНЫ И ЕЕ КОМПОНЕНТОВ",
            },
            {
              img: getImage("icon-cow.png", "/catalog/view/theme/default/image/"),
              title: "МЯСО СОБСТВЕННОГО ЗАБОЯ",
            },
            {
              img: getImage("icon-nature.png", "/catalog/view/theme/default/image/"),
              title: "БЕЗ КОНСЕРВАНТОВ И КРАСИТЕЛЕЙ",
            },
            {
              img: getImage("icon-dna.png", "/catalog/view/theme/default/image/"),
              title: "БЕЗ ГМО И ЗАМЕНИТЕЛЕЙ МЯСА",
            },
            {
              img:getImage("icon-eggs.png", "/catalog/view/theme/default/image/"),
              title: "НАТУРАЛЬНЫЕ МОЛОКО И ЯИЦО",
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Card hoverable size="small">
                <div className="rn-advantage-icon mb-20 mt-20">
                  <img src={item.img} alt="" className="img-responsive" />
                </div>
                <h4
                  className="text-gray text-center"
                  style={{ height: 45, margin: 0 }}
                >
                  {item.title}
                </h4>
              </Card>
            </List.Item>
          )}
        />
      ) : ""} */}
      <Divider />
      <div className="mt-30">
        ©{new Date().getFullYear()} Мясной дом "Райян"
      </div>
    </div>
  );
};

export default FooterLayout;
