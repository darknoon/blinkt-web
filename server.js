const express = require('express')
const app = express()
const cssColor = require('color-functions/lib/css-color');
const isPi = require('detect-rpi');
const Blinkt = isPi ? require('node-blinkt') : undefined;

const args = process.argv.slice(2);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/color/:color', (req, res) => {
  const {params:{color}} = req;
  const rgba = cssColor(color);
  if (rgba) {
    if (Blinkt) {
      const leds = new Blinkt();
      const {r, g, b, a} = rgba;
      leds.setup();
      leds.setAllPixels(r, g, b, a);
      leds.sendUpdate();
      leds.sendUpdate();
    }
    res.send(`Set color to <span style='background-color:${color}'>${color}</span>`)
  } else {
    res.send(`Error parsing color`)
  }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
