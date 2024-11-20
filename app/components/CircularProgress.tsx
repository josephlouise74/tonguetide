import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    progress: number;  // Value between 0 and 1
    size: number;
    strokeWidth: number;
    color: string;
    children?: React.ReactNode;
    style?: ViewStyle;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    progress,
    size,
    strokeWidth,
    color,
    children,
    style
}) => {
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E5E5EA"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
