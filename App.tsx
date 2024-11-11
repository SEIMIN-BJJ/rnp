import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = 'e8e04ff2b6daa7caef341391331e9e7c'; // Replace with your actual API key

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
  },
});

const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setError('위치 권한을 허용해주세요.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location) {
        const { latitude, longitude } = location.coords;
        try {
          const response = await axios.get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeatherData(response.data);
        } catch (error) {
          setError('날씨 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <Text style={styles.temperatureText}>현재 온도: {weatherData?.main?.temp}°C</Text>
          <Text style={styles.infoText}>날씨: {weatherData?.weather[0].description}</Text>
          {/* 추가적인 날씨 정보 */}
        </>
      )}
    </View>
  );
};

export default WeatherApp;