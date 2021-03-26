export const environment = {
  production: true,
  base_url: '/messenger',
  socketioConfig: {
    url: 'https://nickrheaume.ca/messenger', 
    options: {
      path: '/messenger/socket.io',
      allowUpgrades : true,
      withCredentials: true,
    }
  }
};
/*
export const environment = {
  production: true,
  socketioConfig: {
    url: 'https://nickrheaume.ca/messenger', 
    options: {
      transports: ['websocket'], 
      allowUpgrades : true,
      path: '/messenger/socket.io',
      withCredentials: true,
      extraHeaders: {
        "nr-portfolio": "nr-portfolio"
      }
    }
  }
};
*/