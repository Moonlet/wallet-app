export const REQUEST_PRICE = 'REQUEST_PRICE';
export const RECEIVE_PRICE = 'RECEIVE_PRICE';

export const requestPrice = () => ({
  type: REQUEST_PRICE,
});

export const receivePrice = (json: any) => ({
  type: RECEIVE_PRICE,
  price: json[0].price_usd,
});

export const fetchPrice = () => {
  return function(dispatch: any) {
    dispatch(requestPrice());
    return fetch(`https://api.coinmarketcap.com/v1/ticker/ethereum/`)
      .then(
        response => {
          return response.json();
        },
        error => console.log('An error occurred.', error),
      )
      .then(json => {
        dispatch(receivePrice(json));
      });
  };
};
