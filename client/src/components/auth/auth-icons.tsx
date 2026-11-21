import { Ionicons } from '@expo/vector-icons';

// Иконки экранов авторизации (в макете: Communication/Mail_Open, Interface/Lock, Edit/Hide, User, Info).
// Сейчас — Ionicons, ближайшие по начертанию. Все иконки собраны здесь,
// чтобы заменить на точные SVG из Figma в одном месте.
type Props = { color: string; size?: number };

export const MailOpenIcon = ({ color, size = 24 }: Props) => (
  <Ionicons name="mail-open-outline" size={size} color={color} />
);
export const LockIcon = ({ color, size = 24 }: Props) => (
  <Ionicons name="lock-closed-outline" size={size} color={color} />
);
export const UserIcon = ({ color, size = 24 }: Props) => (
  <Ionicons name="person-outline" size={size} color={color} />
);
export const EyeIcon = ({ color, size = 24, hidden }: Props & { hidden: boolean }) => (
  <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={size} color={color} />
);
export const InfoIcon = ({ color, size = 20 }: Props) => (
  <Ionicons name="alert-circle-outline" size={size} color={color} />
);
export const BigMailIcon = ({ color, size = 160 }: Props) => (
  <Ionicons name="mail-outline" size={size} color={color} />
);
export const BigCheckIcon = ({ color, size = 160 }: Props) => (
  <Ionicons name="checkmark-circle-outline" size={size} color={color} />
);
