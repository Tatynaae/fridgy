import { Ionicons } from '@expo/vector-icons';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image style={styles.logo} source={require('@/assets/img/logo.png')} />
          <Text style={styles.title}>{title}</Text>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.banner}>
      <Ionicons name="alert-circle-outline" size={22} color="#D94C4C" />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  faded,
  loading,
}: {
  label: string;
  onPress: () => void;
  faded?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (faded || loading) && styles.buttonFaded, pressed && { opacity: 0.8 }]}
    >
      <Text style={styles.buttonText}>{loading ? 'Подождите…' : label}</Text>
    </Pressable>
  );
}

export const authColors = { bg: '#F6FAFC', primary: '#1479C9', link: '#168CE1', text: '#192C38', muted: '#546871' };

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: authColors.bg },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  logo: { width: 65, height: 52 },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 28,
    color: authColors.text,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFE9EC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  bannerText: { flex: 1, fontFamily: 'Manrope_500Medium', fontSize: 13, color: '#D94C4C' },
  button: {
    height: 50,
    borderRadius: 16,
    backgroundColor: authColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFaded: { opacity: 0.5 },
  buttonText: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, color: '#FFFFFF' },
});