import { THEME_MODE_KEY } from './consts';

export const darkModeHandle = () => {
  const htmlElement = document.documentElement;
  const darkModeSwitcher = document.getElementById('toggleDarkMode') as HTMLInputElement | null;

  if (!darkModeSwitcher) {
    return;
  }

  if (localStorage.getItem(THEME_MODE_KEY) === 'dark') {
    htmlElement.classList.add('dark');
    darkModeSwitcher.checked = true;
  }

  darkModeSwitcher.addEventListener('input', () => {
    htmlElement.classList.toggle('dark');

    if (htmlElement.classList.contains('dark')) {
      localStorage.setItem(THEME_MODE_KEY, 'dark');
    } else {
      localStorage.setItem(THEME_MODE_KEY, 'light');
    }
  });
};
