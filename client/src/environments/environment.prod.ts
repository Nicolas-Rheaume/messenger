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