import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";

export default function SaldoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, withdrawHistory } = useUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle size={16} color={Colors.success} />;
      case "failed":
        return <XCircle size={16} color={Colors.error} />;
      default:
        return <Clock size={16} color={Colors.warning} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return Colors.success;
      case "failed":
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Berhasil";
      case "failed":
        return "Gagal";
      default:
        return "Menunggu";
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
        <Text style={styles.headerTitle}>Saldo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceIcon}>
            <Wallet size={28} color={Colors.background} />
          </View>
          <Text style={styles.balanceLabel}>Saldo Anda</Text>
          <Text style={styles.balanceAmount}>
            Rp {(user?.balance || 0).toLocaleString("id-ID")}
          </Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => router.push("/withdraw")}
          >
            <ArrowUpRight size={18} color={Colors.primary} />
            <Text style={styles.withdrawButtonText}>Tarik Saldo</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Penarikan</Text>

          {withdrawHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <ArrowDownLeft size={32} color={Colors.textSecondary} />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyDescription}>
                Riwayat penarikan saldo Anda akan muncul di sini
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {withdrawHistory
                .slice()
                .reverse()
                .map((item) => (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyIconContainer}>
                      <ArrowUpRight size={20} color={Colors.error} />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyTitle}>Penarikan Dana</Text>
                      <Text style={styles.historyAccount}>
                        ke {item.accountNumber}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={styles.historyAmount}>
                        -Rp {item.amount.toLocaleString("id-ID")}
                      </Text>
                      <View style={styles.statusBadge}>
                        {getStatusIcon(item.status)}
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(item.status) },
                          ]}
                        >
                          {getStatusText(item.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>
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
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  balanceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.background,
    marginBottom: 20,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  withdrawButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.error + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  historyAccount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.error,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
});
