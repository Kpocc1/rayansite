import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { List, Skeleton, Space, Typography } from "antd";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";

import HeadingTitle from "components/HeadingTitle";
import Breadcrumb from "components/Breadcrumb";
import { fetchNewsList } from "store/slices/pageSlice";
import { loadingStatus } from "helpers/fetcher";

const PageNewsList = () => {
  const [page, setPage] = useState();
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.page.newsList);
  const navigate = useNavigate();

  const handleNewsClick = (e, href) => {
    e.preventDefault();
    // const url = new URL(href.replace(/&amp;/g, "&"));
    // console.log(`/news/${url.searchParams.get("news_id")}`)
    // navigate(`/news/${url.searchParams.get("news_id")}`);
  };

  useEffect(() => {
    dispatch(fetchNewsList(page ? `?page=${page}` : ""));
  }, [dispatch, page]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle title={data.heading_title} />
      <div className="white p-20">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: setPage,
            pageSize: data.limit,
            total: data.total,
            current: page,
          }}
          dataSource={data.news_list || Array(4).fill({})}
          footer={<div>{data.results}</div>}
          renderItem={(item) => (
            <Skeleton active loading={status !== loadingStatus.SUCCEEDED}>
              <List.Item
                key={item.title}
                actions={[
                  <Space>
                    <ClockCircleOutlined /> {item.posted}
                  </Space>,
                  <Space>
                    <EyeOutlined /> {item.viewed}
                  </Space>,
                ]}
                extra={
                  item.thumb ? (
                    <Typography.Link onClick={() => navigate(`/news/${item.news_id}`)}>
                      <img width={200} src={item.thumb} alt="logo" />
                    </Typography.Link>
                  ) : ""
                }
              >
                <List.Item.Meta
                  title={
                    <Typography.Link onClick={() => navigate(`/news/${item.news_id}`)}>
                      {item.title}
                    </Typography.Link>
                  }
                  description={item.description}
                />
                {item.content}
              </List.Item>
            </Skeleton>
          )}
        />
      </div>
    </div>
  );
};

export default PageNewsList;
