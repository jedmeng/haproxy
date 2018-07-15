import { Menu, Icon } from 'antd';


const Nav = ({ dispatch }) => {

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      <Menu.Item key="1">
        <Icon type="setting" />
        <span>天猫精灵配置</span>
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="video-camera" />
        <span>nav 2</span>
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="upload" />
        <span>nav 3</span>
      </Menu.Item>
    </Menu>
  );
};

export default Nav;
