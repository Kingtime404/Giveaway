import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Instagram,
  Youtube,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";

interface SocialRequirement {
  id: string;
  platform: string;
  account: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  checked: boolean;
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isRegistering } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [socialRequirements, setSocialRequirements] = useState<SocialRequirement[]>([
    {
      id: "ig1",
      platform: "Instagram",
      account: "@giveaway_official",
      url: "https://instagram.com/giveaway_official",
      icon: <Instagram size={24} color={Colors.instagram} />,
      color: Colors.instagram,
      checked: false,
    },
    {
      id: "yt",
      platform: "YouTube",
      account: "Giveaway Channel",
      url: "https://youtube.com/@giveawaychannel",
      icon: <Youtube size={24} color={Colors.youtube} />,
      color: Colors.youtube,
      checked: false,
    },
    {
      id: "ig2",
      platform: "Instagram",
      account: "@promo_exclusive",
      url: "https://instagram.com/promo_exclusive",
      icon: <Instagram size={24} color={Colors.instagram} />,
      color: Colors.instagram,
      checked: false,
    },
  ]);

  const allChecked = socialRequirements.every((req) => req.checked);

  const toggleRequirement = (id: string) => {
    setSocialRequirements((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, checked: !req.checked } : req
      )
    );
  };

  const openSocialLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("Cannot open URL:", error);
    }
  };

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Mohon masukkan nama lengkap");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Mohon masukkan email yang valid");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Error", "Mohon masukkan nomor telepon yang valid");
      return;
    }
    if (!allChecked) {
      Alert.alert("Error", "Mohon follow semua akun sosial media untuk melanjutkan");
      return;
    }

    register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      followedInstagram: socialRequirements[0].checked,
      followedYoutube: socialRequirements[1].checked,
      followedInstagram2: socialRequirements[2].checked,
    });

    router.replace("/home");
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
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Member</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Phone size={20} color={Colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nomor Telepon"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
            Syarat Menjadi Member
          </Text>
          <Text style={styles.sectionSubtitle}>
            Follow semua akun berikut untuk melanjutkan
          </Text>

          {socialRequirements.map((req) => (
            <View key={req.id} style={styles.requirementCard}>
              <TouchableOpacity
                style={styles.requirementLeft}
                onPress={() => toggleRequirement(req.id)}
                activeOpacity={0.7}
              >
                {req.checked ? (
                  <CheckCircle2 size={28} color={Colors.success} />
                ) : (
                  <Circle size={28} color={Colors.textMuted} />
                )}
              </TouchableOpacity>

              <View style={styles.requirementContent}>
                <View style={styles.platformRow}>
                  {req.icon}
                  <Text style={styles.platformName}>{req.platform}</Text>
                </View>
                <Text style={styles.accountName}>{req.account}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followButton, { backgroundColor: req.color }]}
                onPress={() => openSocialLink(req.url)}
                activeOpacity={0.8}
              >
                <Text style={styles.followButtonText}>Follow</Text>
                <ExternalLink size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                allChecked ? styles.statusComplete : styles.statusIncomplete,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  allChecked
                    ? styles.statusTextComplete
                    : styles.statusTextIncomplete,
                ]}
              >
                {allChecked
                  ? "✓ Semua syarat terpenuhi"
                  : `${socialRequirements.filter((r) => r.checked).length}/${socialRequirements.length} syarat terpenuhi`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              (!allChecked || isRegistering) && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!allChecked || isRegistering}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                allChecked
                  ? [Colors.primary, Colors.primaryLight]
                  : [Colors.surfaceLight, Colors.surfaceLight]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.registerButtonGradient}
            >
              <Text
                style={[
                  styles.registerButtonText,
                  !allChecked && styles.registerButtonTextDisabled,
                ]}
              >
                {isRegistering ? "Mendaftar..." : "Daftar Sekarang"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: "center",
    justifyContent: "space-between",
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
  headerSpacer: {
    width: 44,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: Colors.text,
  },
  requirementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementLeft: {
    marginRight: 14,
  },
  requirementContent: {
    flex: 1,
  },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  accountName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusComplete: {
    backgroundColor: "rgba(74, 222, 128, 0.15)",
  },
  statusIncomplete: {
    backgroundColor: Colors.surface,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  statusTextComplete: {
    color: Colors.success,
  },
  statusTextIncomplete: {
    color: Colors.textSecondary,
  },
  registerButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.background,
  },
  registerButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
