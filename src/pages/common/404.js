import { Button, Result } from "antd";

import useSmartNavigate from "hooks/useSmartNavigate";

const _404 = () => {
  const { navigate } = useSmartNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Такой страницы не существует"
      extra={<Button type="primary" onClick={() => navigate("/")}>На главную страницу</Button>}
    />
  );
};

export default _404;
