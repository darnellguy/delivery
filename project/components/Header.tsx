import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Bell } from 'lucide-react-native';

type HeaderProps = {
  title: string;
  showNotifications?: boolean;
  rightComponent?: React.ReactNode;
};

export default function Header({ title, showNotifications = true, rightComponent }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {user?.type === 'courier' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Courier</Text>
            </View>
          )}
        </View>
        <View style={styles.rightContainer}>
          {showNotifications && (
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#0A2463" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          )}
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        paddingTop: 0,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0A2463',
  },
  badge: {
    backgroundColor: '#D8315B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8315B',
  },
});