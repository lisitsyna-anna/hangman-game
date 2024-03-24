import { WORDS, KEYBOARD_LETTERS, WORD_KEY } from './consts';

const gameDiv = document.getElementById('game');
const logoH1 = document.getElementById('logo');

let triesLeft: number;
let winCount: number;

const createPlaceholdersHTML = () => {
  const word = sessionStorage.getItem(WORD_KEY);
  if (!word) {
    console.log('There is no word in the sessionStorage');
    return '';
  }

  const placeholdersHTML = Array.from('_'.repeat(word.length)).reduce(
    (acc, elem, index) => (acc += `<p id="letter_${index}" class="letter">${elem}</p>`),
    ''
  );

  return `<div id="placeholders" class="placeholders-wrapper">${placeholdersHTML}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');
  keyboard.id = 'keyboard';

  const keyboardHTML = KEYBOARD_LETTERS.reduce(
    (acc, letter) =>
      (acc += `<button id="${letter}" class="button-primary keyboard-button">${letter}</button>`),
    ''
  );

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement('img');
  image.src = 'images/hg-0.png';
  image.alt = 'hangman image';
  image.width = 128;
  image.height = 128;
  image.classList.add('hangman-img');
  image.id = 'hangman-img';

  return image;
};

const checkLetter = (letter: string) => {
  const word = sessionStorage.getItem(WORD_KEY)?.toLowerCase();
  const inputLetter = letter.toLowerCase();

  // If the word doesn't have the letter inside
  if (!word?.includes(inputLetter)) {
    const triesCounter = document.getElementById('tries-left') as HTMLElement;
    triesLeft -= 1;
    triesCounter.innerText = triesLeft.toString();

    const hangmanImg = document.getElementById('hangman-img') as HTMLImageElement;
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame('lose');
    }
  } else {
    // If the word has the letter inside
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, index) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame('win');
          return;
        }
        const placeholder = document.getElementById(`letter_${index}`) as HTMLElement;
        placeholder.innerText = inputLetter.toUpperCase();
      }
    });
  }
};

export const stopGame = (status: 'win' | 'lose' | 'quit') => {
  document.getElementById('placeholders')?.remove();
  document.getElementById('tries')?.remove();
  document.getElementById('keyboard')?.remove();
  document.getElementById('quit')?.remove();

  const word = sessionStorage.getItem(WORD_KEY);
  const gameDiv = document.getElementById('game') as HTMLElement;

  if (status === 'win') {
    const hangmanImg = document.getElementById('hangman-img') as HTMLImageElement;
    hangmanImg.src = 'images/hg-win.png';
    gameDiv.innerHTML += `<h2 class="result-header win">You won! :)</h2>`;
  } else if (status === 'lose') {
    gameDiv.innerHTML += `<h2 class="result-header lose">You lost :(</h2>`;
  } else if (status === 'quit') {
    logoH1?.classList.remove('logo-sm');
    document.getElementById('hangman-img')?.remove();
  }

  gameDiv.innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Play Again</button>`;
  document.getElementById('play-again')?.addEventListener('click', startGame);
};

export const startGame = () => {
  if (!gameDiv) {
    return;
  }
  triesLeft = 10;
  winCount = 0;
  logoH1?.classList.add('logo-sm');
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem(WORD_KEY, wordToGuess);
  gameDiv.innerHTML = createPlaceholdersHTML();
  gameDiv.innerHTML += `<p id="tries" class="mt-2">TRIES LEFT <span id="tries-left" class="font-medium text-red-600">10</span></p>`;

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    if (target.tagName.toLowerCase() === 'button') {
      target.disabled = true;
      checkLetter(target.id);
      console.log(target.id);
    }
  });
  gameDiv.appendChild(keyboardDiv);

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  const quitButton = document.createElement('button');
  quitButton.id = 'quit';
  quitButton.textContent = 'Quit';
  quitButton.classList.add('button-secondary', 'px-2', 'py-1', 'mt-4');
  quitButton.onclick = () => {
    const isSure = confirm('Are you sure you want to quit and lose your progress?');
    if (isSure) {
      stopGame('quit');
    }
  };

  gameDiv.insertAdjacentElement('beforeend', quitButton);
};
