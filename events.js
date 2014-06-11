/*
 * Copyright(c) 2014 Yuki Kurata <yuki.kurata@gmail.com>
 * MIT Licensed
 */

define(function () {
  'use strict';

  var EventEmitter = function EventEmitter () {};

  /**
   * @property {Number} _maxListeners
   */
  EventEmitter.prototype._maxListeners = 10;

  /**
   * @method addListener
   * @param  {String} event
   * @param  {Function} listener
   * @return {EventEmitter} emitter
   */
  EventEmitter.prototype.addListener = function addListener (event, listener) {
    init(this);
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    this.emit('newListener', event, listener);
    var events = this._events[event];
    addCheck (this._maxListeners, this._events);
    if (events) {
      events.push(listener);
    } else {
      this._events[event] = [listener];
    }
    return this;
  };

  /**
   * @method on
   * @param  {String} event
   * @param  {Function} listener
   * @return {EventEmitter} emitter
   */
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;


  /**
   * @method once
   * @param {String} event
   * @param {Function} listener
   * @return {EventEmitter} emitter
   */
  EventEmitter.prototype.once = function once (event, listener) {
    init(this);
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    this.emit('newListener', event, listener);
    var events = this._events[event];
    addCheck (this._maxListeners, this._events);
    if (events) {
      events.push({listener: listener});
    } else {
      this._events[event] = [{listener: listener}];
    }
    return this;
  };

  /**
   * @method removeListener
   * @param {String} event
   * @param {Function} listener
   * @return {EventEmitter} emitter
   */
  EventEmitter.prototype.removeListener = function removeListener (event, listener) {
    init(this);
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    this.emit('removeListener', event, listener);
    var events = this._events[event];
    if (!events) {
      return this;
    } else {
      events = events.filter(function (f) {
        if (typeof f === 'function') {
          return f !== listener;
        } else {
          return f.listener = listener;
        }
      });
      if (events.length) {
        this._events[event] = events;
      } else {
        delete this._events[event];
      }
    }
    return this;
  };

  /**
   * @method removeAllListeners
   * @param {String} event
   * @return {EventEmitter} emitter
   */
  EventEmitter.prototype.removeAllListeners = function removeAllListeners (event) {
    init(this);
    this.emit('removeListener', event || null);
    if (event) {
      this._events[event] = {};
    } else {
      this._events = {};
    }
    return this;
  };

  /**
   * @method setAllListeners
   * @param {String} event
   */
  EventEmitter.prototype.setMaxListeners = function setMaxListeners (n) {
    if (typeof n === 'number' && 0 <= n) {
      this._maxListeners = n;
    }
  };

  /**
   * @method listeners
   * @param {String} event
   */
  EventEmitter.prototype.listeners = function listeners (event) {
    init(this);
    if (!event || !this._events[event]) {
      return [];
    }
    return [].slice.call(this._events[event]);
  };

  /**
   * @method emit
   * @param {String} event
   * @param {Mixed} args...
   */
  EventEmitter.prototype.emit = function emit (event) {
    init(this);
    var events = this._events[event];
    var args = [].slice.call(arguments, 1);
    var self = this;
    if (!events) {
      if (event === 'error') {
        var err = new Error('Uncaught, unspecified "error" event.');
        throw err;
      }
      return false;
    }
    var ls = [];
    events.forEach(function (listener) {
      if (typeof listener === 'function') {
        listener.apply(self, args);
        ls.push(listener);
      } else {
        listener.listener.apply(self, args);
      }
    });
    this._events[event] = ls;
    return true;
  };

  /**
   * 
   * @method listenerCount
   * @param  {EventEmitter} emitter
   * @param  {String}       event
   */
  EventEmitter.listenerCount = function listenerCount (emitter, event) {
    if (emitter && emitter._events) {
      return emitter._events[event].length;
    } else {
      return 0;
    }
  };

  /**
   * @method init
   * @param  {EventEmitter} emitter
   */
  function init (emitter) {
    if (typeof emitter._events !== 'object') {
      emitter._events = {};
    }
  }

  /**
   * @method countCheck
   * @param  {Number}   max
   * @param  {Object}   events
   */
  function addCheck (max, events) {
    if (0 < max && max < getCount(events) + 1) {
      var warn = 'warning: ' +
        'possible EventEmitter memory leak detected. ' +
        (max + 1) + ' listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';
      console.log(warn);
    }
  }

  /**
   * @method getCount
   * @param  {Object} events
   * @param  {String} [event]
   * @return {Number} count
   */
  function getCount (events, event) {
    if (event) {
      return events[event] ? events[event].length : 0;
    } else {
      return Object.keys(events).reduce(function (x, k){
        return x + events[k].length;
      }, 0);
    }
  }

  return {EventEmitter: EventEmitter};
});
