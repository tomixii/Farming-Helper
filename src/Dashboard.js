import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import PlantCard from './PlantCard'
import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.navigation = this.props.navigation
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My Plants',
      headerStyle: {
        backgroundColor: '#356035'
      },
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('navigatePlants')}>
          <Text
            style={{
              color: '#fff',
              fontSize: 40,
              marginRight: 20,
              marginBottom: 5
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }

  componentDidMount = async () => {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
    this.props.navigation.setParams({
      navigatePlants: this.navigatePlants
    })
  }

  load = async () => {
    try {
      await AsyncStorage.getItem('myPlants').then(myPlants => {
        if (myPlants) {
          this.setState({
            myPlants: JSON.parse(myPlants)
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  navigatePlants = () => {
    this.props.navigation.navigate('Plants')
  }

  renderPlants() {
    if (!_.isEmpty(this.state.myPlants)) {
      let plantsInJSX = []
      for (let key in this.state.myPlants) {
        if (this.state.myPlants.hasOwnProperty(key)) {
          const plant = this.state.myPlants[key]
          plantsInJSX.push(<PlantCard key={plant.name} data={plant} />)
        }
      }

      return plantsInJSX
    } else {
      return <Text style={styles.addFirstText}>Add your{'\n'}first plant!</Text>
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.renderPlants()}
        </ScrollView>
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
  scrollContainer: {
    paddingBottom: 15
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
