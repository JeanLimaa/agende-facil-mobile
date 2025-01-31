import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';

function LoginComponent() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleLogin() {
    setErrorMessage('');

    if (!loginData.email || !loginData.password) {
      setErrorMessage('O email e a senha são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        body: JSON.stringify(loginData),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if(!response.ok){
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }

      const data = await response.json();
      await AsyncStorage.setItem('auth_token', data.access_token);

      router.push('/(tabs)');
    } catch (error) {
      setErrorMessage('Algum erro ocorreu ao realizar login. Tente novamente mais tarde.');
    }
  };

  return (
    <>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={loginData.email}
        onChangeText={(email) => setLoginData(prev => ({...prev, email}))}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={loginData.password}
        onChangeText={(password) => setLoginData(prev => ({...prev, password}))}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </>
  )
}

interface IRegisterData {
  email: string;
  password: string;
  phone: string;
  name: string;
}


interface IErrorDefault {
  message: string;
  statusCode: number;
  error: string;
}

function RegisterComponent() {
  const [data, setData] = useState<IRegisterData>({ email: '', password: '', phone: '', name: '' });
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleRegister(data: IRegisterData) {
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData: IErrorDefault = await response.json();
        setErrorMessage(errorData.message);
        return;
      }
      
      Alert.alert('Cadastro realizado', 'Usuário cadastrado com sucesso!');
      console.log(response)
      //router.push('/auth/login');
    } catch (error: Error | any) {
      setErrorMessage('Erro ao cadastrar usuário}');
    }
  }

  return (
    <>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nome da Empresa"
        value={data.name}
        onChangeText={(name) => setData(prev => ({...prev, name}))}

      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={data.email}
        onChangeText={(email) => setData(prev => ({...prev, email}))}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={data.password}
        onChangeText={(password) => setData(prev => ({...prev, password}))}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone/Celular"
        value={data.phone}
        onChangeText={(phone) => setData(prev => ({...prev, phone}))}
        keyboardType='phone-pad'
      />

      <Button title="Cadastrar" onPress={() => handleRegister(data)} />
    </>
  )
}

export default function LoginScreen() {
  const [isLoginTab, setIsLoginTab] = useState(true);

  return (
    <View style={styles.mainContainer}>
      {/* Logo no topo */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

      {/* Tab de Login e Cadastro */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setIsLoginTab(true)} style={[styles.tab, isLoginTab && styles.activeTab]}>
          <Text style={[styles.tabText, isLoginTab && styles.activeTab]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLoginTab(false)} style={[styles.tab, !isLoginTab && styles.activeTab]}>
          <Text style={[styles.tabText, !isLoginTab && styles.activeTab]}>Cadastro</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={styles.container}>
        {isLoginTab ? (
          <LoginComponent />
        ) : (
          <RegisterComponent />
        )}

        {/* Botão para "Esqueceu a senha?" */}
        {/* <Link href={"/forgot-password" as never}>Esqueceu a senha?</Link> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.light.background,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: "#fff",
    color: "#fff",
  },
  tabText: {
    fontSize: 16,
    /* color: '#F5FCFF' */
  },
  container: {
    padding: 16,
    margin: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 'auto',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  }
});
