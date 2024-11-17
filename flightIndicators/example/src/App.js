import React from 'react'

import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  TurnCoordinator,
  Variometer
} from 'react-flight-indicators'

const App = () => {
  return (
    <>
      <div>
        <h1>react-flight-indicators</h1>

        <p>The following flight indicators are available:</p>
      </div>

      <hr />
      <HeadingIndicator heading={Math.random() * 360} showBox={false} />

      <pre>
        &lt;HeadingIndicator heading={'{Math.random()*360}'} showBox={'{false}'} /&gt;
      </pre>
      <hr />

      <Airspeed speed={Math.random() * 160} showBox={false} />
      <pre>
        &lt;Airspeed speed={'{Math.random() * 160}'} showBox={'{false}'} /&gt;
      </pre>
      <hr />

      <Altimeter altitude={Math.random() * 28000} showBox={false} />
      <pre>
        &lt;Altimeter altitude={'{Math.random() * 28000}'} showBox={'{false}'} /&gt;
      </pre>
      <hr />

      <AttitudeIndicator roll={(Math.random() - 0.5) * 120} pitch={(Math.random() - 0.5) * 40} showBox={false} />
      <pre>
        &lt;AttitudeIndicator roll={'{(Math.random() - 0.5) * 120}'} pitch={'{(Math.random() - 0.5) * 40}'} showBox={'{false}'} /&gt;
      </pre>
      <hr />

      <TurnCoordinator turn={(Math.random() - 0.5) * 120} showBox={false} />
      <pre>
        &lt;TurnCoordinator turn={'{(Math.random() - 0.5) * 120}'} showBox={'{false'}} /&gt;
      </pre>
      <hr />

      <Variometer vario={(Math.random() - 0.5) * 4000} showBox={false} />
      <pre>
        &lt;Variometer vario={'{(Math.random() - 0.5) * 4000}'} showBox={'{false}'} /&gt;
      </pre>
    </>
  )
}

export default App
