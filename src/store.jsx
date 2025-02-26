import {EventEmitter} from 'events';
import Dispatcher from './dispatcher';
import Constants from './constants';
import _ from 'underscore';
import TraceProcessor from './trace-processor';

let data = [];

const Store = Object.assign(EventEmitter.prototype, {
  data: [],

  getState(){
    return TraceProcessor.processTraces(this.data);
  },

  addTrace(item){
    this.data.push(_.extend({}, {
      message : JSON.parse(item.jsonString),
      isOutbound : item.isOutbound,
      _id : _.uniqueId('trace'),
      _timestamp : _.now()
    }));
    this.emit('change');
  },

  clear(){
    this.data = [];
    this.emit('change');
  }
});

Dispatcher.register(function(action){
  switch(action.type){
    case Constants.NEW_TRACE:
      Store.addTrace(action.data);
      break;
    case Constants.TOGGLE_TRACE_EXTEND:
      Store.toggleTraceExtension(action.data);
      break;
    case Constants.CLEAR_LOGS:
      Store.clear();
      break;
  }
});

export default Store;