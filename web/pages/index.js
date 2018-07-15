import React from 'react';
import { connect } from 'dva';
import Layout from '../components/Layout';

// import styles from './IndexPage.css';

const Index = () => {
  return (
    <Layout>
      <div>hello world</div>
    </Layout>
  );
};

Index.propTypes = {
};

export default connect()(Index);
