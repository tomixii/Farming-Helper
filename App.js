/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import Dashboard from './src/Dashboard'
import Plants from './src/Plants'

import { ThemeProvider } from 'react-native-elements'
import { createStackNavigator, createAppContainer } from 'react-navigation'

const theme = {
  colors: {
    primary: '#356035'
  }
}

const MainNavigator = createStackNavigator({
  Home: { screen: Dashboard },
  Plants: { screen: Plants }
})
const App = createAppContainer(MainNavigator)

export default App
/*
export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
      <View style={styles.container}>
      <Dashboard />
      </View>
      </ThemeProvider>
      )
    }
  }
  */

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
