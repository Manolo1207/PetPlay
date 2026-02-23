import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../components';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

export const ChatsScreen: React.FC = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const userChats = await chatService.getUserChats(user.uid);
            setChats(userChats);
        };
        load();
    }, []);

    return (
        <ScreenContainer title="Chats">
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => {/* Navegar a ChatScreen con item.id y nombre */ }}
                        accessibilityLabel={`Chat con ${item.users.find((u: string) => u !== user.uid)}`}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.chatTitle}>Chat con {item.users.find((u: string) => u !== user.uid)}</Text>
                            {item.unreadCount && item.unreadCount[user.uid] > 0 && (
                                <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount[user.uid]}</Text></View>
                            )}
                        </View>
                        <Text style={styles.lastMsg}>{item.messages.length > 0 ? item.messages[item.messages.length - 1].text : 'Sin mensajes'}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                style={styles.list}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    list: { flex: 1 },
    chatItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    chatTitle: { fontWeight: 'bold', color: '#B71C1C', fontSize: 16 },
    lastMsg: { color: '#666', fontSize: 14 },
    badge: { backgroundColor: '#C62828', borderRadius: 12, paddingHorizontal: 8, marginLeft: 8 },
    badgeText: { color: '#FFF', fontWeight: 'bold' },
});
