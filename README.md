nodify-events (v0.1.0)
===========

client side node events

クライアントサイドでサーバサイドのeventsを同様に使用するためのライブラリです。  
現在は`events.EventEmitter`のみ実装されています

# usage

[RequireJS](http://requirejs.org)と[grunt-m2r](https://www.npmjs.org/package/grunt-m2r)によりクライアントサイドとサーバサイドで同じコードを記述することができます。  

まずはNodeの記法に基づいてコーディングしてください。  
その後、grunt-m2rを動作させる事で、RequireJSで動作するコードに変換されます。  

`events.js`をファイル名を変更せずにそのまま、RequireJSのconfigで設定した`baseUrl`のフォルダに配置してください

これにより`var events = require('events');`がクライアントでも同様に記述する事が出来ます。

# feature

 + Class: events.EventEmitter
    + emitter.addListener(event, listener)
    + emitter.on(event, listener)
    + emitter.once(event, listener)
    + emitter.removeListener(event, listener)
    + emitter.removeAllListeners([event])
    + emitter.setMaxListeners(n)
    + emitter.listeners(event)
    + emitter.emit(event, [arg1], [arg2], [...])
    + Class Method: EventEmitter.listenerCount(emitter, event)
    + Event: 'newListener'
    + Event: 'removeListener'
