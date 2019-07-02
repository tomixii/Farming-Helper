import React, {Component} from 'react';
import {Text, View} from 'react-native';
import PlantCard from './PlantCard'
import plants from './plants.json'


class Dashboard extends Component {
    constructor(props) {
        super(props)


    }

    renderPlants() {
        let plantsInJSX = [];
        for(let key in plants) {
            if (plants.hasOwnProperty(key)) {
                plantsInJSX.push(<PlantCard key={key} data={plants[key]}/>);
            }
        }

        return plantsInJSX;
    }

    render() {
        return(
            <View style={styles.container} >
                {this.renderPlants()}
            </View>
        )
    }

}

const styles = {
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        flex: 1,
    }
};

export default Dashboard;