import { routerRedux } from 'dva/router';

export default {
    namespace: 'app',
    state: {
      
    },
    reducers: {
        setModelState(state, { payload }) {
            return { ...state, ...payload };
        },
       
    },

    effects: {  
        // 路由跳转
        *redirect({ payload }, { put }) {
            console.log('payload', payload)
       
            yield put(routerRedux.push(payload.path));
        },
  
       

    },
    subscriptions: {
        setup({ history, dispatch }) {
            // 监听 history 变化，当进入 `/` 时触发 `load` action
            return history.listen(({ pathname }) => {
                if (pathname === '/') {
                    dispatch({ type: 'load' });
                }
            });
        },
    },
};