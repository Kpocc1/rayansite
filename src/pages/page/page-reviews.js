import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "antd";

import HeadingTitle from "components/HeadingTitle";
import Breadcrumb from "components/Breadcrumb";
import { fetchPage } from "store/slices/pageSlice";
import { loadingStatus } from "helpers/fetcher";

const PageReviews = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.page.page);
  const { "*": path } = useParams();

  useEffect(() => {
    dispatch(fetchPage({ id: null, route: "information/feedback" }));
  }, [dispatch, path]);

  return (
    <div className="region">
      <Breadcrumb />
      <HeadingTitle title={data.heading_title} />
      <div className="white p-30">
        {status === loadingStatus.SUCCEEDED ? (
          <div dangerouslySetInnerHTML={{ __html: data.contact_text }} />
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

export default PageReviews;
