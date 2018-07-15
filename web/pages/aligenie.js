import React from 'react';
import { Table, Switch, Spin } from 'antd';
import { connect } from 'dva';
import Layout from '../components/Layout';
import styles from './aligenie.less';


class AliGeniePage extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'aligenie/fetch' });
  }

  render() {
    const { loading, devices, sending, dispatch } = this.props;
    if (loading) {
      return (
        <Layout>
          <div className={styles.spinWrapper}>
            <Spin size="large" />
          </div>
        </Layout>
      );
    } else {
      const haTypes = new Set();
      const aliTypes = new Set();
      devices.forEach(device => {
        haTypes.add(device.domain);
        aliTypes.add(device.type);
      });

      const toggleEnable = (id, value) => {
        dispatch({
          type: 'aligenie/setConfig',
          payload: {
            id: id,
            config: {
              enable: value
            }
          }
        });
      };

      const columns = [{
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: 'HA设备类型',
        dataIndex: 'domain',
        filters: haTypes.size > 1 && Array.from(haTypes).map(type => ({ text: type, value: type})),
        filterMultiple: false,
        onFilter: (value, record) => record.domain === value,
      }, {
        title: '天猫设备类型',
        dataIndex: 'type',
        filters: aliTypes.size > 1 && Array.from(aliTypes).map(type => ({ text: type, value: type})),
        filterMultiple: false,
        onFilter: (value, record) => record.type === value,
      }, {
        title: '启用',
        key: 'enable',
        render: (_, record) => (
          <Switch
            checked={record.config.enable}
            onChange={toggleEnable.bind(this, record.id)}
            loading={sending === record.id}
          />
        ),
      }, {
        title: '配置设备',
        dataIndex: '',
        key: 'config',
        render: () => <a href="javascript:;">配置设备</a>,
      }];

      return (
        <Layout>
          <Table
            columns={columns}
            dataSource={devices}
            rowKey="id"
            pagination={false}
          />
        </Layout>
      );
    }
  }
}

AliGeniePage.propTypes = {
};

const mapStateToProps = state => ({
  loading: state.loading.effects['aligenie/fetch'],
  devices: state.aligenie.devices,
  sending: state.aligenie.sending,
});

export default connect(mapStateToProps)(AliGeniePage);
