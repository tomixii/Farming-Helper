import React, { Component } from 'react'
import { View, Text, Button, Dimensions } from 'react-native'
import { DateTime, Duration } from 'luxon'
import { Card } from 'react-native-elements'
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
    this.updateInterval = setInterval(() => {
      if (this.state.plantTime) {
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
  componentWillUnmount = async () => {
    await AsyncStorage.removeItem(this.props.data.name)
    clearInterval(this.updateInterval)
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
    let timeString = ''
    if (this.state.timeLeft) {
      const timeLeft = this.state.timeLeft
      if (timeLeft.seconds) {
        if (timeLeft.seconds > 0) {
          if (timeLeft.days > 1) {
            timeString += Math.floor(timeLeft.days) + ' d '
          }
          if (timeLeft.hours > 1) {
            timeString += (Math.floor(timeLeft.hours) % 24) + ' h '
          }
          if (timeLeft.minutes > 1) {
            timeString += (Math.floor(timeLeft.minutes) % 60) + ' min '
          }
          timeString += (Math.floor(timeLeft.seconds) % 60) + 's'
        } else {
          timeString += 'READY!'
        }
      } else {
        timeString += 'NOT PLANTED'
      }
    } else {
      timeString += 'NOT PLANTED'
    }
    return timeString
  }

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render() {
    const { container, plantButton, nameText, timeText } = styles
    return (
      <Card containerStyle={{ width: Dimensions.get('window').width - 30 }}>
        <View style={container}>
          <View>
            <Text style={nameText}>
              {this.capitalize(this.props.data.name)}
            </Text>
            <Text style={timeText}>{this.getTimeLeft()}</Text>
          </View>
          <Button
            style={plantButton}
            color="#356035"
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
    justifyContent: 'space-between'
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  timeText: {},
  plantButton: {}
}
