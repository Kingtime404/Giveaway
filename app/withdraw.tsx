import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Wallet,
  CreditCard,
  AlertCircle,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

export default function WithdrawScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, withdraw, isWithdrawing } = useUser();

  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const currentBalance = user?.balance || 0;
  const numericAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const isValidAmount = numericAmount >= 10000 && numericAmount <= currentBalance;
  const isValidAccount = accountNumber.length >= 10;
  const canSubmit = isValidAmount && isValidAccount && !isWithdrawing;

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue) {
      return parseInt(numericValue, 10).toLocaleString("id-ID");
    }
    return "";
  };

  const handleAmountChange = (value: string) => {
    setAmount(formatAmount(value));
  };

  const handleQuickAmount = (value: number) => {
    if (value <= currentBalance) {
      setAmount(value.toLocaleString("id-ID"));
    }
  };

  const handleWithdraw = async () => {
    if (!canSubmit) return;

    try {
      await withdraw(numericAmount, accountNumber);
      Alert.alert(
        "Berhasil",
        "Permintaan penarikan saldo berhasil diajukan. Dana akan dikirim dalam 1-3 hari kerja.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error ? error.message : "Terjadi kesalahan saat memproses penarikan"
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#1A1A1A", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarik Saldo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.balancePreview}>
          <View style={styles.balanceIcon}>
            <Wallet size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.balanceLabel}>Saldo Tersedia</Text>
            <Text style={styles.balanceValue}>
              Rp {currentBalance.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jumlah Penarikan</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {numericAmount > 0 && numericAmount < 10000 && (
            <View style={styles.errorRow}>
              <AlertCircle size={14} color={Colors.error} />
              <Text style={styles.errorText}>Minimum penarikan Rp 10.000</Text>
            </View>
          )}

          {numericAmount > currentBalance && (
            <View style={styles.errorRow}>
              <AlertCircle size={14} color={Colors.error} />
              <Text style={styles.errorText}>Saldo tidak mencukupi</Text>
            </View>
          )}

          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  value > currentBalance && styles.quickAmountDisabled,
                  numericAmount === value && styles.quickAmountSelected,
                ]}
                onPress={() => handleQuickAmount(value)}
                disabled={value > currentBalance}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    value > currentBalance && styles.quickAmountTextDisabled,
                    numericAmount === value && styles.quickAmountTextSelected,
                  ]}
                >
                  {value.toLocaleString("id-ID")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nomor DANA</Text>
          <View style={styles.accountInputContainer}>
            <CreditCard size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.accountInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Masukkan nomor DANA"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          <Text style={styles.inputHint}>
            Pastikan nomor DANA yang dimasukkan benar
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Jumlah Penarikan</Text>
            <Text style={styles.summaryValue}>
              Rp {numericAmount.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Admin</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>
              Rp 0
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Diterima</Text>
            <Text style={styles.totalValue}>
              Rp {numericAmount.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleWithdraw}
          disabled={!canSubmit}
        >
          {isWithdrawing ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.submitButtonText}>Tarik Saldo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Dana akan dikirim ke nomor DANA dalam 1-3 hari kerja setelah permintaan disetujui.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  balancePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "15",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    gap: 14,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
  },
  quickAmounts: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickAmountDisabled: {
    opacity: 0.4,
  },
  quickAmountSelected: {
    backgroundColor: Colors.primary + "20",
    borderColor: Colors.primary,
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  quickAmountTextDisabled: {
    color: Colors.textSecondary,
  },
  quickAmountTextSelected: {
    color: Colors.primary,
  },
  accountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  accountInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.border,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.background,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
