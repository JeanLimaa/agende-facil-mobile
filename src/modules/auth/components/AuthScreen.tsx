import { TouchableOpacity, View, Text, Image } from "react-native";
import { styles } from "../styles/styles";
import {  usePathname, router } from "expo-router";

export default function AuthScreen({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  const isLoginTab = pathname === "/auth/login";

  function switchTab() {
    router.replace(isLoginTab ? "/auth/register" : "/auth/login");
  }

  return (
    <View style={styles.mainContainer}>
      {/* Logo no topo */}
      <Image source={require('../../../../assets/images/logo.png')} style={styles.logo} />

      {/* Tab de Login e Cadastro */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={switchTab} style={[styles.tab, isLoginTab && styles.activeTab]}>
          <Text style={[styles.tabText, isLoginTab && styles.activeTab]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={switchTab} style={[styles.tab, !isLoginTab && styles.activeTab]}>
          <Text style={[styles.tabText, !isLoginTab && styles.activeTab]}>Cadastro</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={styles.container}>
        {children}
      </View>
    </View>
  );
}