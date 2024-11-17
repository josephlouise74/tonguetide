// src/components/Input.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input: React.FC<TextInputProps> = (props) => (
    <TextInput style={styles.input} {...props} />
);

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderColor: '#d1d1d1',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        marginVertical: 10,
        fontSize: 16,
    },
});

export default Input;
