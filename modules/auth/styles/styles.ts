import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: Colors.light.mainColor,
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
      marginBottom: 6,
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
      color: Colors.light.text,
    },
    container: {
      padding: 16,
      margin: 10,
      borderRadius: 6,
      backgroundColor: '#fff',
      height: 'auto',
    },
    errorText: {
      color: 'red',
      marginBottom: 12,
    },
    forgotPassText: {
      color: Colors.light.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    input: {
      flex: 1,
      height: 'auto',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 8,
      borderRadius: 4,
    },
    inputIconContainer: {
      marginBottom: 12,
      height: 40,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      width: '100%',
    }
  });