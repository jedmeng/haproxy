import { Layout, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Nav from './Nav';
import styles from './Layout.less';

const { Header, Sider, Content } = Layout;

const MyLayout = ({ dispatch, collapsed, children }) => {
  const toggleCollapse = () => {
    dispatch({
      type: 'nav/toggle'
    });
  };

  const jump = (id) => {
    dispatch({
      type: 'nav/jump',
      payload: id,
    });
  };

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles.logo} />
        <Nav/>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleCollapse}
          />
        </Header>
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

MyLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default connect(({ nav }) => ({ collapsed: nav.collapsed }))(MyLayout);
