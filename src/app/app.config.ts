export var URL_CONFIG = {
  BASE_URL: getBaseUrlConfig()['BASE_URL'],
  START: '/api/start',
  STOP: '/api/stop',
  SINGLE:'/single',
  TRACE:'/api/trace',
  QUERY:'/api/query'
};

export function getBaseUrlConfig() {
    return {
      BASE_URL: 'http://54.237.44.5:5000',
    };
  }