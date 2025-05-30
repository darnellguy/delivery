import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Settings, LogOut, ChevronRight, Bell, Shield, CreditCard, Star, HelpCircle, MapPin } from 'lucide-react-native';
import Header from '@/components/Header';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to log out');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header 
        title="Profile" 
        rightComponent={
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#0A2463" />
          </TouchableOpacity>
        }
        showNotifications={false}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'John Doe'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>{user?.type === 'courier' ? 'Courier' : 'User'}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        {user?.type === 'courier' && (
          <View style={styles.courierStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>152</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$1,420</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <Bell size={20} color="#0A2463" style={styles.settingIcon} />
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#3E92CC' }}
              thumbColor={'#FFFFFF'}
              style={styles.settingSwitch}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <MapPin size={20} color="#0A2463" style={styles.settingIcon} />
            <Text style={styles.settingText}>Saved Locations</Text>
            <ChevronRight size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color="#0A2463" style={styles.settingIcon} />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <ChevronRight size={20} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <CreditCard size={20} color="#0A2463" style={styles.settingIcon} />
            <Text style={styles.settingText}>Payment Methods</Text>
            <ChevronRight size={20} color="#666666" />
          </TouchableOpacity>
          
          {user?.type === 'user' && (
            <TouchableOpacity style={styles.settingItem}>
              <Star size={20} color="#0A2463" style={styles.settingIcon} />
              <Text style={styles.settingText}>My Reviews</Text>
              <ChevronRight size={20} color="#666666" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <HelpCircle size={20} color="#0A2463" style={styles.settingIcon} />
            <Text style={styles.settingText}>Help Center</Text>
            <ChevronRight size={20} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <LogOut size={20} color="#D8315B" style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: '#D8315B' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: user => user?.type === 'courier' ? '#D8315B' : '#3E92CC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  editProfileButton: {
    backgroundColor: '#0A2463',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  editProfileButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  courierStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0A2463',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  settingSwitch: {
    marginLeft: 8,
  },
});