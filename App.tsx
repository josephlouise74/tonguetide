// App.tsx
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Slot /> {/* Ensures nested routes are properly rendered */}
    </>
  );
}
