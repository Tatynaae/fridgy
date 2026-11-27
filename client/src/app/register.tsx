import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";

import { register } from "@/lib/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password) {
      Alert.alert("Заполни поля", "Введи email и пароль.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Слишком короткий пароль", "Пароль должен содержать минимум 8 символов.");
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), password, displayName.trim());
      Alert.alert("Аккаунт создан", "Теперь войди в свой аккаунт.");
      router.replace("/login");
    } catch (error) {
      Alert.alert(
        "Не удалось зарегистрироваться",
        error instanceof Error ? error.message : "Проверь подключение к серверу.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Создать аккаунт</Text>
        <Text style={styles.subtitle}>Присоединяйся к Fridgy</Text>

        <TextInput
          style={styles.input}
          placeholder="Имя (необязательно)"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль (минимум 8 символов)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text>Уже есть аккаунт? </Text>
          <Link href="/login" style={styles.link}>
            Войти
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  content: { width: "100%", maxWidth: 420, alignSelf: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#777", marginBottom: 28 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#1683CF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
 footer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 22,
  marginBottom: 8,
},
  link: { color: "#1683CF", fontWeight: "600" },
});