import React, { Component } from 'react'
import { Text, View } from 'react-native'
import plants from './plants.json'
import { Searchbar } from 'react-native-paper'
import { CheckBox } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

class Plants extends Component {
  constructor(props) {
    super(props)
    this.state = { query: '', plantsChosen: {} }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Searchbar
          placeholder="Search"
          onChangeText={query => navigation.setParams({ query })}
        />
      )
    }
  }

  componentDidMount = async () => {
    try {
      await AsyncStorage.getItem('myPlants').then(myPlants => {
        let plantsChosen = {}
        for (let plant in plants) {
          plantsChosen[plant] = myPlants ? plant in myPlants : false
        }
        this.setState({
          plantsChosen
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  plantsList = () => {
    let plantsJSX = []
    const query = this.props.navigation.getParam('query')
    for (let key in plants) {
      if (
        plants.hasOwnProperty(key) &&
        (plants[key].name.includes(query) || !query)
      ) {
        plantsJSX.push(plants[key])
      }
    }
    return plantsJSX
  }

  togglePlant = name => {
    const prevChosen = this.state.plantsChosen
    const newChosen = {
      ...prevChosen,
      [name]: !prevChosen[name]
    }
    this.setState({
      plantsChosen: newChosen
    })
  }

  render() {
    return (
      <FlatList
        data={this.plantsList()}
        renderItem={({ item }) => (
          <View style={styles.plantContainer}>
            <Text style={styles.plantName}>{item.name}</Text>
            <CheckBox
              onPress={() => {
                this.togglePlant(item.name)
              }}
              checked={this.state.plantsChosen[item.name]}
            />
          </View>
        )}
      />
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
  plantContainer: {
    flexDirection: 'row'
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
  plantName: {
    fontSize: 20,
    fontWeight: 'bold'
  }
}

export default Plants
