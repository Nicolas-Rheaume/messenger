export const environment = {
  production: true,
  socketioConfig: {
    url: 'https://nickrheaume.ca/messenger/socket.io', 
    path: '/messenger/socket.io',
    options: {
      withCredentials: true,
      extraHeaders: {
        "nr-portfolio": "nr-portfolio"
      }
    }
  }
};