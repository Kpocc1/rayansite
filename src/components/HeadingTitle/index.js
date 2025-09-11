import { Skeleton, Typography } from "antd";

const HeadingTitle = ({ title, level = 3, ...rest }) => {
  
  return (
    title ? (
      <Typography.Title level={level} {...rest}>{title}</Typography.Title>
    ) : (
      <Skeleton active paragraph={{ rows: 1 }} />
    )
  );
};

export default HeadingTitle;
