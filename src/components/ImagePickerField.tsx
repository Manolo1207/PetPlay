import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    imageUri: string | null;
    onChange: (uri: string | null) => void;
    label?: string;
}

export const ImagePickerField: React.FC<Props> = ({ imageUri, onChange, label }) => {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage} accessibilityLabel={label || 'Seleccionar imagen'}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Text style={styles.placeholder}>Agregar foto</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    imagePicker: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#B71C1C',
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholder: {
        color: '#B71C1C',
        fontWeight: 'bold',
    },
});
