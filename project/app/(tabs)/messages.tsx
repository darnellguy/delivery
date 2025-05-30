import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Search } from 'lucide-react-native';
import Header from '@/components/Header';

// Mock data for chat conversations
const CONVERSATIONS = [
  {
    id: '1',
    person: {
      id: '101',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isOnline: true,
    },
    lastMessage: {
      text: 'I have arrived at the pickup location',
      timestamp: '10:30 AM',
      unread: true,
    },
  },
  {
    id: '2',
    person: {
      id: '102',
      name: 'Samantha Lee',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isOnline: false,
    },
    lastMessage: {
      text: 'Your package has been delivered',
      timestamp: 'Yesterday',
      unread: false,
    },
  },
  {
    id: '3',
    person: {
      id: '103',
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      isOnline: true,
    },
    lastMessage: {
      text: 'Can you provide more details about the delivery?',
      timestamp: 'Yesterday',
      unread: false,
    },
  },
  {
    id: '4',
    person: {
      id: '104',
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      isOnline: false,
    },
    lastMessage: {
      text: 'Thanks for using our service!',
      timestamp: 'Sep 15',
      unread: false,
    },
  },
];

// Mock data for messages in a conversation
const MESSAGES = [
  {
    id: '1',
    text: 'Hello! I am on my way to pick up your package',
    timestamp: '10:15 AM',
    sender: 'them',
  },
  {
    id: '2',
    text: 'Great! How long will it take?',
    timestamp: '10:17 AM',
    sender: 'me',
  },
  {
    id: '3',
    text: 'About 10 minutes, I\'m just a few blocks away',
    timestamp: '10:18 AM',
    sender: 'them',
  },
  {
    id: '4',
    text: 'Perfect, I\'ll be waiting outside',
    timestamp: '10:20 AM',
    sender: 'me',
  },
  {
    id: '5',
    text: 'I have arrived at the pickup location',
    timestamp: '10:30 AM',
    sender: 'them',
  },
];

export default function MessagesScreen() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // In a real app, this would send the message to the server
    setNewMessage('');
  };
  
  const handleBackToConversations = () => {
    setActiveConversation(null);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {activeConversation ? (
        <ChatView 
          conversation={activeConversation} 
          onBack={handleBackToConversations}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <ConversationsView 
          conversations={CONVERSATIONS}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectConversation={handleSelectConversation}
        />
      )}
    </SafeAreaView>
  );
}

function ConversationsView({ conversations, searchQuery, setSearchQuery, onSelectConversation }) {
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  return (
    <>
      <Header title="Messages" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.conversationItem}
            onPress={() => onSelectConversation(item)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.person.avatar }} style={styles.avatar} />
              {item.person.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.personName}>{item.person.name}</Text>
                <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
              </View>
              
              <View style={styles.conversationFooter}>
                <Text 
                  style={[
                    styles.lastMessage,
                    item.lastMessage.unread && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage.text}
                </Text>
                
                {item.lastMessage.unread && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>1</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />
    </>
  );
}

function ChatView({ conversation, onBack, newMessage, setNewMessage, onSendMessage }) {
  return (
    <>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.chatHeaderInfo}>
          <Image source={{ uri: conversation.person.avatar }} style={styles.chatAvatar} />
          <View>
            <Text style={styles.chatName}>{conversation.person.name}</Text>
            <Text style={styles.chatStatus}>
              {conversation.person.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted={false}
        renderItem={({ item }) => (
          <View 
            style={[
              styles.messageItem,
              item.sender === 'me' ? styles.myMessage : styles.theirMessage
            ]}
          >
            <View 
              style={[
                styles.messageBubble,
                item.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
                ]}
              >
                {item.text}
              </Text>
            </View>
            <Text style={styles.messageTime}>{item.timestamp}</Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled
          ]}
          onPress={onSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send size={20} color={newMessage.trim() ? '#FFFFFF' : '#A0A0A0'} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
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
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  personName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: '#333333',
  },
  unreadBadge: {
    backgroundColor: '#D8315B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
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
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3E92CC',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  chatStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageItem: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: '#0A2463',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  theirMessageText: {
    color: '#333333',
    fontFamily: 'Inter-Regular',
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A2463',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});