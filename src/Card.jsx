/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import PropTypes from 'prop-types';

import Animal from './Animal';
import './Card.css';

export default function Card({
  animal, uncovered, onSelectProperty, selectedProperty,
}) {
  Card.propTypes = {
    uncovered: PropTypes.bool.isRequired,
    animal: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
    onSelectProperty: PropTypes.func,
    selectedProperty: PropTypes.string,
  };

  const front = (
    <div className="card">
      <h1>{animal.name ? animal.name : 'Unbekannt'}</h1>
      {animal.image && (<img alt={animal.name} src={`${process.env.PUBLIC_URL}/cards/${animal.image}`} height="200" width="200" />)}
      <table>
        <tbody>
          {Object.keys(Animal.properties).map((property) => {
            const animalProperty = Animal.properties[property]; // save value of property
            return (
              <tr
                key={property}
                className={selectedProperty === property ? 'active' : ''}
                onClick={() => onSelectProperty(property)}
              >
                <td>{animalProperty.label}</td>
                <td>
                  {animal[property]}&nbsp;
                  {animalProperty.unit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  const back = (
    <div className="card back">
      <img alt="" src={`${process.env.PUBLIC_URL}/cards/cardback.jpg`} height="100%" width="100%" />
    </div>
  );
  if (uncovered) return front;
  return back;
}
