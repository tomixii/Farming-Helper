import React, { Component } from 'react'
import { Text, View, StatusBar, TouchableOpacity } from 'react-native'
import PlantCard from './PlantCard'
import plants from './plants.json'
import AsyncStorage from '@react-native-community/async-storage'
import { SearchBar } from 'react-native-elements'
import { createStackNavigator, createAppContainer } from 'react-navigation'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = async () => {
    try {
      await AsyncStorage.getItem('myPlants').then(myPlants => {
        this.setState({
          myPlants
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  renderPlants() {
    console.log(this.state.myPlants)
    if (this.state.myPlants) {
      let plantsInJSX = []
      for (let plant in this.state.myPlants) {
        plantsInJSX.push(<PlantCard key={plant.name} data={plant} />)
      }

      return plantsInJSX
    } else {
      return <Text style={styles.addFirstText}>Add your{'\n'}first plant!</Text>
    }
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your plants</Text>
        <View>{this.renderPlants()}</View>

        <TouchableOpacity onPress={() => navigate('Plants')} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  header: {
    fontSize: 40,
    color: '#000000'
  },
  addFirstText: {
    fontSize: 30
  },
  searchBar: {
    position: 'absolute',
    bottom: 20
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#356035',
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    fontSize: 44,
    color: 'white'
  }
}

export default Dashboard
