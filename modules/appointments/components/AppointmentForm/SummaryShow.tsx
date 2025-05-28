import { View, Text } from "react-native";
import { appointmentFormStyle as styles } from "../../styles/styles";
import MaskInput, { Masks } from "react-native-mask-input";
import { formatToCurrency } from "@/helpers/formatValue";
import { useEffect } from "react";

interface Props {
    subTotalPrice: number;
    totalPrice: number;
    discount: number;
    setDiscount: (discount: number) => void;
}

export function SummaryShow({
    subTotalPrice,
    totalPrice,
    discount,
    setDiscount,
}: Props) {
    const handleDiscountChange = (masked: string, unmasked: string) => {
        const numericDiscount = Number(unmasked.replace(/\D/g, '')) / 100;

        if (isNaN(numericDiscount)) {
            setDiscount(0);
            return;
        }
        
        if (numericDiscount > subTotalPrice) {
            setDiscount(subTotalPrice);
            return;
        }

        setDiscount(Number(numericDiscount));
    };

    useEffect(() => {
        if (discount > subTotalPrice) {
            setDiscount(subTotalPrice);
        }
    }, [subTotalPrice]);

    return(
         <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Resumo</Text>
          <View style={styles.summarySection}>
            <View>
              <Text style={styles.sectionSubLabel}>SubTotal</Text>
              <Text style={styles.sectionSubLabel}>{formatToCurrency(subTotalPrice)}</Text>
            </View>
            <View>
              <Text style={styles.sectionSubLabel}>Desconto</Text>
              <MaskInput
                keyboardType="numeric"
                value={formatToCurrency(discount)}
                onChangeText={handleDiscountChange}
                mask={Masks.BRL_CURRENCY}
              />
            </View>
            <View>
              <Text style={styles.sectionSubLabel}>Valor Total</Text>
              <Text style={styles.sectionSubLabel}>{formatToCurrency(totalPrice)}</Text>
            </View>
          </View>
        </View>
    )
}