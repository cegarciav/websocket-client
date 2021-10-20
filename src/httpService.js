import axios from 'axios';

const apiOrigin = process.env.REACT_APP_ADDRESSES_NAMES_API;

const apiRequester = axios.create({
  baseURL: apiOrigin,
});

const errorGenerator = (e) => {
  let errorResponse = null;
  if (e.response) {
    errorResponse = {
      errors: e.response.data.errors,
      type: 'response',
      statusCode: e.response.status,
    };
  } else {
    errorResponse = {
      type: 'unexpected',
      message: 'Algo salió mal. Por favor, revisa tu conexión o intenta ingresar más tarde',
    };
  }
  return errorResponse;
};

async function apiGet(path, params) {
  try {
    if (!apiOrigin) throw Error('Los nombres de origen y destino de los camiones no serán mostrados, inténtelo más tarde');
    const url = new URL(`${apiOrigin}${path}`);
    if (params) {
      Object.keys(params)
        .forEach((key) => url.searchParams.append(key, params[key]));
    }
    const response = await apiRequester.get(url, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return {
      data: response.data,
      statusCode: response.status,
    };
  } catch (e) {
    return errorGenerator(e);
  }
}

export default apiGet;
