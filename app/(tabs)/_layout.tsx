import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from ".";
import AppointmentPage from "./appointment";
import NewAppointmentPage from "./appointment/new-appointment";
import { Appbar } from "react-native-paper";
import { Header } from "@/components/Header/Header";
import { ProtectRoute } from "@/components/ProtectRoute";
import AppointmentEditPage from "./appointment/[appointmentEditId]";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerScreens" component={DrawerNavigator} />
      <Stack.Screen name="appointment/new-appointment" component={NewAppointmentPage} />
      <Stack.Screen name="appointment/[appointmentEditId]" component={AppointmentEditPage} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: "80%" },
        header: ({ navigation }) => (
          <Header navigation={navigation}>
            <Appbar.Content title="Agende Fácil" />
          </Header>
        ),
      }}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Agendamentos" component={AppointmentPage} />
    </Drawer.Navigator>
  );
}

export default function TabsLayout() {
  return (
    <ProtectRoute>
      <StackNavigator />
    </ProtectRoute>
  );
}
