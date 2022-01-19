import * as Sentry from 'sentry-expo';
import { Platform } from 'react-native';

const isDev = process.env.NODE_ENV !== 'production';

export const captureMessage = (
  message: string,
  extra?: Record<string, string>
) => {
  const extraData = {
    os: Platform.OS,
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };

  if (isDev) {
    console.log(message, extra);

    return;
  }

  if (Platform.OS === 'web') {
    return Sentry.Browser.captureMessage(message, scope => {
      scope.setExtras({
        ...extraData,
        ...extra,
      });

      return scope;
    });
  }

  return Sentry.Native.captureMessage(message, scope => {
    scope.setExtras({
      ...extraData,
      ...extra,
    });

    return scope;
  });
};

export const captureException = (
  err: unknown,
  extra?: Record<string, string>
) => {
  const extraData = {
    os: Platform.OS,
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };

  if (isDev) {
    console.error(err, extra);

    return;
  }

  if (Platform.OS === 'web') {
    return Sentry.Browser.captureException(err, scope => {
      scope.setExtras({
        ...extraData,
        ...extra,
      });

      return scope;
    });
  }

  return Sentry.Native.captureException(err, scope => {
    scope.setExtras({
      ...extraData,
      ...extra,
    });

    return scope;
  });
};
