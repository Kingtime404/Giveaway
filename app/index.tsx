import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Gift, Sparkles, ChevronRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@/contexts/UserContext";
import Colors from "@/constants/colors";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useUser();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, user, router]);

  const handleGetStarted = () => {
    router.push("/register");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Gift size={48} color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1A1A", "#0D0D0D", "#0D0D0D"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.iconGradient}
          >
            <Gift size={56} color={Colors.background} />
          </LinearGradient>
          <View style={styles.sparkleContainer}>
            <Sparkles size={24} color={Colors.primary} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Giveaway Hub{"\n"}by KingTime</Text>
        <Text style={styles.subtitle}>
          Ikuti giveaway eksklusif dan menangkan{"\n"}hadiah menarik setiap hari!
        </Text>

        <View style={styles.featureList}>
          {["iPhone & MacBook", "Cash Prizes", "Gaming Gear"].map(
            (feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            )
          )}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Mulai Sekarang</Text>
              <ChevronRight size={24} color={Colors.background} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Gratis untuk bergabung • Tanpa biaya tersembunyi
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  decorCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  decorCircle2: {
    position: "absolute",
    bottom: 100,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primary,
    opacity: 0.03,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sparkleContainer: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 42,
    fontWeight: "800" as const,
    color: Colors.text,
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    marginTop: 16,
  },
  featureList: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500" as const,
  },
  bottomSection: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.background,
  },
  disclaimer: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 16,
  },
});
