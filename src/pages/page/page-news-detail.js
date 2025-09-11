import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";

import HeadingTitle from "components/HeadingTitle";
import Breadcrumb from "components/Breadcrumb";
import { fetchNewsDetail } from "store/slices/pageSlice";
import { loadingStatus } from "helpers/fetcher";

const PageNewsDetail = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.page.newsDetail);
  const { "*": news_id } = useParams();

  useEffect(() => {
    dispatch(fetchNewsDetail(news_id));
  }, [dispatch, news_id]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle title={data.heading_title} />
      <div className="white p-30">
        {status === loadingStatus.SUCCEEDED ? (
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        ) : (
          <>
            <Skeleton.Button active block />
            <br />
            <br />
            <Skeleton.Button active block />
            <br />
            <br />
            <br />
            <Skeleton active paragraph={{ rows: 5 }} />
          </>
        )}
      </div>
    </div>
  );
};

export default PageNewsDetail;
