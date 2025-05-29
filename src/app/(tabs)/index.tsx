import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/modules/auth/contexts/AuthContext';
import { Link } from 'expo-router';

const HomeScreen = () => {
    const { logout } = useAuth();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to AgendeFacil!!!</Text>
            <Link href="/(tabs)/appointment">Schedule</Link>
            <Button title="Logout" onPress={logout} />
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