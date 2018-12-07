/**
 * Created by bogdanbegovic on 8/20/16.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing, Text, TouchableOpacity } from 'react-native';

import styles from './Calendar.style.js';


export default class CalendarDay extends Component {

    static propTypes = {
        date: PropTypes.object.isRequired,
        onDateSelected: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,

        calendarColor: PropTypes.string,
        highlightColor: PropTypes.string,
        borderHighlightColor: PropTypes.string,

        dateNameStyle: PropTypes.any,
        dateNumberStyle: PropTypes.any,
        weekendDateNameStyle: PropTypes.any,
        weekendDateNumberStyle: PropTypes.any,

        highlightDateNameStyle: PropTypes.any,
        highlightDateNumberStyle: PropTypes.any,

        selection: PropTypes.string,
        selectionAnimation: PropTypes.object
    };

    static defaultProps = {
        selection: 'border',
        selectionAnimation: {
            duration: 0,
            borderWidth: 1
        },
        borderHighlightColor: '#000'
    };

    constructor(props) {
        super(props);
        this.animValue = new Animated.Value(0);
    }

    //When component mounts, if it is seleced run animation for animation show
    componentDidMount() {
        if (this.props.selected) {
            this.animate(1);
        }
    }

    //When component receives the props, if it is selected use showing animation
    //If it is deselected, use hiding animation
    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            nextProps.selected ? this.animate(1) : this.animate(0);
        }
    }

    //Animation function for showin/hiding the element.
    //Based on the value passed (either 1 or 0) the animate function is animatin towards that value, hence showin or hiding animation
    animate(toValue) {
        Animated.timing(
            this.animValue,
            {
                toValue: toValue,
                duration: this.props.selectionAnimation.duration,
                easing: Easing.linear
            }
        ).start();
    }

    render() {
        let animValue;
        let animObject;
        //The user can disable animation, so that is why I use selection type
        //If it is background, the user have to input colors for animation
        //If it is border, the user has to input color for border animation
        if (this.props.selection === 'background') {
            animValue = this.animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.calendarColor, this.props.highlightColor]
            });
            animObject = { backgroundColor: animValue };
        } else {
            if (this.props.selection === 'border') {
                animValue = this.animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, this.props.selectionAnimation.borderWidth]
                });
                animObject = { borderColor: this.props.borderHighlightColor, borderWidth: animValue };
            } else {
                throw new Error('CalendarDay Error! Type of animation is incorrect!');
            }
        }

        const customDateNameStyle = this.props.selected ? this.props.highlightDateNameStyle : this.props.dateNameStyle;
        const customDateNumberStyle = this.props.selected ? this.props.highlightDateNumberStyle : this.props.dateNumberStyle;
        let dateNameStyle = [styles.dateName, customDateNameStyle];
        let dateNumberStyle = [styles.dateNumber, customDateNumberStyle];
        if (this.props.date.isoWeekday() === 6 || this.props.date.isoWeekday() === 7) {
            dateNameStyle = [styles.weekendDateName, customDateNameStyle];
            dateNumberStyle = [styles.weekendDateNumber, customDateNumberStyle];
        }

        return (
            <Animated.View style={[styles.dateContainer, animObject]}>
                <TouchableOpacity onPress={this.props.onDateSelected.bind(this, this.props.date)}>
                    <Text style={dateNameStyle}>{this.props.date.format('ddd').toUpperCase()}</Text>
                    <Text style={dateNumberStyle}>{this.props.date.date()}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}
