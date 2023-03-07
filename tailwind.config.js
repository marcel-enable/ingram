const tiConfig = require('./ti-config.json');

const INSTANCE_NAME = process.env.INSTANCE;
let instanceSettings = {};

function getInstanceSetting(settingName, defaultSetting) {
  if (!Object.keys(instanceSettings).length) {
    const { instances = [] } = tiConfig;
    let instance = instances[0];

    if (INSTANCE_NAME) {
      const possibleMatch = instances.find(
        (instance) => instance.nickname === INSTANCE_NAME
      );
      if (possibleMatch && possibleMatch.apiKey) {
        instance = possibleMatch;
      }
    }

    instanceSettings = instance;
  }

  return instanceSettings[settingName] || defaultSetting;
}

module.exports = {
  content: [
    './atoms/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
      '3xl': '2560px',
    },
    boxShadow: {
      DEFAULT: '0px 0px 5px #4d90fe',
      lg: '0px 0px 12px -2px rgba(0, 0, 0, 0.25)',
      none: 'none',
    },
    fontSize: {
      xs: '0.625rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      colors: {
        primary: getInstanceSetting('primaryColor', '#656565'),
        accent: getInstanceSetting('accentColor', '#2376bc'),
        secondary: getInstanceSetting('secondaryColor', '#000000'),
        tertiary: getInstanceSetting('tertiaryColor', '#efefef'),
        link: getInstanceSetting('linkColor', '#2376bc'),
        'accent-highlight': '#174e7c',
        'accent-highlight-background': '#e4f0fa',
        'accent-tinted': {
          70: '#bdd6eb',
          80: '#d3e4f2',
          90: '#e9f1f8',
        },
        'primary-hover': '#4c4c4c',
        'accent-contrast': '#ffffff',
        'accent-contrast-tinted-background': '#b3b3b3',
        'accent-hover': '#3890da',
        'secondary-hover': '#1a1a1a',
        'secondary-contrast': '#ffffff',
        'secondary-background': '#f6f6f6',
        'secondary-border': 'e9e9e9',
        'link-hover': '#236c96',
      },
      fontFamily: {
        primary: [getInstanceSetting('font', 'Inter'), 'Nunito', 'sans-serif'],
        header: [getInstanceSetting('font', 'Roboto'), 'Nunito', 'sans-serif'],
        secondary: [getInstanceSetting('altFont', 'Roboto'), 'sans-serif'],
        robotocondensed: [getInstanceSetting('font', 'Roboto'), 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
