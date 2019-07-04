import React, { Component } from 'react'
import { Text, View, StatusBar } from 'react-native'
import PlantCard from './PlantCard'
import plants from './plants.json'

class Dashboard extends Component {
  constructor(props) {
    super(props)
  }

  renderPlants() {
    let plantsInJSX = []
    for (let key in plants) {
      if (plants.hasOwnProperty(key)) {
        plantsInJSX.push(<PlantCard key={key} data={plants[key]} />)
      }
    }

    return plantsInJSX
  }

  render() {
    return (
      <View style={styles.container}>
        <View>{this.renderPlants()}</View>
      </View>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    flex: 1
  }
}

export default Dashboard
