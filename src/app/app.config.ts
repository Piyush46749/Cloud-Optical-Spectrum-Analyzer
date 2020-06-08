let protocol = location.protocol + '//' + location.host;

export var APP_CONFIG = {};

export var URL_CONFIG = {
  BASE_URL: getConfigs()['BASE_URL'],
  START: '/api/start',
  STOP: '/api/stop',
  SINGLE:'/single',
  TRACE:'/api/trace',
  QUERY:'/api/query'
};

export function getConfigs() {
    return {
      BASE_URL: 'http://54.237.44.5:5000',
    };
  }