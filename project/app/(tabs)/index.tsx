import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Package, MapPin, Clock } from 'lucide-react-native';
import Header from '@/components/Header';

// Mock data for deliveries
const PENDING_DELIVERIES = [
  {
    id: '1',
    type: 'Package',
    status: 'Ready for pickup',
    location: '123 Main St, Anytown',
    destination: '456 Oak Ave, Somecity',
    time: '10:30 AM',
    courier: {
      id: '101',
      name: 'Alex Johnson',
      rating: 4.8,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: '2',
    type: 'Document',
    status: 'In transit',
    location: '789 Pine Rd, Othertown',
    destination: '101 Maple St, Newcity',
    time: '11:45 AM',
    courier: {
      id: '102',
      name: 'Samantha Lee',
      rating: 4.9,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
];

// Mock data for available jobs
const AVAILABLE_JOBS = [
  {
    id: '1',
    type: 'Express Delivery',
    pickup: '123 Main St, Anytown',
    dropoff: '456 Oak Ave, Somecity',
    distance: '3.2 miles',
    payment: '$15.50',
    time: '10:30 AM',
  },
  {
    id: '2',
    type: 'Standard Delivery',
    pickup: '789 Pine Rd, Othertown',
    dropoff: '101 Maple St, Newcity',
    distance: '1.8 miles',
    payment: '$12.75',
    time: '11:45 AM',
  },
  {
    id: '3',
    type: 'Grocery Delivery',
    pickup: 'SuperMart, Downtown',
    dropoff: '202 Cedar Ln, Suburbtown',
    distance: '4.5 miles',
    payment: '$18.00',
    time: '2:15 PM',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A2463" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title={user?.type === 'user' ? 'Home' : 'Available Jobs'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user?.type === 'user' ? (
          <UserHomeScreen />
        ) : (
          <CourierHomeScreen />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function UserHomeScreen() {
  const [activeTab, setActiveTab] = useState('active');
  
  return (
    <>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hello, <Text style={styles.userName}>John</Text></Text>
        <Text style={styles.welcomeSubtext}>Need something delivered today?</Text>
        
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request Delivery</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.deliveriesContainer}>
        <Text style={styles.sectionTitle}>Your Deliveries</Text>
        
        {PENDING_DELIVERIES.map((delivery) => (
          <View key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <View style={styles.deliveryTypeContainer}>
                <Package size={16} color="#0A2463" />
                <Text style={styles.deliveryType}>{delivery.type}</Text>
              </View>
              <Text style={styles.deliveryStatus}>{delivery.status}</Text>
            </View>
            
            <View style={styles.deliveryDetails}>
              <View style={styles.deliveryDetailRow}>
                <MapPin size={16} color="#666666" />
                <Text style={styles.deliveryDetailText}>{delivery.location}</Text>
              </View>
              <View style={styles.deliveryDetailRow}>
                <MapPin size={16} color="#666666" />
                <Text style={styles.deliveryDetailText}>{delivery.destination}</Text>
              </View>
              <View style={styles.deliveryDetailRow}>
                <Clock size={16} color="#666666" />
                <Text style={styles.deliveryDetailText}>{delivery.time}</Text>
              </View>
            </View>
            
            <View style={styles.courierContainer}>
              <Image
                source={{ uri: delivery.courier.avatar }}
                style={styles.courierAvatar}
              />
              <View style={styles.courierInfo}>
                <Text style={styles.courierName}>{delivery.courier.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{delivery.courier.rating}</Text>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.trackButton}>
                <Text style={styles.trackButtonText}>Track</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

function CourierHomeScreen() {
  return (
    <>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hello, <Text style={styles.userName}>Jane</Text></Text>
        <Text style={styles.welcomeSubtext}>You have 3 new delivery opportunities nearby</Text>
      </View>
      
      <View style={styles.jobsContainer}>
        <Text style={styles.sectionTitle}>Available Jobs</Text>
        
        {AVAILABLE_JOBS.map((job) => (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTypeContainer}>
                <Package size={16} color="#0A2463" />
                <Text style={styles.jobType}>{job.type}</Text>
              </View>
              <Text style={styles.jobPayment}>{job.payment}</Text>
            </View>
            
            <View style={styles.jobDetails}>
              <View style={styles.jobDetailRow}>
                <Text style={styles.jobDetailLabel}>Pickup:</Text>
                <Text style={styles.jobDetailText}>{job.pickup}</Text>
              </View>
              <View style={styles.jobDetailRow}>
                <Text style={styles.jobDetailLabel}>Dropoff:</Text>
                <Text style={styles.jobDetailText}>{job.dropoff}</Text>
              </View>
              <View style={styles.jobStats}>
                <View style={styles.jobStat}>
                  <Clock size={14} color="#666666" />
                  <Text style={styles.jobStatText}>{job.time}</Text>
                </View>
                <View style={styles.jobStat}>
                  <MapPin size={14} color="#666666" />
                  <Text style={styles.jobStatText}>{job.distance}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.jobActions}>
              <TouchableOpacity style={styles.jobActionButton}>
                <Text style={styles.jobActionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.jobActionButton, styles.jobAcceptButton]}>
                <Text style={styles.jobAcceptButtonText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#333333',
  },
  userName: {
    fontFamily: 'Inter-Bold',
    color: '#0A2463',
  },
  welcomeSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: '#3E92CC',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  requestButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#0A2463',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  deliveriesContainer: {
    marginBottom: 24,
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deliveryType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A2463',
    marginLeft: 6,
  },
  deliveryStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3E92CC',
  },
  deliveryDetails: {
    marginBottom: 16,
  },
  deliveryDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  courierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  courierAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  courierInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courierName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginRight: 4,
  },
  ratingStars: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFB400',
  },
  trackButton: {
    backgroundColor: '#0A2463',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  jobsContainer: {
    marginBottom: 24,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  jobType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A2463',
    marginLeft: 6,
  },
  jobPayment: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#D8315B',
  },
  jobDetails: {
    marginBottom: 16,
  },
  jobDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  jobDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    width: 70,
  },
  jobDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  jobStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  jobStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  jobStatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  jobActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  jobActionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0A2463',
    borderRadius: 6,
    marginRight: 8,
  },
  jobActionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A2463',
  },
  jobAcceptButton: {
    backgroundColor: '#0A2463',
    borderColor: '#0A2463',
    marginRight: 0,
    marginLeft: 8,
  },
  jobAcceptButtonText: {
    color: '#FFFFFF',
  },
});