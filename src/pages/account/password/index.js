import React, { useState } from "react";
import { Input, Layout, Form, Button } from "antd";

import Breadcrumb from "components/Breadcrumb";
import AccountSider from "../AccountSider";
import HeadingTitle from "components/HeadingTitle";

const rules = [{ required: true, message: "Обязательное поле" }];

const Password = () => {
  const [loading, setLoading] = useState(false);

  // const handleFinish = async (values) => {
  //   setLoading(true);
  //   const res = await editProfile(values);
  //   if (res.error) {
  //     message.error(res.error_warning);
  //   } else {
  //     setCustomer(values);
  //     message.success(res.success);
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        title="Изменить пароль"
        level={2}
        style={{ marginTop: 0, marginBottom: 30 }}
      />
      <Layout>
        <AccountSider />
        <Layout.Content>
          <div className="white p-30">
            <Form
              name="profile"
              layout="vertical"
              style={{ maxWidth: 600 }}
              // initialValues={data}
              // onFinish={handleFinish}
              // autoComplete="off"
            >
              <Form.Item name="password" label="Пароль" rules={rules}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Сохранить изменения
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Password;
