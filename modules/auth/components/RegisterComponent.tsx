import React, { useState } from 'react';
import { Text, TextInput, Button, Alert } from 'react-native';
import { IRegisterData } from '../interfaces/register.interface';
import { IErrorDefault } from '../interfaces/error.interface';
import { styles } from '../styles/styles';
import { BASE_URL } from "@/constants/apiUrl";
import { useAuth } from '../contexts/AuthContext';
export function RegisterComponent() {
  const { login } = useAuth();
  const [data, setData] = useState<IRegisterData>({ email: '', password: '', phone: '', name: '' });
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleRegister(data: IRegisterData) {
    setErrorMessage('');

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
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

      const responseData: {access_token: string} = await response.json();
      login(responseData.access_token);
    } catch (error: Error | any) {
      setErrorMessage('Erro ao cadastrar usuário. Tente novamente mais tarde.');
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