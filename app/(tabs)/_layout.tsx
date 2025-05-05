import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from ".";
import SchedulePage from "./schedule";
import NewSchedulePage from "./schedule/new-schedule";
import { Appbar } from "react-native-paper";
import { Header } from "@/components/Header/Header";
import { ProtectRoute } from "@/components/ProtectRoute";
import ScheduleEditPage from "./schedule/[scheduleEditId]";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerScreens" component={DrawerNavigator} />
      <Stack.Screen name="schedule/new-schedule" component={NewSchedulePage} />
      <Stack.Screen name="schedule/[scheduleEditId]" component={ScheduleEditPage} />
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
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Schedule" component={SchedulePage} />
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
