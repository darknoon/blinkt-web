const express = require('express')
const app = express()
const cssColor = require('color-functions/lib/css-color');
const Blinkt = require('node-blinkt');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/color/:color', (req, res) => {
  const {params:{color}} = req;
  const rgba = cssColor(color);
  if (rgba) {
    const leds = new Blinkt();
    const {r, g, b, a} = rgba;
    leds.setup();
    leds.setAllPixels(r, g, b, a);
    leds.sendUpdate();
    res.send(`Set color to <span style='backgroundColor:${color}'>${JSON.stringify(rgba)}</span>`)
  } else {
    res.send(`Error parsing color`)
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
