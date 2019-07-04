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
import { ThemeProvider } from 'react-native-elements'

const theme = {
  colors: {
    primary: 'green'
  }
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
