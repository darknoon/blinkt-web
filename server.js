const express = require('express')
const app = express()
const cssColor = require('color-functions/lib/css-color');
const isPi = require('detect-rpi')();
const Blinkt = isPi ? require('node-blinkt') : undefined;

function chip(r, g, b, a) {
  const color = `rgba(${r},${g},${b},${a})`;
  return `<a href='/color/${color}' class="chip" style='background-color:${color}'></a>`
}

app.get('/', (req, res) => {

  const increment = 40;
  
  let str = '';
  for (let b = 0; b < 256; b += increment) {
    for (let g = 0; g < 256; g += increment) {
      for (let r = 0; r < 256; r += increment) {
        str += chip(r,g,b, 1.0);
      }
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
        }
        .container {
          display: flex;
          flex-wrap: wrap;
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
