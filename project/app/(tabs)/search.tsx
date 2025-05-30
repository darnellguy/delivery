import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Search, MapPin, Star, ArrowRight, Filter } from 'lucide-react-native';
import Header from '@/components/Header';

// Only import MapView on native platforms
let MapView: any;
let Marker: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

// Mock data for couriers
const COURIERS = [
  {
    id: '1',
    name: 'Alex Johnson',
    rating: 4.8,
    distance: '0.8 miles away',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: {
      latitude: 37.7858,
      longitude: -122.4064,
    },
    available: true,
    specialties: ['Express', 'Fragile Items'],
  },
  {
    id: '2',
    name: 'Samantha Lee',
    rating: 4.9,
    distance: '1.2 miles away',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: {
      latitude: 37.7875,
      longitude: -122.4008,
    },
    available: true,
    specialties: ['Groceries', 'Heavy Items'],
  },
  {
    id: '3',
    name: 'Michael Brown',
    rating: 4.7,
    distance: '1.5 miles away',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    location: {
      latitude: 37.7820,
      longitude: -122.4030,
    },
    available: true,
    specialties: ['Documents', 'Same-day'],
  },
  {
    id: '4',
    name: 'Emily Davis',
    rating: 4.6,
    distance: '2.1 miles away',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    location: {
      latitude: 37.7890,
      longitude: -122.4090,
    },
    available: false,
    specialties: ['Food Delivery', 'Groceries'],
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
    location: {
      latitude: 37.7858,
      longitude: -122.4064,
    },
  },
  {
    id: '2',
    type: 'Standard Delivery',
    pickup: '789 Pine Rd, Othertown',
    dropoff: '101 Maple St, Newcity',
    distance: '1.8 miles',
    payment: '$12.75',
    time: '11:45 AM',
    location: {
      latitude: 37.7875,
      longitude: -122.4008,
    },
  },
  {
    id: '3',
    type: 'Grocery Delivery',
    pickup: 'SuperMart, Downtown',
    dropoff: '202 Cedar Ln, Suburbtown',
    distance: '4.5 miles',
    payment: '$18.00',
    time: '2:15 PM',
    location: {
      latitude: 37.7820,
      longitude: -122.4030,
    },
  },
];

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const data = user?.type === 'user' ? COURIERS : AVAILABLE_JOBS;
  const region = {
    latitude: 37.7858,
    longitude: -122.4064,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  };

  // Only show map toggle on native platforms
  const showMapToggle = Platform.OS !== 'web';
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header 
        title={user?.type === 'user' ? 'Find Courier' : 'Find Jobs'} 
        rightComponent={
          showMapToggle ? (
            <TouchableOpacity style={styles.mapToggle} onPress={() => setShowMap(!showMap)}>
              <Text style={styles.mapToggleText}>{showMap ? 'List View' : 'Map View'}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={user?.type === 'user' ? "Search for courier" : "Search for jobs"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#0A2463" />
        </TouchableOpacity>
      </View>
      
      {showMap && Platform.OS !== 'web' ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
          >
            {data.map((item) => (
              <Marker
                key={item.id}
                coordinate={item.location}
                title={user?.type === 'user' ? item.name : item.type}
                description={user?.type === 'user' ? item.distance : item.payment}
                pinColor={selectedItem === item.id ? '#D8315B' : '#0A2463'}
                onPress={() => setSelectedItem(item.id)}
              />
            ))}
          </MapView>
          
          {selectedItem && (
            <View style={styles.mapItemDetail}>
              {user?.type === 'user' ? (
                <CourierCard 
                  courier={COURIERS.find(c => c.id === selectedItem)!} 
                  compact={true} 
                />
              ) : (
                <JobCard 
                  job={AVAILABLE_JOBS.find(j => j.id === selectedItem)!} 
                  compact={true} 
                />
              )}
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) =>
            user?.type === 'user' ? (
              <CourierCard courier={item as typeof COURIERS[0]} />
            ) : (
              <JobCard job={item as typeof AVAILABLE_JOBS[0]} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

function CourierCard({ courier, compact = false }) {
  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]}
      activeOpacity={0.7}
    >
      <Image source={{ uri: courier.avatar }} style={styles.avatar} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{courier.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB400" fill="#FFB400" />
            <Text style={styles.rating}>{courier.rating}</Text>
          </View>
        </View>
        
        {!compact && (
          <View style={styles.specialtiesContainer}>
            {courier.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#666666" />
            <Text style={styles.distance}>{courier.distance}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusIndicator, 
                courier.available ? styles.statusAvailable : styles.statusUnavailable
              ]} 
            />
            <Text style={styles.statusText}>
              {courier.available ? 'Available' : 'Busy'}
            </Text>
          </View>
        </View>
      </View>
      
      {!compact && (
        <TouchableOpacity style={styles.arrowButton}>
          <ArrowRight size={20} color="#0A2463" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function JobCard({ job, compact = false }) {
  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]}
      activeOpacity={0.7}
    >
      <View style={styles.jobIconContainer}>
        <MapPin size={24} color="#FFFFFF" />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.jobType}>{job.type}</Text>
          <Text style={styles.payment}>{job.payment}</Text>
        </View>
        
        {!compact && (
          <>
            <View style={styles.jobDetailRow}>
              <Text style={styles.jobDetailLabel}>Pickup:</Text>
              <Text style={styles.jobDetailText}>{job.pickup}</Text>
            </View>
            <View style={styles.jobDetailRow}>
              <Text style={styles.jobDetailLabel}>Dropoff:</Text>
              <Text style={styles.jobDetailText}>{job.dropoff}</Text>
            </View>
          </>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.jobTime}>{job.time}</Text>
          <Text style={styles.jobDistance}>{job.distance}</Text>
        </View>
      </View>
      
      {!compact && (
        <TouchableOpacity style={styles.arrowButton}>
          <ArrowRight size={20} color="#0A2463" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F4FF',
    borderRadius: 6,
  },
  mapToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A2463',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
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
  compactCard: {
    padding: 12,
    marginBottom: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  jobIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3E92CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  specialtyBadge: {
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#0A2463',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusAvailable: {
    backgroundColor: '#4CAF50',
  },
  statusUnavailable: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
  },
  arrowButton: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  jobType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  payment: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#D8315B',
  },
  jobDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  jobDetailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
    width: 60,
  },
  jobDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  jobTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  jobDistance: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapItemDetail: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});