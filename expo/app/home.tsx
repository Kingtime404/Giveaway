import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Gift,
  Users,
  Clock,
  LogOut,
  Trophy,
  Sparkles,
  User,
  Wallet,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { giveaways, Giveaway } from "@/mocks/giveaways";
import Colors from "@/constants/colors";

function GiveawayCard({
  giveaway,
  onPress,
  hasParticipated,
}: {
  giveaway: Giveaway;
  onPress: () => void;
  hasParticipated: boolean;
}) {
  const daysLeft = Math.ceil(
    (new Date(giveaway.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: giveaway.image }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardImageOverlay}
        />
        {hasParticipated && (
          <View style={styles.participatedBadge}>
            <Trophy size={14} color={Colors.primary} />
            <Text style={styles.participatedText}>Sudah Ikut</Text>
          </View>
        )}
        <View style={styles.cardBadge}>
          <Clock size={12} color={Colors.text} />
          <Text style={styles.cardBadgeText}>{daysLeft} hari lagi</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {giveaway.title}
        </Text>

        <View style={styles.prizeContainer}>
          <Gift size={16} color={Colors.primary} />
          <Text style={styles.prizeText}>{giveaway.prize}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.participantsContainer}>
            <Users size={14} color={Colors.textSecondary} />
            <Text style={styles.participantsText}>
              {giveaway.participants.toLocaleString()} peserta
            </Text>
          </View>

          <View style={styles.joinButton}>
            <Text style={styles.joinButtonText}>
              {hasParticipated ? "Lihat Detail" : "Ikuti"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, hasParticipated } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const activeGiveaways = giveaways.filter((g) => g.isActive);
  const participatedCount = activeGiveaways.filter((g) =>
    hasParticipated(g.id)
  ).length;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleGiveawayPress = (giveaway: Giveaway) => {
    router.push(`/giveaway/${giveaway.id}`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#1A1A1A", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.name?.split(" ")[0]} 👋</Text>
          <Text style={styles.subGreeting}>Siap menangkan hadiah hari ini?</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.primary + "20", Colors.primaryLight + "10"]}
              style={styles.statGradient}
            >
              <Gift size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{activeGiveaways.length}</Text>
              <Text style={styles.statLabel}>Giveaway Aktif</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[Colors.success + "20", Colors.success + "10"]}
              style={styles.statGradient}
            >
              <Trophy size={24} color={Colors.success} />
              <Text style={styles.statNumber}>{participatedCount}</Text>
              <Text style={styles.statLabel}>Diikuti</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/account")}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: Colors.primary + "20" }]}>
              <User size={20} color={Colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Akun</Text>
              <Text style={styles.menuSubtitle}>Lihat profil Anda</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/saldo")}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: Colors.success + "20" }]}>
              <Wallet size={20} color={Colors.success} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Saldo</Text>
              <Text style={styles.menuSubtitle}>
                Rp {(user?.balance || 0).toLocaleString("id-ID")}
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/withdraw")}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: Colors.warning + "20" }]}>
              <ArrowUpRight size={20} color={Colors.warning} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Withdraw</Text>
              <Text style={styles.menuSubtitle}>Tarik saldo ke DANA</Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Giveaway Aktif</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Jangan lewatkan kesempatan menang!
          </Text>
        </View>

        {activeGiveaways.map((giveaway) => (
          <GiveawayCard
            key={giveaway.id}
            giveaway={giveaway}
            onPress={() => handleGiveawayPress(giveaway)}
            hasParticipated={hasParticipated(giveaway.id)}
          />
        ))}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  participatedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  participatedText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  cardBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    lineHeight: 24,
  },
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    backgroundColor: Colors.primary + "15",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  participantsText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.background,
  },
});
