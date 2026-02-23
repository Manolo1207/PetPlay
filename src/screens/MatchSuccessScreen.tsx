import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, ScreenContainer } from '../components';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

// Recibe el id del perro con el que hiciste match
export type MatchSuccessScreenParams = {
    dogId: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MatchSuccess'>;

const MatchSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
    const { user } = useAuth();
    const [creatingChat, setCreatingChat] = React.useState(false);
    const { dogId } = route.params;

    const handleViewProfile = () => {
        navigation.replace('DogProfile', { dogId });
    };

    const handleStartChat = async () => {
        setCreatingChat(true);
        // Obtener IDs de usuarios y perros
        // Aquí deberías obtener el userId del dueño del dogId actual
        // Suponiendo que tienes acceso a dog.ownerId y user.uid
        // Puedes ajustar según tu lógica
        const dog = { id: dogId, ownerId: 'otherUserId' }; // Reemplaza con lógica real
        if (!user) return;
        const chatId = await chatService.createChat(user.uid, dog.ownerId, '', dog.id);
        setCreatingChat(false);
        navigation.replace('DogProfile', { dogId: dog.id });
    };

    const handleBackToFeed = () => {
        navigation.popToTop(); // Vuelve al feed
    };

    return (
        <ScreenContainer title="¡Match logrado!">
            <View style={styles.container}>
                <Text style={styles.emoji}>🐾</Text>
                <Text style={styles.title}>¡Parece que podrían llevarse bien! 🐾</Text>
                <View style={styles.buttons}>
                    <Button title="Ver perfil" onPress={handleViewProfile} />
                    <View style={{ height: 12 }} />
                    <Button title="Volver al feed" onPress={handleBackToFeed} variant="secondary" />
                    <View style={{ height: 12 }} />
                    <Button title={creatingChat ? 'Creando chat...' : 'Chatear'} onPress={handleStartChat} disabled={creatingChat} variant="primary" />
                </View>
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
        marginBottom: 32,
    },
    buttons: {
        width: '100%',
        alignItems: 'center',
    },
});

export default MatchSuccessScreen;
