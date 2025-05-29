import { View } from "react-native";
import { styles } from "../styles/styles";

export function InputIconContainer({children}: {children: React.ReactNode}) {
  return(
    <View style={styles.inputIconContainer}>{children}</View>
  )
}