import dva from 'dva';
import createLoading from 'dva-loading';
import { message } from 'antd';
import './index.less';

// 1. Initialize
const app = dva({
  onError(error) {
    message.destroy();
    message.error(error.message);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/aligenie').default);
app.model(require('./models/nav').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
