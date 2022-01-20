import { extendTheme } from 'native-base';
import { DefaultTheme } from '@react-navigation/native';

export const PRIMARY_COLOR = '#524df3';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#e7e6ff',
      100: '#b8b7fe',
      200: '#8b88f8',
      300: '#5c58f4',
      400: '#2f28f0',
      500: '#150ec6',
      600: '#100ba7',
      700: '#090878',
      800: '#04044b',
      900: '#01011e',
    },
  },
  components: {
    Text: {
      baseStyle: {
        fontSize: 'md',
      },
    },
    View: {
      baseStyle: {
        backgroundColor: '#fff',
        flex: 1,
        px: 4,
        py: 6,
      },
    },
    Checkbox: {
      baseStyle: {
        _text: {
          fontSize: 'md',
        },
      },
    },
    Button: {
      baseStyle: {
        paddingTop: 3,
        paddingBottom: 3,
        _text: {
          fontWeight: 'bold',
        },
      },
      defaultProps: {
        size: 'lg',
      },
    },
    Input: {
      defaultProps: {
        size: 'xl',
      },
    },
    TextArea: {
      defaultProps: {
        size: 'xl',
      },
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'light',
  },
});

export const navbarTheme = {
  ...DefaultTheme,
  primary: PRIMARY_COLOR,
};
