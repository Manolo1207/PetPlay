import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../components';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components';
import { readFileSync } from 'fs';

const legalText = `# Política de Privacidad de PetPlay
(Borrador Formal)

Última actualización: 23 de febrero de 2026.

## 1. Responsable del Tratamiento
El responsable de recolectar y proteger tus datos es [Nombre de tu Empresa/Proyecto]. Para cualquier duda sobre tus datos, puedes contactarnos en: [Tu Email de Soporte].

## 2. Datos que Recolectamos
Para que PetPlay funcione correctamente, recolectamos:
- **Información de Perfil:** Nombre, correo electrónico y fotos tuyas y de tu mascota.
- **Geolocalización:** Datos de ubicación en segundo plano (para el podómetro/historial de paseos) y ubicación precisa para el sistema de Alertas de Perros Perdidos.
- **Datos de Actividad:** Pasos diarios, rachas de caminata y distancias recorridas.
- **Interacciones:** Historial de chats (encriptados) y "matches" con otros usuarios.

## 3. Uso de la Información (Finalidad)
Tus datos se utilizan exclusivamente para:
- Calcular el ejercicio de tu mascota y mostrarte estadísticas.
- Conectarte con otros dueños de perros cercanos mediante el sistema de Match.
- Emitir notificaciones críticas si un perro se pierde en tu zona.
- **Análisis de Datos:** Utilizamos Google Analytics para entender cómo usas la app y mejorar la experiencia (frecuencia de uso, errores técnicos y flujo de navegación).

## 4. Compartición de Datos con Terceros
PetPlay no vende tus datos personales. Solo compartimos información con:
- **Google Analytics:** Datos anonimizados para estadísticas de marketing.
- **Otros Usuarios:** Tu perfil de perro (nombre, foto, bio y distancia aproximada) es visible para otros usuarios para facilitar el Match.

# Términos y Condiciones (Resumen de Seguridad)

## 1. Responsabilidad Civil
PetPlay es un facilitador. No somos responsables de incidentes, lesiones o daños que ocurran durante los encuentros físicos o paseos entre usuarios y sus mascotas.

## 2. Seguridad en el Chat
El uso de lenguaje abusivo, acoso o contenido inapropiado resultará en la suspensión inmediata de la cuenta.

## 3. Uso del Podómetro
El usuario reconoce que el GPS puede afectar el consumo de batería del dispositivo.`;

const LegalScreen = () => {
    const navigation = useNavigation();
    return (
        <ScreenContainer title="Legal">
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>{legalText}</Text>
                <Button title="Volver" onPress={() => navigation.goBack()} variant="secondary" />
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    text: {
        fontSize: 15,
        color: '#333',
        marginBottom: 24,
    },
});

export default LegalScreen;
