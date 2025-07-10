import { GenericalCard } from "@/shared/components/GenericalCard";
import { Employee } from "@/shared/types/employee.interface";
import { Colors } from "@/shared/constants/Colors";
import { View, Text } from "react-native";

type ProfessionalCardProps = {
  onPress?: () => void;
  employee: Employee
};

export function ProfessionalCard({ onPress, employee }: ProfessionalCardProps){
  return (
    <GenericalCard 
      onPress={onPress} 
      showAvatar={true} 
      imageUrl={employee.profileImageUrl} 
      name={employee.name}
    >
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{employee.name}</Text>
          <Text style={{ color: Colors.light.textSecondary }}>
            {employee.position ? employee.position : "Sem papel definido"}
          </Text>
        </View>
    </GenericalCard>
  )
}