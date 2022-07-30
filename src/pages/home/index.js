// import { SearchOutlined } from 'antd/lib/icon';
import React, { useState, useEffect } from "react";
import { connect } from "dva";

import { MoveBox } from "./../../game";
import "./index.less";

const Home = ({}) => {
  useEffect(() => {}, []);
  console.log("测试push");

  return (
    <div className={"homePageContain"}>
      <div className="boardContain0">
        <MoveBox></MoveBox>
      </div>
    </div>
  );
};
// export default Home
export default connect(({ app }) => ({}))(Home);
