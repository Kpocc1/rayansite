import React from "react";
import { List, Rate, Skeleton } from "antd";

import { loadingStatus } from "helpers/fetcher";

const Reviews = ({ review: { data, status } }) => {
  return (
    <List
      itemLayout="vertical"
      size="large"
      // pagination={{
      //   onChange: setPage,
      //   pageSize: data.limit,
      //   total: data.total,
      //   current: page,
      // }}
      dataSource={data.reviews || Array(4).fill({})}
      renderItem={(item, index) => (
        <Skeleton active loading={status !== loadingStatus.SUCCEEDED}>
          <List.Item>
            <List.Item.Meta
              title={
                <>
                  {item.author}
                  <Rate
                    allowHalf
                    disabled
                    value={item.rating}
                    style={{ fontSize: 15, marginLeft: 25 }}
                  />
                </>
              }
              description={item.date_added}
            />
            <div dangerouslySetInnerHTML={{ __html: item.text}} />
          </List.Item>
        </Skeleton>
      )}
    />
  );
};

export default Reviews;
