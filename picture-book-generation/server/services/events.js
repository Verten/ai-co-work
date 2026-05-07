import { EventEmitter } from 'events';

const progressEmitter = new EventEmitter();
progressEmitter.setMaxListeners(100);

export default progressEmitter;