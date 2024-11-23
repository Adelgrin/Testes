import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const constants = {
  pitch_bound: 30,
  vario_bound: 1.95,
  airspeed_bound_l: 0,
  airspeed_bound_h: 160,
};

const boxStyle = {
  ...StyleSheet.absoluteFillObject,
};

const Instrument = ({ children, showBox = true, size = 200 }) => {
  return (
    <View
      style={[
        styles.instrument,
        {
          height: size,
          width: size,
        },
      ]}
    >
      {showBox && (
        <Image source={require('./img/fi_box.png')} style={boxStyle} resizeMode="contain" />
      )}
      {children}
    </View>
  );
};

export const HeadingIndicator = ({ heading = 0, ...params }) => (
  <Instrument {...params}>
    <View style={[boxStyle, { transform: [{ rotate: `${-heading}deg` }] }]}>
      <Image source={require('./img/heading_yaw.png')} style={boxStyle} resizeMode="contain" />
    </View>
    <View style={boxStyle}>
      <Image source={require('./img/heading_mechanics.png')} style={boxStyle} resizeMode="contain" />
      <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
    </View>
  </Instrument>
);

export const Variometer = ({ vario = 0, ...params }) => {
  let adjustedVario = vario / 1;
  //adjustedVario = Math.min(Math.max(adjustedVario, -constants.vario_bound), constants.vario_bound);
  adjustedVario *= 90;

  return (
    <Instrument {...params}>
      <Image source={require('./img/vertical_mechanics.png')} style={boxStyle} resizeMode="contain"/>
      <View style={[boxStyle, { transform: [{ rotate: `${adjustedVario}deg` }] }]}>
        <Image source={require('./img/fi_needle.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <View style={boxStyle}>
        <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
      </View>
    </Instrument>
  );
};

export const TurnCoordinator = ({ turn = 0, ...params }) => (
  <Instrument {...params}>
    <Image source={require('./img/turn_coordinator.png')} style={boxStyle} resizeMode="contain" />
    <View style={[boxStyle, { transform: [{ rotate: `${turn}deg` }] }]}>
      <Image source={require('./img/fi_tc_airplane.png')} style={boxStyle} resizeMode="contain" />
    </View>
    <View style={boxStyle}>
      <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
    </View>
  </Instrument>
);

export const Airspeed = ({ speed = 0, ...params }) => {
  const adjustedSpeed = Math.min(
    Math.max(speed, constants.airspeed_bound_l),
    constants.airspeed_bound_h
  );
  const rotation = 90 + adjustedSpeed * 2;

  return (
    <Instrument {...params}>
      <Image source={require('./img/speed_mechanics.png')} style={boxStyle} resizeMode="contain" />
      <View style={[boxStyle, { transform: [{ rotate: `${rotation}deg` }] }]}>
        <Image source={require('./img/fi_needle.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <View style={boxStyle}>
        <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
      </View>
    </Instrument>
  );
};

export const Altimeter = ({ altitude = 0, pressure = 1013.25, ...params }) => {
  const needle = 90 + (altitude % 1000) * (360 / 1000);
  const needleSmall = (altitude / 10000) * 360;
  const adjustedPressure = 2 * pressure - 1980;

  return (
    <Instrument {...params}>
      <View style={[boxStyle, { transform: [{ rotate: `${adjustedPressure}deg` }] }]}>
        <Image source={require('./img/altitude_pressure.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <Image source={require('./img/altitude_ticks.png')} style={boxStyle} resizeMode="contain" />
      <View style={[boxStyle, { transform: [{ rotate: `${needleSmall}deg` }] }]}>
        <Image source={require('./img/fi_needle_small.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <View style={[boxStyle, { transform: [{ rotate: `${needle}deg` }] }]}>
        <Image source={require('./img/fi_needle.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <View style={boxStyle}>
        <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
      </View>
    </Instrument>
  );
};

export const AttitudeIndicator = ({ pitch = 0, roll = 0, ...params }) => {
  const adjustedPitch = Math.min(Math.max(pitch, -constants.pitch_bound), constants.pitch_bound);

  return (
    <Instrument {...params}>
      <View style={[boxStyle, { transform: [{ rotate: `${roll}deg` }] }]}>
        <Image source={require('./img/horizon_back.png')} style={boxStyle} resizeMode="contain" />
        <View
          style={[
            boxStyle,
            {
              top: `${adjustedPitch * 0.7}%`,
            },
          ]}
        >
          <Image source={require('./img/horizon_ball.png')} style={boxStyle} resizeMode="contain" />
        </View>
        <Image source={require('./img/horizon_circle.png')} style={boxStyle} resizeMode="contain" />
      </View>
      <View style={boxStyle}>
        <Image source={require('./img/horizon_mechanics.png')} style={boxStyle} resizeMode="contain" />
        <Image source={require('./img/fi_circle.png')} style={boxStyle} resizeMode="contain" />
      </View>
    </Instrument>
  );
};

const styles = StyleSheet.create({
  instrument: {
    position: 'relative',
    overflow: 'hidden',
  },
});

