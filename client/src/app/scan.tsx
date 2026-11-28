import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  Pressable,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from '@expo-google-fonts/manrope';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

// Reads an option of a config plugin from app.json, e.g. the expo-camera permission text
function getPluginOption(plugin: string, option: string): string | undefined {
  const entry = Constants.expoConfig?.plugins?.find(
    (item) => Array.isArray(item) && item[0] === plugin
  );
  return Array.isArray(entry) ? entry[1]?.[option] : undefined;
}

type ScanPhase = 'idle' | 'camera' | 'capturing' | 'success';

const CAMERA_PERMISSION_TEXT =
  getPluginOption('expo-camera', 'cameraPermission') ?? 'Камера нужна, чтобы сканировать продукты';

export default function ScanScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const scanDisabled = phase === 'capturing' || (phase === 'camera' && !cameraReady);

  const openCamera = () => {
    setCameraReady(false);
    setPhase('camera');
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
        setPhase('idle');
      }
    } catch {
      Alert.alert('Не удалось открыть галерею', 'Попробуйте ещё раз');
    }
  };

  const takeScan = async () => {
    if (!cameraRef.current || !cameraReady) {
      return;
    }

    setPhase('capturing');
    try {
      // The photo isn't sent anywhere yet, recognition will be added later
      await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhase('success');
    } catch {
      setPhase('camera');
      Alert.alert('Не удалось сделать снимок', 'Попробуйте ещё раз');
    }
  };

  const handleScan = async () => {
    if (phase === 'camera') {
      await takeScan();
      return;
    }

    // The simulator has no camera, expo-camera returns a generated photo there instead
    if (cameraPermission?.granted || !Device.isDevice) {
      openCamera();
      return;
    }

    let granted = false;
    let canAskAgain = true;
    try {
      // The system dialog shows the cameraPermission text from the expo-camera plugin
      ({ granted, canAskAgain } = await requestCameraPermission());
    } catch (error) {
      Alert.alert('Не удалось открыть камеру', error instanceof Error ? error.message : undefined);
      return;
    }

    if (granted) {
      openCamera();
      return;
    }

    Alert.alert(
      'Нет доступа к камере',
      CAMERA_PERMISSION_TEXT,
      canAskAgain
        ? [{ text: 'OK' }]
        : [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Открыть настройки', onPress: () => Linking.openSettings() },
          ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.screen }]}>
      <StatusBar
        hidden={false}
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} source={require('@/assets/img/logo.png')} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Фонарик"
            style={({ pressed }) => [
              styles.flashlight,
              { backgroundColor: theme.iconButton, borderColor: theme.iconButtonBorder },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="flashlight-outline" size={21} color={theme.icon} />
          </Pressable>
        </View>

        <View style={[styles.hint, { backgroundColor: theme.accentSurface }]}>
          <View style={styles.hintLabelRow}>
            <Ionicons name="sparkles-outline" size={16} color={theme.accent} />
            <Text style={[styles.hintLabel, { color: theme.accent }]}>AI-подсказка</Text>
          </View>
          <Text style={[styles.hintText, { color: theme.textPrimary }]}>
            Сфотографируй полки целиком — так Fridgy точнее распознает продукты
          </Text>
        </View>

        <ImageBackground
          style={styles.viewfinder}
          source={
            selectedImageUri
              ? { uri: selectedImageUri }
              : require('@/assets/img/camera-bg.jpg')
          }
          resizeMode="cover"
        >
          {(phase === 'camera' || phase === 'capturing') && (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="back"
              onCameraReady={() => setCameraReady(true)}
            />
          )}
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(11, 37, 53, 0)', 'rgba(11, 37, 53, 0)', 'rgba(11, 37, 53, 0.65)']}
            locations={[0, 0.6, 1]}
          />
          {phase === 'success' ? (
            <View style={styles.success}>
              <View style={[styles.successIcon, { backgroundColor: theme.accent }]}>
                <Ionicons name="checkmark" size={34} color="#FFFFFF" />
              </View>
              <Text style={styles.successText}>Продукты отсканированы</Text>
            </View>
          ) : (
            <View style={styles.instruction}>
              <Text style={styles.instructionText}>Поместите продукты в кадр</Text>
            </View>
          )}
        </ImageBackground>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={handleScan}
            disabled={scanDisabled}
            style={({ pressed }) => [
              styles.action,
              { backgroundColor: theme.accent },
              (pressed || scanDisabled) && styles.pressed,
            ]}
          >
            {phase === 'capturing' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons
                name={phase === 'camera' ? 'camera-outline' : 'scan-outline'}
                size={21}
                color="#FFFFFF"
              />
            )}
            <Text style={styles.scanLabel}>
              {phase === 'camera' || phase === 'capturing'
                ? 'Сделать снимок'
                : phase === 'success'
                  ? 'Сканировать снова'
                  : 'Сканировать продукты'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={pickImage}
            style={({ pressed }) => [
              styles.action,
              styles.upload,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              pressed && styles.pressed,
            ]}
          >
            <Image
              style={styles.thumbnail}
              source={
                selectedImageUri
                  ? { uri: selectedImageUri }
                  : require('@/assets/img/camera-bg.jpg')
              }
            />
            <Text style={[styles.uploadLabel, { color: theme.textPrimary }]}>
              Загрузить из галереи
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    // Keeps the actions above the floating tab bar (66 tall, 12 from the bottom)
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  logo: {
    width: 65,
    height: 52,
  },
  flashlight: {
    width: 38,
    height: 38,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 36,
    padding: 18,
    gap: 9,
    borderRadius: 22,
  },
  hintLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  hintText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 21,
  },
  viewfinder: {
    marginTop: 23,
    flex: 1,
    minHeight: 180,
    maxHeight: 330,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  instruction: {
    marginBottom: 20,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 100,
    backgroundColor: 'rgba(18, 42, 60, 0.6)',
  },
  success: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(11, 37, 53, 0.55)',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  instructionText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  actions: {
    marginTop: 27,
    gap: 12,
  },
  action: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  upload: {
    borderWidth: 1,
    gap: 11,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  scanLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  uploadLabel: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});