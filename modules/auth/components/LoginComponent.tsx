import { Link } from "expo-router";
import { useState } from "react";
import { TextInput, Text, Button } from "react-native";
import { styles } from "../styles/styles";
import React from "react";
import { useAuth } from "@/modules/auth/contexts/AuthContext";
import { BASE_URL } from "@/constants/apiUrl";
import {Entypo, Feather} from '@expo/vector-icons/';
import { InputIconContainer } from "./InputIconContainer";

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
      const response = await fetch(`${BASE_URL}/auth/login`, {
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
      login(data.access_token);
    } catch (error) {
      setErrorMessage('Algum erro ocorreu ao realizar login. Tente novamente mais tarde.');
    }
  };

  return (
    <>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <InputIconContainer>
        <Entypo name="email" size={20} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={loginData.email}
          onChangeText={(email) => setLoginData(prev => ({...prev, email}))}
          keyboardType="email-address"
        />
      </InputIconContainer>

      <InputIconContainer>
        <Feather name="lock" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={loginData.password}
          onChangeText={(password) => setLoginData(prev => ({...prev, password}))}
          secureTextEntry
        />
      </InputIconContainer>
      
      <Button title="Entrar" onPress={handleLogin} />
      
      <Link style={styles.forgotPassText} href={"/auth/forgot-password"}>Esqueceu a senha?</Link>
    </>
  )
}