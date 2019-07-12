import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import plants from './plants.json'
import { FlatList } from 'react-native-gesture-handler'
import { SearchBar } from 'react-native-elements'

import AsyncStorage from '@react-native-community/async-storage'
import _ from 'lodash'

class Plants extends Component {
  constructor(props) {
    super(props)
    this.state = { query: '', myPlants: {}, hiddenCategories: [] }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'All Plants',
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('saveAndBack')}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold',
              marginRight: 15
            }}
          >
            SAVE
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#356035'
      },
      headerTintColor: '#fff'
    }
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({
      saveAndBack: this.saveAndBack
    })
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
    let query = this.props.navigation.getParam('query')
    for (let categoryKey in plants) {
      const category = plants[categoryKey]
      for (let key in category) {
        if (
          category.hasOwnProperty(key) &&
          (!query ||
            category[key].name.toLowerCase().includes(query.toLowerCase()))
        ) {
          plantsJSX.push(category[key])
        }
      }
    }
    return plantsJSX
  }

  toggleCategory = category => {
    const isActive = this.state.hiddenCategories.includes(category)
    this.setState(prevState => {
      let newHiddens = prevState.hiddenCategories
      isActive ? _.pull(newHiddens, category) : newHiddens.push(category)

      return {
        ...prevState,
        hiddenCategories: newHiddens
      }
    })
  }

  togglePlant = plant => {
    const myUpdatedPlants = this.state.myPlants
    if (plant.name in myUpdatedPlants) {
      delete myUpdatedPlants[plant.name]
    } else {
      myUpdatedPlants[plant.name] = plant
    }
    this.setState({
      myPlants: myUpdatedPlants
    })
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

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  renderPlants = category => {
    const plantsJSX = []
    let query = this.state.query
    for (let key in category) {
      const plant = category[key]
      if (
        category.hasOwnProperty(key) &&
        (!query || plant.name.toLowerCase().includes(query.toLowerCase()))
      ) {
        const active = plant.name in this.state.myPlants
        plantsJSX.push(
          <TouchableOpacity
            style={[
              active ? styles.activePlant : styles.inactivePlant,
              styles.plantCard
            ]}
            key={plant.name}
            onPress={() => this.togglePlant(plant)}
          >
            <Text
              style={[{ color: active ? '#fff' : '#356035' }, styles.plantName]}
            >
              {this.capitalize(plant.name)}
            </Text>
          </TouchableOpacity>
        )
      }
    }
    return plantsJSX
  }

  renderPlantCategory = category => {
    const type = category.item[0]
    const plants = category.item[1]
    const isHidden = this.state.hiddenCategories.includes(type)
    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => this.toggleCategory(type)}>
          <Text style={styles.categoryHeader}>{this.capitalize(type)}</Text>
        </TouchableOpacity>
        {!isHidden && (
          <View style={styles.plantContainer}>{this.renderPlants(plants)}</View>
        )}
      </View>
    )
  }

  render() {
    return (
      <View>
        <SearchBar
          onChangeText={query => this.setState({ query })}
          placeholder="Search"
          containerStyle={{
            backgroundColor: '#fff',
            borderBottomColor: '#d9d9d9'
          }}
          inputContainerStyle={{ backgroundColor: '#fff' }}
          value={this.state.query}
        />
        <FlatList
          data={Object.entries(plants)}
          renderItem={category => this.renderPlantCategory(category)}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 100 }}
        />
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
    alignSelf: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold'
  },
  categoryContainer: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    elevation: 2
  },
  categoryHeader: {
    fontSize: 30,
    color: '#000'
  },
  plantContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  plantCard: {
    width: '45%',
    margin: 5,
    alignItems: 'center',
    borderWidth: 2
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10
  },
  activePlant: {
    color: '#fff',
    backgroundColor: '#356035',
    borderColor: '#356035'
  },
  inactivePlant: {
    color: '#356035',
    backgroundColor: '#fff',
    borderColor: '#d9d9d9'
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  }
}

export default Plants
