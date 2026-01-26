import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  X,
  Gift,
  Users,
  Clock,
  CheckCircle2,
  Trophy,
  Calendar,
  Share2,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { giveaways } from "@/mocks/giveaways";
import Colors from "@/constants/colors";

export default function GiveawayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { participate, hasParticipated } = useUser();

  const giveaway = giveaways.find((g) => g.id === id);
  const isParticipated = hasParticipated(id || "");

  if (!giveaway) {
    return (
      <View style={[styles.container, styles.notFoundContainer]}>
        <Text style={styles.notFoundText}>Giveaway tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(giveaway.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleParticipate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    participate(giveaway.id);
    Alert.alert(
      "Berhasil! 🎉",
      "Kamu sudah terdaftar dalam giveaway ini. Semoga beruntung!",
      [{ text: "OK" }]
    );
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Share", "Fitur share akan segera hadir!");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1A1A", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: giveaway.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={["transparent", "rgba(13,13,13,1)"]}
            style={styles.imageOverlay}
          />

          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareButton, { top: insets.top + 12 }]}
            onPress={handleShare}
          >
            <Share2 size={20} color={Colors.text} />
          </TouchableOpacity>

          {isParticipated && (
            <View style={styles.participatedOverlay}>
              <Trophy size={20} color={Colors.primary} />
              <Text style={styles.participatedOverlayText}>Sudah Terdaftar</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{giveaway.title}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: Colors.primary + "20" }]}>
                <Gift size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Hadiah</Text>
                <Text style={styles.infoValue}>{giveaway.prize}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={18} color={Colors.textSecondary} />
              <Text style={styles.statText}>
                {giveaway.participants.toLocaleString()} peserta
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Clock size={18} color={Colors.textSecondary} />
              <Text style={styles.statText}>{daysLeft} hari lagi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Calendar size={18} color={Colors.textSecondary} />
              <Text style={styles.statText}>
                {formatDate(giveaway.endDate)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{giveaway.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Syarat & Ketentuan</Text>
            {giveaway.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.requirementNumber}>
                  <Text style={styles.requirementNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>

          {isParticipated && (
            <View style={styles.participatedCard}>
              <CheckCircle2 size={24} color={Colors.success} />
              <View style={styles.participatedCardContent}>
                <Text style={styles.participatedCardTitle}>
                  Kamu sudah terdaftar!
                </Text>
                <Text style={styles.participatedCardSubtitle}>
                  Pemenang akan diumumkan pada {formatDate(giveaway.endDate)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.footerGradient}
        />
        <TouchableOpacity
          style={[
            styles.participateButton,
            isParticipated && styles.participateButtonDisabled,
          ]}
          onPress={handleParticipate}
          disabled={isParticipated}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isParticipated
                ? [Colors.surfaceLight, Colors.surfaceLight]
                : [Colors.primary, Colors.primaryLight]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.participateButtonGradient}
          >
            {isParticipated ? (
              <>
                <CheckCircle2 size={22} color={Colors.success} />
                <Text style={[styles.participateButtonText, { color: Colors.success }]}>
                  Sudah Berpartisipasi
                </Text>
              </>
            ) : (
              <>
                <Gift size={22} color={Colors.background} />
                <Text style={styles.participateButtonText}>
                  Ikuti Giveaway
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 320,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  closeButton: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  participatedOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  participatedOverlayText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
    lineHeight: 34,
  },
  infoRow: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  requirementNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requirementNumberText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    paddingTop: 3,
  },
  participatedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.success + "15",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Colors.success + "30",
  },
  participatedCardContent: {
    flex: 1,
  },
  participatedCardTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.success,
  },
  participatedCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footerGradient: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    height: 40,
  },
  participateButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  participateButtonDisabled: {
    opacity: 0.9,
  },
  participateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  participateButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.background,
  },
});
