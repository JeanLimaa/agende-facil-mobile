import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, Modal, Button } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AppointmentPage from "./appointment";
import NewAppointmentPage from "./appointment/new-appointment";
import { Appbar } from "react-native-paper";
import { Header } from "@/shared/components/header/Header";
import { ProtectRoute } from "@/shared/components/ProtectRoute";
import AppointmentEditPage from "./appointment/[appointmentEditId]";
import BlockPage from "./appointment/block";
import { Colors } from '@/shared/constants/Colors';
import { useAuth } from '@/modules/auth/contexts/AuthContext';
import { useMe } from '@/shared/hooks/queries/useMe';
import { Loading } from '@/shared/components/Loading';
import ErrorScreen from '../ErrorScreen';
import { useState } from 'react';
import { MyLink } from '@/modules/my-link/MyLink';
import { SuspenseLoading } from '@/shared/components/SuspenseLoading';
import ClientsPage from "./clients";
import NewClientPage from './clients/new';
import ImportContactsPage from './clients/import';
import EditClientPage from './clients/edit';
import AppointmentsHistoryPage from './clients/appointments-history';
import WorkingHoursScreen from "./settings/booking-and-website/working-hours";
import CompanyProfileScreen from "./settings/booking-and-website/company-profile";
import ProfessionalsScreen from "./settings/records/professionals";
import CategoriesScreen from "./settings/records/categories";
import ServicesScreen from "./settings/records/services";
import ChangePasswordScreen from "./settings/security/change-password";
import SettingsPage from './settings';
import { SettingsProfessionalTabs } from '@/modules/settings/components/Professional/SettingsProfessionalTab';
import { AddOrEditCategory } from '@/modules/settings/components/Categories/AddOrEditCategory';
import DeleteCategories from '@/modules/settings/components/Categories/DeleteCategories';
import { AddOrEditService } from '@/modules/settings/components/Services/AddOrEditService';

const SubscriptionPage = () => <View><Text>Subscription Screen</Text></View>;

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerScreens" component={DrawerNavigator} />
      <Stack.Screen name="appointment/new-appointment" component={NewAppointmentPage} />
      <Stack.Screen name="appointment/[appointmentEditId]" component={AppointmentEditPage} />
      <Stack.Screen name="appointment/block" component={BlockPage} />

      <Stack.Screen name="clients/new" component={NewClientPage} />
      <Stack.Screen name="clients/edit" component={EditClientPage} />
      <Stack.Screen name="clients/import" component={ImportContactsPage} />
      <Stack.Screen name="clients/appointments-history" component={AppointmentsHistoryPage} />

      <Stack.Screen name="settings" component={SettingsPage} />
      <Stack.Screen name="settings/booking-and-website/working-hours" component={WorkingHoursScreen} />
      <Stack.Screen name="settings/booking-and-website/company-profile" component={CompanyProfileScreen} />

      <Stack.Screen name="settings/records/professionals" component={ProfessionalsScreen} />
      <Stack.Screen name="settings/records/professionals/professional-form" component={SettingsProfessionalTabs} />
      
      <Stack.Screen name="settings/records/categories" component={CategoriesScreen} />
      <Stack.Screen name="settings/records/categories/category-form" component={AddOrEditCategory} />
      <Stack.Screen name="settings/records/categories/delete-category" component={DeleteCategories} />

      <Stack.Screen name="settings/records/services" component={ServicesScreen} />
      
      <Stack.Screen name="settings/security/change-password" component={ChangePasswordScreen} />

      <Stack.Screen name="settings/records/services/service-form" component={AddOrEditService} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { logout } = useAuth();
  const { data: user, isLoading: userInfoLoading, error, refetch } = useMe();
  const [myLinkModalVisible, setMyLinkModalVisible] = useState(false);

  if (error || !user) return <ErrorScreen onRetry={refetch} />;

  const handleMyLink = () => {
    setMyLinkModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
          />
          <View>
            <SuspenseLoading
              isLoading={userInfoLoading}
              fallback={<Loading />}
            >
              <Text style={styles.companyName}>{user.companyName}</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </SuspenseLoading>
          </View>
        </View>

        <DrawerItemList {...props} />

        <DrawerItem
          label="Meu link"
          labelStyle={{ color: Colors.light.text }}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="link-variant" color={color} size={size} />
          )}
          onPress={handleMyLink}
        />

      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <DrawerItem
          label="Sair"
          labelStyle={{ color: Colors.light.text }}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          onPress={logout}
        />
      </View>

      <MyLink
        visible={myLinkModalVisible}
        onClose={() => setMyLinkModalVisible(false)}
      />
    </View>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName='Agendamentos'
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: "80%" },
        header: ({ navigation, options, route }) => (
          <Header navigation={navigation}>
             <Appbar.Content title={options.title ?? route.name} />
          </Header>
        ),
        drawerActiveTintColor: Colors.light.mainColor,
        drawerInactiveTintColor: Colors.light.text,
      }}
    >
      <Drawer.Screen
        name="Agendamentos"
        component={AppointmentPage}
        options={{
          title: "Agendamentos",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Clients"
        component={ClientsPage}
        options={{
          title: "Clientes",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          title: "Configurações",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Subscription"
        component={SubscriptionPage}
        options={{
          title: "Assinatura",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="credit-card-outline" color={color} size={size} />
          ),
        }}
      />
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

const styles = StyleSheet.create({
  drawerHeader: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  userName: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
});