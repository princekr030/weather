import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, StyleSheet, Dimensions, Alert, ActivityIndicator, Image, TouchableOpacity, FlatList } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { api_key, month, weekday } from '../Constants';

const Weather = () => {

    const [weatherData, setWeatherData] = useState(null);
    const [image, setImage] = useState('')
    const [cityName, setCityName] = useState('')
    const [error, setError] = useState(false)
    const [forecastData, setForeCastData] = useState(null)

    const featchWeatherData = async (city) => {

        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
            if (response.status == 200) {
                const data = await response.json()
                // console.log(data)
                const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&cnt=5&appid=${api_key}`)
                if (res.status == 200) {
                    const data = await res.json()
                    console.log(data)
                    setForeCastData(data?.list)
                }
                setError(false)
                setImage('https://openweathermap.org/img/wn/' + data.weather[0].icon)
                setWeatherData(data)
            }
            else {
                setError(true)
                setWeatherData(null)
            }

        }

        catch (e) {
            Alert.alert('Error', e.message)
        }


    }

    const renderForecastData = (item) => {
        let date = new Date(item.dt * 1000)
        let tempDate = date.getDate() + "," + month[date.getMonth()] + " " + weekday[date.getDay()] + " " + date.getHours() + ":" + date.getMinutes()
        return (

            <View style={styles.viewComp}>
                <Text style={styles.textView}>{tempDate}</Text>
                <Text style={styles.textView}>{item.weather[0].description}</Text>
                <Text style={styles.textView}>{(item.main.temp - 273.15).toFixed(2)} °C </Text>
            </View>
        )
    }



    return (

        <View style={{ flex: 1 }}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={{ flex: 1 }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.searchBar}>
                        <TextInput
                            placeholder='Enter City Name or Zip Code'
                            value={cityName}
                            style={{ width: 300 }}
                            onChangeText={(text) => setCityName(text)}
                        />
                        <EvilIcons name="search" size={28} color="grey" onPress={() => featchWeatherData(cityName)} />

                    </View>
                    {weatherData && <TouchableOpacity style={{ marginTop: 40, }} onPress={() => featchWeatherData(cityName)}>
                        <EvilIcons name="refresh" size={28} color="white" onPress={() => featchWeatherData(cityName)} />
                    </TouchableOpacity>}
                </View>


                {weatherData && <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', color: 'white', marginTop: 10 }}>{weatherData && weatherData?.name}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={styles.iconStyle}
                            source={{ uri: `${image}@2x.png` }}
                        />
                        <Text style={[styles.temperature, { marginTop: 30 }]}>{weatherData && weatherData?.main.temp} °C</Text>
                    </View>

                    <Text style={[styles.temperature, { marginTop: 0, fontSize: 20 }]}>{weatherData && weatherData?.weather[0].description}</Text>
                    <View style={styles.dataView}>
                        <View style={styles.viewComp}>
                            <Text style={styles.textView}>Min/Max</Text>
                            <Text style={styles.textView}>{weatherData && weatherData?.main.temp_min} °C / {weatherData && weatherData?.main.temp_max}  °C </Text>
                        </View>
                        <View style={styles.viewComp}>
                            <Text style={styles.textView}>Feels like</Text>
                            <Text style={styles.textView}>{weatherData && weatherData?.main.feels_like} °C</Text>
                        </View>
                        <View style={styles.viewComp}>
                            <Text style={styles.textView}>Humidity</Text>
                            <Text style={styles.textView}>{weatherData && weatherData?.main.humidity} %</Text>
                        </View>
                        <View style={styles.viewComp}>
                            <Text style={styles.textView}>Visibility</Text>
                            <Text style={styles.textView}>{weatherData && weatherData?.visibility} </Text>
                        </View>

                    </View>
                    <Text style={styles.temperature}>Weather Forecast</Text>
                    <View style={[styles.dataView,{  marginBottom : 20}]}>
                        <FlatList
                            data={forecastData}
                            renderItem={({ item }) => renderForecastData(item)}
                        />
                    </View>


                </View>}

                {error && <View style={{ alignItems: 'center', marginTop: 10, }}>
                    <Text style={styles.textView}>Location Not found</Text>
                </View>}
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Dimensions.get('screen').width - 60,
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderColor: 'black'
    },
    iconStyle: {
        width: 100,
        height: 100
    },
    temperature: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
        marginTop: 5
    },
    dataView: {
        marginTop: 10,
        width: Dimensions.get('screen').width,
        height: 180,
        borderRadius: 10,
        backgroundColor: '#4c669f',
        shadowOpacity: 1,
    },
    viewComp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    textView: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
        marginTop: 5
    }
})

export default Weather;