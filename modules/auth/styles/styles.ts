import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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