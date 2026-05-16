import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { type } from '../theme/typography';

export function Screen({ children, glow = 'lavender' }: { children: React.ReactNode; glow?: 'lavender' | 'acid' | 'coral' | 'success' }) {
  const glowColor = {
    lavender: 'rgba(197,180,255,0.18)',
    acid: 'rgba(255,217,61,0.18)',
    coral: 'rgba(255,107,107,0.18)',
    success: 'rgba(184,255,77,0.16)'
  }[glow];
  return (
    <View style={styles.screen}>
      <LinearGradient colors={[glowColor, 'transparent', colors.bg]} style={styles.glow} />
      {children}
    </View>
  );
}

export function Header({ title, sub, onBack, right }: { title?: string; sub?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInUp.duration(360)} style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.circle}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
      ) : <View style={styles.circleGhost} />}
      <View style={styles.headerText}>
        {sub ? <Text style={styles.overline}>{sub}</Text> : null}
        {title ? <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text> : null}
      </View>
      {right ?? <View style={styles.circleGhost} />}
    </Animated.View>
  );
}

export function Brand({ business }: { business?: boolean }) {
  return (
    <View style={styles.brand}>
      <Text style={styles.brandText}>party<Text style={{ color: colors.acid }}>pay</Text><Text style={{ color: colors.coral }}>.</Text></Text>
      {business ? <Text style={styles.business}>BUSINESS</Text> : null}
    </View>
  );
}

export function Button({ label, onPress, variant = 'acid', icon, style }: { label: string; onPress: () => void; variant?: 'acid' | 'ghost' | 'lavender' | 'coral' | 'dark'; icon?: keyof typeof Ionicons.glyphMap; style?: ViewStyle }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const bg = variant === 'acid' ? colors.acid : variant === 'lavender' ? colors.lavender : variant === 'coral' ? colors.coral : variant === 'dark' ? colors.bg : 'rgba(255,255,255,0.06)';
  const fg = variant === 'ghost' || variant === 'dark' ? colors.text : colors.bg;
  return (
    <Animated.View style={[animated, style]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={[styles.button, { backgroundColor: bg, borderColor: variant === 'ghost' ? colors.line : 'transparent' }]}
      >
        {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
        <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function Card({ children, style, delay = 0 }: { children: React.ReactNode; style?: ViewStyle; delay?: number }) {
  return <Animated.View entering={FadeInDown.delay(delay).duration(420)} style={[styles.card, style]}>{children}</Animated.View>;
}

export function Pill({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && { color: colors.bg }]}>{label}</Text>
    </View>
  );
}

export function StatusTag({ label, tone = 'acid' }: { label: string; tone?: 'acid' | 'success' | 'coral' | 'lavender' | 'ghost' | 'error' }) {
  const bg = tone === 'success' ? colors.success : tone === 'coral' ? colors.coral : tone === 'lavender' ? colors.lavender : tone === 'error' ? colors.error : tone === 'ghost' ? 'rgba(255,255,255,0.07)' : colors.acid;
  const fg = tone === 'ghost' ? colors.dim : colors.bg;
  return <Text style={[styles.tag, { backgroundColor: bg, color: fg }]}>{label}</Text>;
}

export function PosterImage({ source, tint, label, height = 172 }: { source: number; tint: string; label?: string; height?: number }) {
  return (
    <ImageBackground source={source} imageStyle={{ borderRadius: 24 }} style={[styles.poster, { height, backgroundColor: tint }]}>
      <LinearGradient colors={['rgba(11,11,13,0.02)', 'rgba(11,11,13,0.72)']} style={StyleSheet.absoluteFill} />
      {label ? <Text style={styles.posterLabel}>{label}</Text> : null}
    </ImageBackground>
  );
}

export function MascotCup({ size = 96, color = colors.lavender }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size * 1.1, alignItems: 'center' }}>
      <View style={[styles.cupLid, { width: size * 0.68, backgroundColor: colors.bg }]} />
      <View style={[styles.cup, { width: size * 0.62, height: size * 0.72, backgroundColor: color }]}>
        <View style={styles.faceRow}><View style={styles.eye} /><View style={styles.eye} /></View>
        <View style={styles.smile} />
      </View>
      <View style={styles.legs}><View style={styles.leg} /><View style={[styles.leg, { transform: [{ rotate: '-12deg' }] }]} /></View>
    </View>
  );
}

export function FakeQr({ size = 184, dark = colors.bg }: { size?: number; dark?: string }) {
  const cells = Array.from({ length: 21 * 21 }, (_, index) => {
    const x = index % 21;
    const y = Math.floor(index / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    return finder || ((x * 13 + y * 7 + index) % 5 < 2);
  });
  const cell = size / 21;
  return (
    <View style={[styles.qr, { width: size, height: size }]}>
      {cells.map((on, index) => (
        <View key={index} style={{ width: cell, height: cell, padding: 1 }}>
          {on ? <View style={{ flex: 1, backgroundColor: dark, borderRadius: 1 }} /> : null}
        </View>
      ))}
      <View style={styles.qrLogo}><Text style={styles.qrLogoText}>PP</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 360 },
  header: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  circleGhost: { width: 42, height: 42 },
  headerText: { flex: 1, alignItems: 'center' },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  overline: { ...type.label, color: colors.mute, textTransform: 'uppercase', fontFamily: 'monospace' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { color: colors.text, fontSize: 22, fontWeight: '900', letterSpacing: -0.4 },
  business: { color: colors.bg, backgroundColor: colors.acid, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  button: { minHeight: 58, borderRadius: 999, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, borderWidth: 1, paddingHorizontal: 18 },
  buttonText: { fontSize: 17, fontWeight: '900', letterSpacing: -0.2 },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: colors.line },
  pill: { height: 36, borderRadius: 999, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,0.04)' },
  pillActive: { backgroundColor: colors.acid, borderColor: colors.acid },
  pillText: { color: colors.dim, fontSize: 13, fontWeight: '800' },
  tag: { overflow: 'hidden', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, fontSize: 10, fontFamily: 'monospace', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  poster: { borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end', padding: 14 },
  posterLabel: { color: colors.text, fontSize: 11, fontFamily: 'monospace', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(11,11,13,0.72)' },
  cupLid: { height: 12, borderRadius: 999, marginTop: 8 },
  cup: { borderRadius: 22, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth: 3, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  faceRow: { flexDirection: 'row', gap: 16 },
  eye: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.bg },
  smile: { width: 25, height: 13, borderBottomWidth: 3, borderColor: colors.bg, borderRadius: 999, marginTop: 6 },
  legs: { flexDirection: 'row', gap: 20, marginTop: -1 },
  leg: { width: 3, height: 16, borderRadius: 2, backgroundColor: colors.bg, transform: [{ rotate: '12deg' }] },
  qr: { backgroundColor: colors.text, borderRadius: 18, padding: 10, flexDirection: 'row', flexWrap: 'wrap' },
  qrLogo: { position: 'absolute', left: '50%', top: '50%', width: 38, height: 38, marginLeft: -19, marginTop: -19, borderRadius: 10, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  qrLogoText: { color: colors.bg, fontWeight: '900', fontFamily: 'monospace' }
});
