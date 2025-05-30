import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Package, MapPin, Clock, User, ChevronRight } from 'lucide-react-native';
import Header from '@/components/Header';

// Mock data for delivery orders
const ORDERS = [
  {
    id: '1',
    type: 'Package Delivery',
    status: 'In Progress',
    date: 'Today, 10:30 AM',
    location: '123 Main St, Anytown',
    destination: '456 Oak Ave, Somecity',
    price: '$15.50',
    courier: {
      id: '101',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    customer: {
      id: '201',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  },
  {
    id: '2',
    type: 'Document Delivery',
    status: 'Completed',
    date: 'Yesterday, 3:45 PM',
    location: '789 Pine Rd, Othertown',
    destination: '101 Maple St, Newcity',
    price: '$12.75',
    courier: {
      id: '102',
      name: 'Samantha Lee',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    customer: {
      id: '202',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  },
  {
    id: '3',
    type: 'Grocery Delivery',
    status: 'Canceled',
    date: 'Sep 15, 2:15 PM',
    location: 'SuperMart, Downtown',
    destination: '202 Cedar Ln, Suburbtown',
    price: '$18.00',
    courier: {
      id: '103',
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    customer: {
      id: '203',
      name: 'Robert Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
  },
  {
    id: '4',
    type: 'Food Delivery',
    status: 'Completed',
    date: 'Sep 14, 7:30 PM',
    location: 'Tasty Restaurant, Uptown',
    destination: '303 Birch St, Oldtown',
    price: '$14.25',
    courier: {
      id: '104',
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    customer: {
      id: '204',
      name: 'Emily Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
  },
];

export default function OrdersScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredOrders = activeTab === 'all' 
    ? ORDERS 
    : ORDERS.filter(order => 
        activeTab === 'active' 
          ? order.status === 'In Progress' 
          : activeTab === 'completed'
            ? order.status === 'Completed'
            : order.status === 'Canceled'
      );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Orders" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'canceled' && styles.activeTab]}
          onPress={() => setActiveTab('canceled')}
        >
          <Text style={[styles.tabText, activeTab === 'canceled' && styles.activeTabText]}>Canceled</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <OrderCard 
            order={item} 
            userType={user?.type || 'user'} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function OrderCard({ order, userType }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return '#3E92CC';
      case 'Completed':
        return '#4CAF50';
      case 'Canceled':
        return '#F44336';
      default:
        return '#666666';
    }
  };
  
  const statusColor = getStatusColor(order.status);
  const personInfo = userType === 'user' ? order.courier : order.customer;
  
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.orderTypeContainer}>
          <Package size={16} color="#0A2463" />
          <Text style={styles.orderType}>{order.type}</Text>
        </View>
        <Text style={[styles.orderStatus, { color: statusColor }]}>{order.status}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderDetailRow}>
          <Clock size={16} color="#666666" />
          <Text style={styles.orderDetailText}>{order.date}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.orderDetailText}>{order.location}</Text>
        </View>
        <View style={styles.orderDetailRow}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.orderDetailText}>{order.destination}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.personContainer}>
        <Image
          source={{ uri: personInfo.avatar }}
          style={styles.avatar}
        />
        <View style={styles.personInfo}>
          <Text style={styles.personLabel}>
            {userType === 'user' ? 'Courier' : 'Customer'}
          </Text>
          <Text style={styles.personName}>{personInfo.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.price}>{order.price}</Text>
        </View>
        <ChevronRight size={20} color="#666666" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
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
  listContainer: {
    padding: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  orderType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0A2463',
    marginLeft: 6,
  },
  orderStatus: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  orderDetails: {
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  personInfo: {
    marginLeft: 12,
    flex: 1,
  },
  personLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  personName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#D8315B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666666',
  },
});