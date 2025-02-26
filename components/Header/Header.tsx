import { ReactNode } from "react";
import { Appbar, } from "react-native-paper";
import { styles } from "./styles";
import { DrawerNavigationHelpers, DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/commonjs/src/types";
import { ParamListBase } from "@react-navigation/native";

interface IHeaderProps {
  children: ReactNode;
  navigation: DrawerNavigationProp<ParamListBase>;
}

export function Header({children, navigation}: IHeaderProps) {

  return (
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          {children}
      </Appbar.Header>
  );
}
