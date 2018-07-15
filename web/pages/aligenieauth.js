import React from 'react';
import { Table, Switch, Spin } from 'antd';
import { connect } from 'dva';
import Layout from '../components/Layout';
import styles from './aligenie.less';


class AliGenieAuthPage extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <Layout>
        <div className={styles.spinWrapper}>
          test
        </div>
      </Layout>
    );
  }
}

AliGenieAuthPage.propTypes = {
};

const mapStateToProps = state => ({
  loading: state.loading.effects['aligenie/fetch'],
  devices: state.aligenie.devices,
  sending: state.aligenie.sending,
});

export default connect(mapStateToProps)(AliGenieAuthPage);
