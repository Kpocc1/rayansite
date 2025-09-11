import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ConfigProvider, Layout, Modal } from "antd";

import DeliveryCalculate from "components/modal/DeliveryCalculate";
import SignIn from "components/modal/SignIn";
import YookassaWidget from "components/modal/YookassaWidget";
import SearchWithSuggest from "components/form/SearchWithSuggest";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import {
  setDeliveryModalIsOpen,
  setMobileSearchModalIsOpen,
  setSigninModalIsOpen,
  setYookassaWidgetModalIsOpen,
} from "store/slices/layoutSlice";

const MainLayout = ({ children }) => {

  const dispatch = useDispatch();
  const {
    deliveryModalIsOpen,
    signinModalIsOpen,
    yookassaWidgetModalIsOpen,
    mobileSearchModalIsOpen,
  } = useSelector((state) => state.layout);

  const handleDeliveryModalClose = () => {
    dispatch(setDeliveryModalIsOpen(false));
  };

  const handleSigninModalClose = () => {
    dispatch(setSigninModalIsOpen(false));
  };

  const handleYookassaWidgetModalClose = () => {
    dispatch(setYookassaWidgetModalIsOpen(false));
  };

  const handleMobileSearchModalClose = () => {
    dispatch(setMobileSearchModalIsOpen(false));
  };

  return (
    <Layout className="rn-layout">
      <BrowserRouter>
        <HeaderLayout />
        <Layout.Content className="rm-main">{children}</Layout.Content>
        <FooterLayout />

        <Modal
          width={1000}
          open={deliveryModalIsOpen}
          onCancel={handleDeliveryModalClose}
          footer={null}
        >
          <DeliveryCalculate />
        </Modal>
        <Modal
          width={420}
          centered
          open={signinModalIsOpen}
          onCancel={handleSigninModalClose}
          footer={null}
        >
          <SignIn />
        </Modal>
        <Modal
          width={500}
          centered
          open={yookassaWidgetModalIsOpen}
          onCancel={handleYookassaWidgetModalClose}
          footer={null}
        >
          <YookassaWidget />
        </Modal>
        <ConfigProvider
          modal={{
            styles: {
              content: { padding: 0, boxShadow: "none", border: "none" },
              mask: { background: "white" },
              header: { padding: "10px 15px 15px 15px", margin: 0 },
            },
          }}
        >
          <Modal
            style={{ top: 5, padding: 0 }}
            open={mobileSearchModalIsOpen}
            title="Поиск"
            onCancel={handleMobileSearchModalClose}
            footer={null}
          >
            <SearchWithSuggest
              listHeight={window.innerHeight - 165}
              isDesktop={false}
              onClose={handleMobileSearchModalClose}
            />
          </Modal>
        </ConfigProvider>
      </BrowserRouter>
    </Layout>
  );
};

export default MainLayout;
