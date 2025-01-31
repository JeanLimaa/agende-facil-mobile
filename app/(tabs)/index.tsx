import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    function logOff() {
        AsyncStorage.removeItem('auth_token');
        router.push('/auth');
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to AgendeFacil!!!</Text>
            <Button title="Login" onPress={logOff} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default HomeScreen;