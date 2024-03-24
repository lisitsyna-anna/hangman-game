import '../css/style.css';
import { darkModeHandle } from './utils';
import { startGame } from './game';

darkModeHandle();

const startGameButton = document.getElementById('startGame');

if (startGameButton !== null) {
  startGameButton.addEventListener('click', startGame);
} else {
  console.error('startGameButton not found!');
}
