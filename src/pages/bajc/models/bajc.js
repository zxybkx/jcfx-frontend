import {
  countByBajc, countByBajcSub,
  countByBaqkScdb, countByZcjdqk, countByBaqkSub,
  countByBafkqk, countByBafkqkSub, countByBafkqkSjb,
  countBySpbdqk, countBySpbdqkSub, countBySpbdqkSubsec,countByZcjdSpjd
} from '../services/bajc';

export default {

  namespace: 'bajc',

  state: {
    message: '',
  },

  subscriptions: {},

  effects: {

    //受案情况表
    *countByBajc({payload}, {call, put}){
      return yield  call(countByBajc, payload);
    },

    *countByBajcSub({payload}, {call, put}){
      return yield  call(countByBajcSub, payload);
    },

    //办结情况表, 侦查监督情况表, 审判监督情况表
    *countByBaqkScdb({payload}, {call, put}){
      return yield  call(countByBaqkScdb, payload);
    },

    *countByZcjdqk({payload}, {call, put}){
      return yield  call(countByZcjdqk, payload);
    },

    *countByBaqkSub({payload}, {call, put}){
      return yield  call(countByBaqkSub, payload);
    },

    *countByZcjdSpjd({payload}, {call, put}){
      return yield  call(countByZcjdSpjd, payload);
    },

    //办案反馈情况表
    *countByBafkqk({payload}, {call, put}){
      return yield  call(countByBafkqk, payload);
    },

    *countByBafkqkSub({payload}, {call, put}){
      return yield  call(countByBafkqkSub, payload);
    },

    *countByBafkqkSjb({payload}, {call, put}){
      return yield  call(countByBafkqkSjb, payload);
    },

    //诉判比对完成情况表
    *countBySpbdqk({payload}, {call, put}){
      return yield  call(countBySpbdqk, payload);
    },

    *countBySpbdqkSub({payload}, {call, put}){
      return yield  call(countBySpbdqkSub, payload);
    },

    *countBySpbdqkSubsec({payload}, {call, put}){
      return yield  call(countBySpbdqkSubsec, payload);
    },

  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
    updateQueryKey(state, action) {
      return {...state, ...action.payload};
    }
  }

};
