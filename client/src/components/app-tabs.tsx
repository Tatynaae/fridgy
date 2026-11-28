import { Ionicons } from "@expo/vector-icons";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { MaxContentWidth } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemedText } from "./themed-text";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function AppTabs() {
  const pathname = usePathname();

  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />

      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton
              icon="home-outline"
              activeIcon="home"
              forceFocused={pathname === "/scan"}
            >
              Главная
            </TabButton>
          </TabTrigger>

          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="heart-outline" activeIcon="heart">
              Сохранённое
            </TabButton>
          </TabTrigger>

          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon="person-outline" activeIcon="person">
              Профиль
            </TabButton>
          </TabTrigger>

          {/* Scan opens from the home screen, so it has no button of its own */}
          <TabTrigger name="scan" href="/scan" style={styles.hidden} />

          {/* Auth screens: routes must be declared as triggers, the tab bar is hidden on them */}
          <TabTrigger name="login" href="/login" style={styles.hidden} />
          <TabTrigger name="register" href="/register" style={styles.hidden} />
          <TabTrigger
            name="forgot-password"
            href="/forgot-password"
            style={styles.hidden}
          />
          <TabTrigger
            name="reset-password"
            href="/reset-password"
            style={styles.hidden}
          />
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type ButtonProps = Omit<TabTriggerSlotProps, "ref"> &
  Pick<React.ComponentProps<typeof Pressable>, "ref"> & {
  children: string;
  icon: IconName;
  activeIcon: IconName;
  forceFocused?: boolean;
};

function TabButton({
  children,
  isFocused,
  icon,
  activeIcon,
  forceFocused,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const focused = isFocused || forceFocused;
  const color = focused ? theme.tabActive : theme.tabInactive;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
    >
      <Ionicons
        name={focused ? activeIcon : icon}
        size={25}
        color={color}
      />

      <ThemedText
        style={[styles.tabLabel, focused && styles.tabLabelActive, { color }]}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isAuthScreen = AUTH_PATHS.includes(pathname);

  return (
    <View
      {...props}
      style={[styles.positioner, isAuthScreen && styles.hidden]}
    >
      <View style={[styles.tabBar, { backgroundColor: theme.tabBar }]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  positioner: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12,
  },

  tabBar: {
    width: "100%",
    maxWidth: MaxContentWidth,
    minHeight: 66,
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 3,
  },

  tabLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },

  tabLabelActive: {
    fontFamily: "Manrope_600SemiBold",
  },

  hidden: {
    display: "none",
  },

  pressed: {
    opacity: 0.7,
  },
});
