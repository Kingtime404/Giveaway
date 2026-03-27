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
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  Instagram,
  Youtube,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";

export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
        <Text style={styles.headerTitle}>Akun Saya</Text>
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
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </LinearGradient>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <User size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama Lengkap</Text>
                <Text style={styles.infoValue}>{user?.name || "-"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Mail size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || "-"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Phone size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>No. Telepon</Text>
                <Text style={styles.infoValue}>{user?.phone || "-"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={20} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Terdaftar Sejak</Text>
                <Text style={styles.infoValue}>
                  {user?.registeredAt ? formatDate(user.registeredAt) : "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Keanggotaan</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: "#E1306C20" }]}>
                <Instagram size={20} color="#E1306C" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Follow Instagram 1</Text>
                <View style={styles.statusRow}>
                  {user?.followedInstagram ? (
                    <>
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={[styles.statusText, { color: Colors.success }]}>
                        Sudah Follow
                      </Text>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color={Colors.error} />
                      <Text style={[styles.statusText, { color: Colors.error }]}>
                        Belum Follow
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: "#FF000020" }]}>
                <Youtube size={20} color="#FF0000" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Subscribe YouTube</Text>
                <View style={styles.statusRow}>
                  {user?.followedYoutube ? (
                    <>
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={[styles.statusText, { color: Colors.success }]}>
                        Sudah Subscribe
                      </Text>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color={Colors.error} />
                      <Text style={[styles.statusText, { color: Colors.error }]}>
                        Belum Subscribe
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: "#E1306C20" }]}>
                <Instagram size={20} color="#E1306C" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Follow Instagram 2</Text>
                <View style={styles.statusRow}>
                  {user?.followedInstagram2 ? (
                    <>
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={[styles.statusText, { color: Colors.success }]}>
                        Sudah Follow
                      </Text>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color={Colors.error} />
                      <Text style={[styles.statusText, { color: Colors.error }]}>
                        Belum Follow
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistik</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user?.participatedGiveaways.length || 0}
              </Text>
              <Text style={styles.statLabel}>Giveaway Diikuti</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                Rp {(user?.balance || 0).toLocaleString("id-ID")}
              </Text>
              <Text style={styles.statLabel}>Saldo</Text>
            </View>
          </View>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "800" as const,
    color: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
