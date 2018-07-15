import React from "react";
import { Link } from "dva/router";
import Particles from "react-particles-js";
import { Icon } from "antd";
import Login from '../components/Login/index';
import {connect} from "dva/index";
import styles from './login.less';
import logo from "../assets/logo.png";

const { UserName, Password, Submit } = Login;

const particlesParams = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 1000,
      },
    },
    color: {
      value: "#40a9ff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#40a9ff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
};


const LoginPage = ({ dispatch, submitting }) => {
  const handleSubmit = (err, values) => {
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  return (
    <div>
      <div className={styles.content}>
        <Particles params={particlesParams} className={styles.particles} />
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Home Assistant Relay</span>
            </Link>
          </div>
          <div className={styles.desc}>User Dashboard</div>
        </div>
        <div className={styles.main}>
          <Login onSubmit={handleSubmit}>
            <UserName name="username" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
            <Submit loading={submitting}>登录</Submit>
          </Login>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.copyright}>Copyright <Icon type="copyright" /> Jedmeng</div>
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({ submitting: loading.effects['login/login'] }))(LoginPage);