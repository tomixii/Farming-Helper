import React, {Component} from 'react';
import {View, Button, Text, AsyncStorage} from 'react-native';
import {DateTime, Duration} from 'luxon'

export default class Plant extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = async () => {
        try {
            const plantTime = await AsyncStorage.getItem(name).then((res) => console.log(res));
            console.log(plantTime);
            this.setState({
                plantTime
            })
        }catch(error){

        }
    };

    setPlantTime = async (name, time) => {
        try{
            await AsyncStorage.setItem(name, time);
        } catch(error){
            console.log(error)
        }
        this.setState({ plantTime: time });

    };

    parseMillis = (timeInMilliSeconds) => {
        const seconds = timeInMilliSeconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        return {seconds, minutes, hours, days}
    };

    getTimeLeft = () => {
        if(this.state.plantTime) {
            console.log(this.state.plantTime);
            const readyAt = this.state.plantTime.plus({minutes: this.props.data.minutes});
            console.log(readyAt);
            const timeLeft = this.parseMillis(readyAt.diffNow());
            console.log(timeLeft);
            let timeString = '';
            if(timeLeft.days > 1) {
                timeString += Math.round(timeLeft.days) + " days "
            }
            if(timeLeft.hours > 1) {
                timeString += Math.round(timeLeft.hours) % 24 + " hours "
            }
            if(timeLeft.minutes > 1) {
                timeString += Math.round(timeLeft.minutes) % 60 + " minutes "
            }

            return timeString
        } else {
            return "NOT PLANTED"
        }
    };

    render() {
        const {container, plantButton} = styles;
        return(
            <View style={container}>
                <Text>
                    {this.props.data.name} : {this.getTimeLeft()}
                </Text>
                <Button style={plantButton} onPress={() => this.setPlantTime(this.props.data.name, DateTime.local())} title={"plant"} >
                </Button>
            </View>
        )
    }


}

const styles = {
    container: {
        flexDirection: 'row',
        backgroundColor: "#FFFFFF",
        margin: 20,
        borderBottomColor: "#000000",
        borderBottomWidth: 1,
        borderRightColor: "#000000",
        borderRightWidth: 1,

    }
};
