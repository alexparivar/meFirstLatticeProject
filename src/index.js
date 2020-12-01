import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'world'], ' ');
  element.classList.add('hello');

  return element;
}

function testComponent(elementType, elementId) {
  const element = document.createElement(elementType);
  element.id = elementId;
  return element;
}

document.body.appendChild(component());
document.body.appendChild(testComponent("canvas","c"));
document.body.appendChild(testComponent("canvas","lattice"));