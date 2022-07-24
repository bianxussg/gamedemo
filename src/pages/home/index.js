// import { SearchOutlined } from 'antd/lib/icon';
import React, { useState, useEffect } from 'react'
import { connect } from 'dva'

import { Board } from './../../component'
import './index.less'

const Home = ({
  
}) => {
   
    useEffect(() => {
       
    }, [])
   

    return (
        <div className={'homePageContain'}>
            <div className='boardContain0'> <Board></Board></div>
           
        </div>
    );
};
// export default Home
export default connect(({ app }) => ({
   
}))(Home)