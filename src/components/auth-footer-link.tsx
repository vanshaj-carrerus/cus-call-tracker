import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthColors } from '@/constants/auth-theme';

type AuthFooterLinkProps = {
  message: string;
  linkText: string;
  href: '/login' | '/signup';
};

export function AuthFooterLink({ message, linkText, href }: AuthFooterLinkProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{message} </Text>
      <Link href={href} asChild>
        <Pressable>
          <Text style={styles.link}>{linkText}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: AuthColors.textSecondary,
    lineHeight: 22,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: AuthColors.link,
    lineHeight: 22,
  },
});
