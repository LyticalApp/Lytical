process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const WebSocket = require('ws');
const ws = new WebSocket('wss://riot:XL_Bz6JS7QYqAsq4kHkq1Q@127.0.0.1:50364/', 'wamp');
ws.on('open', () => {
    ws.send('[5, "OnJsonApiEvent_lol-gameflow_v1_session"]');
});

ws.on('error', (err) => {
  console.log(err);
});

ws.on('message', (msg) => {
  msg = JSON.parse(msg);
  console.log(msg)
});