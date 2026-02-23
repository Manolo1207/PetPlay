import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Button, ScreenContainer } from '../components';
import { LanguageContext } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;


const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { language, setLanguage } = useContext(LanguageContext);
  const nav = useNavigation();
  return (
    <ScreenContainer title={language === 'es' ? 'Configuración' : 'Settings'}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'es' ? 'Idioma' : 'Language'}</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Button
              title="Español"
              onPress={() => setLanguage('es')}
              variant={language === 'es' ? 'primary' : 'secondary'}
            />
            <Button
              title="English"
              onPress={() => setLanguage('en')}
              variant={language === 'en' ? 'primary' : 'secondary'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'es' ? 'Notificaciones' : 'Notifications'}</Text>
          <Text style={styles.sectionDesc}>
            {language === 'es'
              ? 'Próximamente podrás configurar qué notificaciones deseas recibir'
              : 'Soon you will be able to configure which notifications you want to receive'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'es' ? 'Legal y privacidad' : 'Legal & Privacy'}</Text>
          <Text style={styles.sectionDesc}>
            {language === 'es'
              ? 'Lee la política de privacidad y los términos de uso.'
              : 'Read the privacy policy and terms of use.'}
          </Text>
          <Button
            title={language === 'es' ? 'Ver textos legales' : 'View Legal Texts'}
            onPress={() => nav.navigate('Legal' as never)}
            variant="secondary"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'es' ? 'Acerca de PetPlay' : 'About PetPlay'}</Text>
          <Text style={styles.sectionDesc}>Versión 1.0.0</Text>
        </View>

        <Button
          title={language === 'es' ? 'Volver' : 'Back'}
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
