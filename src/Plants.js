import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import plants from './plants.json'
import { Searchbar } from 'react-native-paper'
import { CheckBox } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

class Plants extends Component {
  constructor(props) {
    super(props)
    this.state = { query: '', myPlants: {} }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Searchbar
          placeholder="Search"
          onChangeText={query => navigation.setParams({ query })}
        />
      ),
      headerStyle: {
        backgroundColor: '#356035'
      },
      headerTintColor: '#fff'
    }
  }

  componentDidMount = async () => {
    try {
      let myPlants = await AsyncStorage.getItem('myPlants')
      if (myPlants === null) {
        myPlants = '{}'
      }
      this.setState({
        myPlants: JSON.parse(myPlants)
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
    const myUpdatedPlants = this.state.myPlants
    if (name in myUpdatedPlants) {
      delete myUpdatedPlants[name]
    } else {
      myUpdatedPlants[name] = plants[name]
    }
    this.setState({
      myPlants: myUpdatedPlants
    })
    console.log(this.state.myPlants)
  }

  saveAndBack = async () => {
    try {
      await AsyncStorage.setItem(
        'myPlants',
        JSON.stringify(this.state.myPlants)
      ).then(() => this.props.navigation.goBack())
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.plantsList()}
          renderItem={({ item }) => (
            <View style={styles.plantContainer}>
              <Text style={styles.plantName}>{item.name}</Text>
              <CheckBox
                onPress={() => {
                  this.togglePlant(item.name)
                }}
                checked={item.name in this.state.myPlants}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button title={'SAVE PLANTS'} onPress={() => this.saveAndBack()} />
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
