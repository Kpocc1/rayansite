import { ConfigProvider } from "antd";
import { Provider } from "react-redux";

import MainLayout from "components/layout/MainLayout";
import { store } from "store/store";
import Router from "Router";

function App() {
  return (
    <ConfigProvider>
      <Provider store={store}>
        <MainLayout>
          <Router />
        </MainLayout>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
