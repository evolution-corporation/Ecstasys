import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface BaseMeditationViewProperty {}

const BaseMeditationView: React.FC<BaseMeditationViewProperty> = property => (
	<View style={styles.container}>
		<Text style={{ fontSize: 30 }}> BaseMeditationView </Text>
	</View>
);

BaseMeditationView.defaultProps = {}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

export default BaseMeditationView
