/* eslint-disable */
import * as React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import './Game.css';
import Animal from './Animal';
import Card from './Card';

// eslint-disable-next-line react/prefer-stateless-function
export default class Game extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    title: 'Supertrumpf',
  };

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    title: PropTypes.string,
  };
  deck = [
    new Animal('Wolf', 'wolf.png', 0.8, 35, 12, 6, 60),
    new Animal(' Siberian Husky', 'husky.png', 0.5, 23, 15, 6, 48),
    new Animal('Elefant', 'elefant.png', 3.3, 6000, 70, 1, 40),
    new Animal('Krokodil', 'crocodile.png', 5.2, 1000, 70, 60, 29),
  ]

  deck = this.shuffle(this.deck);
  // eslint-disable-next-line react/state-in-constructor
  state = {
    computerUncovered: false,
    selectedProperty: '',
    playersTurn: true,
    player: update(this.deck, { $splice: [[0, (this.deck.length/2)]] }),
    computer: update(this.deck, { $splice: [[(this.deck.length/2), this.deck.length-1]] }),
  };

  getSelectPropertyHandler() {
    // eslint-disable-next-line max-len,react/no-access-state-in-setstate,no-unused-vars
    return (property) => this.play(property);
  }

  compare(property){
    let playersTurn = this.state.playersTurn;                                 //true
    const firstPlayer = this.state.player[0];                                 //take first card from players stack
    let player = update(this.state.player, { $splice: [[0, 1]] });      //copy and save the stack and remove fist card from players stack
    const firstCom = this.state.computer[0];                                  //computer take first card of stack
    let computer = update(this.state.computer, { $splice: [[0, 1]] });  //copy and save computers stack and remove first card
    if (firstPlayer[property] > firstCom[property]) {
      playersTurn = true;
      player = update(player, { $push: [firstPlayer, firstCom] });
      if (computer.length === 0) {                                            //player wins if computer stack is empty
        alert('Du hast gewonnen!');
        return;
      }
    } else if (firstPlayer[property] < firstCom[property]) {
      playersTurn = false;
      computer = update(computer, { $push: [firstPlayer, firstCom] })
      if (player.length === 0) {
        alert('Die KI gewinnt!');
        return;
      }
    } else {
      player = update(player, { $push: [firstPlayer] });
      computer = update(computer, { $push: [firstCom] });
    }
    this.setState(
      state =>
        update(state, {
        $set: {
          computerUncovered: false,
          selectedProperty: '',
          playersTurn,
          player,
          computer,
        },
        }),
      () => {
        if(!playersTurn) {
          setTimeout(() => {
            const property = this.selectRandomProperty();
            this.play(property);
          }, 2000);
        }
      },
    );
  }

  play(property){
    this.setState(
      () =>
        update(this.state, {
          selectedProperty: { $set: property },
          computerUncovered: { $set: true },
        }),
      () => {
        setTimeout(() => {
          this.compare(property);
        }, 2000);
      },
    );
  }

  selectRandomProperty() {
    const properties = Object.keys(Animal.properties);                // Get all Animal properties as Array
    const index = Math.floor(Math.random() * properties.length);   // generate random number in lenght of property array
    return properties[index];                                         // return the random selected property
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  render() {
    const {
      playersTurn, player, computer, selectedProperty, computerUncovered,
    } = this.state;
    return (
      <div>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        <h1>{this.props.title}</h1>
        <div className="info">
          {playersTurn ? 'Du bist' : 'Der Computer ist'} an der Reihe
        </div>
        <div className="cards">
          <Card
            animal={player[0]}
            uncovered={true}
            selectedProperty={selectedProperty}
            onSelectProperty={this.getSelectPropertyHandler()}
          />
          <Card
            animal={computer[0]}
            uncovered={computerUncovered}
            selectedProperty={selectedProperty}
          />
        </div>
        <div className="cards">
          <div>{player.length}</div>
          <div>{computer.length}</div>
        </div>
      </div>
    );
  }
}
