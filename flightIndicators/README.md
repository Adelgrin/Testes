react-flight-indicators [![NPM](https://img.shields.io/npm/v/react-flight-indicators.svg)](https://www.npmjs.com/package/react-flight-indicators) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
====

The `react-flight-indicators` package allows you to display high quality flight indicators using html, css3, React and SVG images. The methods make customization and real time implementation really easy. Further, since all the images are vector svg you can resize the indicators to your application without any quality loss ! 

Currently supported indicators are :

* Attitude (artificial horizon)
* Heading 
* Vertical speed
* Air speed
* Altimeter

`react-flight-indicators` is a fork from [sebmatton/jQuery-Flight-Indicators](https://github.com/sebmatton/jQuery-Flight-Indicators), and refactored for use with ReactJS, essentially removing the JQuery dependency.


## Install

Using NPM;

```bash
npm install --save react-flight-indicators
```

Alternatively with YARN;

```bash
yarn add react-flight-indicators
```

## Usage

```jsx
import React, { Component } from 'react'

import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  TurnCoordinator,
  Variometer
} from 'react-flight-indicators'

const Example = () => {
  	return (
	  	<>
			<HeadingIndicator heading={Math.random() * 360} showBox={false} />

			<hr />

			<Airspeed speed={Math.random() * 160} showBox={false} />

			<hr />

			<Altimeter altitude={Math.random() * 28000} showBox={false} />

			<hr />

			<AttitudeIndicator roll={(Math.random() - 0.5) * 120} pitch={(Math.random() - 0.5) * 40} showBox={false} />

			<hr />

			<TurnCoordinator turn={(Math.random() - 0.5) * 120} showBox={false} />

			<hr />

			<Variometer vario={(Math.random() - 0.5) * 4000} showBox={false} />
	  	</>
  	)
}
```


Example & Demo
-------------------

The JQuery demo can be found here : [http://sebmatton.github.io/flightindicators/](http://sebmatton.github.io/flightindicators/)

Here are a few examples of currently implemented indicators :

![demo_example](https://raw.githubusercontent.com/sebmatton/jQuery-Flight-Indicators/master/_examples_data/example.png "Indicator examples")

The image below shows a part of an 800px indicator. Vector images allows you to keep high quality render with large indicators.

![demo_highres](https://raw.githubusercontent.com/sebmatton/jQuery-Flight-Indicators/master/_examples_data/example_highres.png "High resolution indicator")


Authors and License
-----------

Originally this project has been based on work by igneosaur, which could be found [on Bitbucket](https://bitbucket.org/igneosaur/attitude-indicator).

Further work is done by Sébastien Matton (seb_matton@hotmail.com), whom developed the jQuery plugin as part of his master's for showing realtime flight information from a quadcopter.

[Corstian Boerman](https://corstianboerman.com) has adapted the project by Sébastien for use with React.

The project is published under GPLv3 License. See LICENSE file for more informations