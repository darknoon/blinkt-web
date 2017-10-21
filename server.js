const express = require('express')
const app = express()
const cssColor = require('color-functions/lib/css-color');
const isPi = require('detect-rpi')();
const Blinkt = isPi ? require('node-blinkt') : undefined;


function chip(color) {
  return `<a href='/color/${encodeURIComponent(color)}' class="chip" style='background-color:${color}'></a>`
}

app.get('/', (req, res) => {

  const hi = 360 / 10;
  const si = 20;
  const li = 5;
  
  let str = '';
  for (let h = 0; h <= 360; h += hi) {
    for (let s = 0; s <= 100; s += si) {
      str += `<div class='row'>`;
      for (let l = 0; l <= 100; l += li) {
        const color = `hsl(${h},${s}%,${l}%)`;
        str += chip(color);
      }
      str += `</div>`;
    }
  }
  const page = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        .chip {
          width: 40px;
          height: 40px;
          display: block;
          flex: 1;
        }
        .row {
          display: flex;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class='container'>
        ${str}
      </div>
    </body>
    </html>
  `;

  // req.send('<html></html>')
  res.send(page);
})

function setColor(r, g, b, a) {
  if (Blinkt) {
    const leds = new Blinkt();
    leds.setup();
    leds.setAllPixels(r, g, b, a);
    leds.sendUpdate();
    leds.sendUpdate();
  }
}

app.get('/color/:color', (req, res) => {
  const {params:{color}} = req;
  const rgba = cssColor(color);
  if (rgba) {
    const {r, g, b, a} = rgba;
    setColor(r, g, b, a);
    console.log(`Set color to ${color}`);
    res.redirect('/');
  } else {
    res.send(`Error parsing color`)
  }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
