
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const VetMapScreen: React.FC = () => {
    return (
        <View style={styles.center}>
            <Text style={styles.comingSoon}>Próximamente: Mapa de veterinarias</Text>
            <Text style={styles.info}>Esta función estará disponible en una próxima actualización.</Text>
        </View>
    );
};

export default VetMapScreen;

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    comingSoon: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#FF6B6B' },
    info: { fontSize: 14, color: '#666', textAlign: 'center', maxWidth: 300 },
});
