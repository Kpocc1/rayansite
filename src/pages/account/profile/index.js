import React, { useEffect, useState } from "react";
import { Input, Layout, Form, Button, Skeleton, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { editProfile, fetchProfile } from "store/slices/customerSlice";
import HeadingTitle from "components/HeadingTitle";
import AccountSider from "../AccountSider";
import Breadcrumb from "components/Breadcrumb";
import { loadingStatus } from "helpers/fetcher";
import { setCustomer } from "helpers/customer";

const rules = [{ required: true, message: "Обязательное поле" }];

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.customer.profile);

  const handleFinish = async (values) => {
    setLoading(true);
    const res = await editProfile(values);
    if (res.error) {
      message.error(res.error_warning);
    } else {
      setCustomer(values);
      message.success(res.success);
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle
        title="Информация об аккаунте"
        level={2}
        style={{ marginTop: 0, marginBottom: 30 }}
      />
      <Layout>
        <AccountSider />
        <Layout.Content>
          <div className="white p-30">
            {status === loadingStatus.SUCCEEDED ? (
              <Form
                name="profile"
                layout="vertical"
                style={{ maxWidth: 600 }}
                initialValues={data}
                onFinish={handleFinish}
                // autoComplete="off"
              >
                <Form.Item name="firstname" label="Имя" rules={rules}>
                <Input />
                </Form.Item>
                <Form.Item name="lastname" label="Фамилия" rules={rules}>
                <Input />
                </Form.Item>
                <Form.Item name="telephone" label="Номер телефона" rules={rules}>
                  <Input />
                </Form.Item>
                <Form.Item name="email" label="E-mail" rules={rules}>
                <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Сохранить изменения
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Skeleton active paragraph={{ rows: 6 }} />
            )}
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default Profile;
