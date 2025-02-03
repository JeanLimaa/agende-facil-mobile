import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useState } from "react";
import { TextInput, Text, Button } from "react-native";
import { styles } from "../styles/styles";
import React from "react";
import { useAuth } from "@/modules/auth/contexts/AuthContext";

export function LoginComponent() {
  const { login } = useAuth();
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
console.log(response)
      if(!response.ok){
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        return;
      }

      const data = await response.json();
      login(data.access_token);
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

      
      <Link href={"/auth/forgot-password"}>Esqueceu a senha?</Link>
    </>
  )
}