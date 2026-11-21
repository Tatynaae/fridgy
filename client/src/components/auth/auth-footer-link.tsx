import { Link, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export function AuthFooterLink({ text, link, href }: { text: string; link: string; href: Href }) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{text} </Text>
      <Link href={href} replace style={styles.link}>
        {link}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  text: { fontFamily: 'Manrope_400Regular', fontSize: 12, color: '#7C8488' },
  link: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, color: '#168CE1' },
});
