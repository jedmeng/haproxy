import React from 'react';
import { connect } from 'dva';
import Login from '../components/Login/index';
import styles from './login.less';

const { UserName, Password, Submit } = Login;

const LoginPage = () => {
  const handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };
  return (
    <div className={styles.main}>
      <Login onSubmit={handleSubmit}>
        <UserName name="username" placeholder={''} />
        <Password name="password" placeholder={''} />
        {/*<Submit loading={submitting}><FormattedMessage {...messages.button.login} /></Submit>*/}
      </Login>
    </div>
  );
};

LoginPage.propTypes = {
};

export default connect()(LoginPage);
