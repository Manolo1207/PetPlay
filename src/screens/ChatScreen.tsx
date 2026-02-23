import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button, ScreenContainer } from '../components';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

interface ChatScreenProps {
    chatId: string;
    otherUserName: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ chatId, otherUserName }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Load messages and mark as read
        const load = async () => {
            if (!user) return;
            const chats = await chatService.getUserChats(user.uid);
            const chat = chats.find((c: any) => c.id === chatId);
            setMessages(chat && 'messages' in chat ? (chat.messages as any[]) : []);
            // Marcar como leído
            if (!user) return;
            await chatService.markChatRead(chatId, user.uid);
        };
        load();
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        if (!user) return;
        await chatService.addMessage(chatId, user.uid, input);
        setInput('');
        // Reload messages
        if (!user) return;
        const chats = await chatService.getUserChats(user.uid);
        const chat = chats.find((c: any) => c.id === chatId);
        setMessages(chat && 'messages' in chat ? (chat.messages as any[]) : []);
    };

    const handleDeleteChat = async () => {
        Alert.alert('Eliminar chat', '¿Seguro que quieres eliminar este chat?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar', style: 'destructive', onPress: async () => {
                    await chatService.deleteChat(chatId);
                }
            },
        ]);
    };

    return (
        <ScreenContainer title={`Chat con ${otherUserName}`}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.message}>
                        <Text style={styles.sender}>{user && item.senderId === user.uid ? 'Tú' : otherUserName}</Text>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(_, idx) => idx.toString()}
                style={styles.list}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputRow}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Escribe un mensaje..."
                        style={styles.input}
                    />
                    <Button title="Enviar" onPress={sendMessage} />
                </View>
                <Button title="Eliminar chat" variant="danger" onPress={handleDeleteChat} />
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    list: { flex: 1, marginBottom: 8 },
    message: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    sender: { fontWeight: 'bold', color: '#B71C1C' },
    inputRow: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
});
