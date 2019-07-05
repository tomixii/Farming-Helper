import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { DateTime, Duration } from 'luxon'
import { Card, Button } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

export default class Plant extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount = async () => {
    try {
      await AsyncStorage.getItem(this.props.data.name).then(plantTime => {
        this.setState({
          plantTime: DateTime.fromISO(plantTime)
        })
      })
    } catch (error) {
      console.log(error)
    }
    setInterval(() => {
      if (this.state.plantTime) {
        console.log(this.state.plantTime)
        this.setState({
          timeLeft: this.parseMillis(
            this.state.plantTime
              .plus({ minutes: this.props.data.minutes })
              .diffNow()
          )
        })
      }
    }, 1000)
  }

  setPlantTime = async (name, time) => {
    try {
      await AsyncStorage.setItem(name, time)
    } catch (error) {
      console.log(error)
    }
    this.setState({ plantTime: time })
  }

  parseMillis = timeInMilliSeconds => {
    const seconds = timeInMilliSeconds / 1000
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24
    return { seconds, minutes, hours, days }
  }

  getTimeLeft = () => {
    if (this.state.timeLeft) {
      const timeLeft = this.state.timeLeft
      let timeString = ''
      if (timeLeft.days > 1) {
        timeString += Math.floor(timeLeft.days) + ' d '
      }
      if (timeLeft.hours > 1) {
        timeString += (Math.floor(timeLeft.hours) % 24) + ' h '
      }
      if (timeLeft.minutes > 1) {
        timeString += (Math.floor(timeLeft.minutes) % 60) + ' min '
      }
      if (timeLeft.seconds > 1) {
        timeString += (Math.floor(timeLeft.seconds) % 60) + 's'
      }

      return timeString
    } else {
      return 'NOT PLANTED'
    }
  }

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render() {
    const { container, plantButton, nameText, timeText } = styles
    return (
      <Card>
        <View style={container}>
          <View>
            <Text style={nameText}>
              {this.capitalize(this.props.data.name)}
            </Text>
            <Text style={timeText}>{this.getTimeLeft()}</Text>
          </View>
          <Button
            buttonStyle={plantButton}
            color="#00FF00"
            onPress={() =>
              this.setPlantTime(this.props.data.name, DateTime.local())
            }
            title={'PLANT'}
          />
        </View>
      </Card>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  timeText: {},
  plantButton: {}
}
