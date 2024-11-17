import React, { useState, useEffect, useContext, createContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Animated, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Accelerometer, Barometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Variometer, AttitudeIndicator} from './flightIndicators/src/index.js'


// Importando as imagens dos ícones
import IconEngrenagem from './assets/icons/engrenagem.png';
import IconPlanador from './assets/icons/planador.png';
import IconParaglider from './assets/icons/paraglider.png';
import IconFile from './assets/icons/file.png';

const VelocityContext = createContext();
const Tab = createBottomTabNavigator();





// Tela Configurações
function ConfiguracoesScreen() {
  const { unidadeVelocidade, unidadeAltitude, setUnidadeVelocidade, setUnidadeAltitude } = useContext(VelocityContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Configurações</Text>
      <Text style={styles.data}>Unidade de Velocidade: {unidadeVelocidade}</Text>
      <Button
        title={`Alterar para ${unidadeVelocidade === 'm/s' ? 'ft/s' : 'm/s'}`}
        onPress={() => setUnidadeVelocidade(unidadeVelocidade === 'm/s' ? 'ft/s' : 'm/s')}
      />
      <Text style={styles.data}>Unidade de Altitude: {unidadeAltitude}</Text>
      <Button
        title={`Alterar para ${unidadeAltitude === 'm' ? 'ft' : 'm'}`}
        onPress={() => setUnidadeAltitude(unidadeAltitude === 'm' ? 'ft' : 'm')}
      />
    </View>
  );
}

// Tela Paraglider
function ParagliderScreen() {
  const { unidadeVelocidade, unidadeAltitude } = useContext(VelocityContext);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const [lastZ, setLastZ] = useState(null);
  const [deltaTime, setDeltaTime] = useState(Date.now());
  const [altitude, setAltitude] = useState(0);

  const saveData = async (speed, alt) => {
    try {
      const data = {
        speed: String(speed),
        alt: String(alt),
        timestamp: Date.now(),
      };
      let storedData = await AsyncStorage.getItem('logs');
      storedData = storedData ? JSON.parse(storedData) : [];
      storedData.push(data);
      await AsyncStorage.setItem('logs', JSON.stringify(storedData));
    } catch (error) {
      console.error('Erro ao salvar dados no AsyncStorage:', error);
    }
  };

  function calculateAltitude(pressure) {
    const seaLevelPressure = 1013.25;
    return (1 - Math.pow(pressure / seaLevelPressure, 0.190284)) * 44307.69;
  }

  function convertAltitude(altitudeInMeters) {
    return unidadeAltitude === 'ft' ? altitudeInMeters * 3.28084 : altitudeInMeters;
  }

  useEffect(() => {
    //Accelerometer.setUpdateInterval(100);
    Barometer.setUpdateInterval(500);

    const accSubscription = Barometer.addListener(({pressure}) => {
      const currentTime = Date.now();
      const timeDiff = (currentTime - deltaTime) / 1000;
      setDeltaTime(currentTime);

      if (lastZ !== null) {
        const deltaZ = calculateAltitude(pressure) - lastZ;
        const speedInMs = deltaZ / timeDiff;
        const speedConverted = unidadeVelocidade === 'ft/s' ? speedInMs * 3.28084 : speedInMs;
        setVerticalSpeed(speedConverted.toFixed(2));
      }
      setLastZ(calculateAltitude(pressure));
    });

    const barSubscription = Barometer.addListener(({ pressure }) => {
      const currentAltitude = calculateAltitude(pressure);
      setAltitude(convertAltitude(currentAltitude).toFixed(2));
      saveData(verticalSpeed, currentAltitude);
    });

    return () => {
      accSubscription && accSubscription.remove();
      //barSubscription && barSubscription.remove();
    };
  }, [lastZ, deltaTime, unidadeVelocidade, unidadeAltitude, verticalSpeed]);

  const arrow = verticalSpeed > 0 ? '↑' : '↓';
  const arrowColor = verticalSpeed > 0 ? 'green' : 'red';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Paraglider</Text>
      <Variometer vario={verticalSpeed} showBox={true} />
      <Text style={styles.data}>
        Velocidade Vertical: {verticalSpeed} {unidadeVelocidade}
      </Text>
      <Text style={styles.data}>
        Altitude: {altitude} {unidadeAltitude}
      </Text>
    </View>
  );
}

// Tela Planador
function PlanadorScreen() {
  const [roll, setRoll] = useState(new Animated.Value(0));
  const [pitch, setPitch] = useState(new Animated.Value(0));
  const [currentRoll, setCurrentRoll] = useState(0);
  const [currentPitch, setCurrentPitch] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const calculatedPitch = Math.atan2(y, z) * (180 / Math.PI);
      const calculatedRoll = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);

      setCurrentPitch(calculatedPitch.toFixed(2));
      setCurrentRoll(calculatedRoll.toFixed(2));

      Animated.timing(roll, {
        toValue: calculatedRoll,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(pitch, {
        toValue: calculatedPitch,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    return () => subscription && subscription.remove();
  }, [roll, pitch]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Horizonte Artificial</Text>
      <View style={styles.horizonContainer}>
        <AttitudeIndicator roll={roll} pitch={pitch} showBox={false} />
      <Text style={styles.data}>Roll: {currentRoll}°</Text>
      <Text style={styles.data}>Pitch: {currentPitch}°</Text>
      </View>
    </View>
  );
}

// Tela Logs
function LogsScreen() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('logs');
        if (storedData) {
          setLogs(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Erro ao carregar os logs', error);
      }
    };

    loadData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Logs</Text>
      {logs.length > 0 ? (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>Timestamp: {formatDate(item.timestamp)}</Text>
              <Text>Velocidade: {item.speed} {typeof item.speed === 'string' && item.speed.includes('ft') ? 'ft/s' : 'm/s'}</Text>
              <Text>Altitude: {item.alt} {typeof item.alt === 'string' && item.alt.includes('ft') ? 'ft' : 'm'}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum dado registrado.</Text>
      )}
    </View>
  );
}

// Configuração do contexto e aplicação
export default function App() {
  const [unidadeVelocidade, setUnidadeVelocidade] = useState('m/s');
  const [unidadeAltitude, setUnidadeAltitude] = useState('m');

  return (
    <VelocityContext.Provider value={{ unidadeVelocidade, unidadeAltitude, setUnidadeVelocidade, setUnidadeAltitude }}>
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            // Seleciona o ícone com base no nome da rota
            let iconName;

            if (route.name === 'Configurações') {
              iconName = IconEngrenagem;
            } else if (route.name === 'Paraglider') {
              iconName = IconParaglider;
            } else if (route.name === 'Logs') {
              iconName = IconFile;
            } else if (route.name === 'Planador') {
              iconName = IconPlanador;
            }

            // Retorna a imagem como ícone
            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: 'blue',    // Cor do ícone ativo
          tabBarInactiveTintColor: 'gray',  // Cor do ícone inativo
        })}
      >
        
        <Tab.Screen name="Paraglider" component={ParagliderScreen} />
        <Tab.Screen name="Planador" component={PlanadorScreen} />
        <Tab.Screen name="Logs" component={LogsScreen} />
        <Tab.Screen name="Configurações" component={ConfiguracoesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </VelocityContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
  },
  data: {
    marginTop: 10,
    fontSize: 16,
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  horizonContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 100,
  },
  horizonLine: {
    position: 'absolute',
    width: '200%',
    height: 2,
    backgroundColor: '#fff',
  },
});
