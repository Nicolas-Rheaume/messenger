export const environment = {
  production: true,
  socketioConfig: {
    url: 'https://nickrheaume.ca', 
    path: '/messenger',
    options: {
      withCredentials: true,
      extraHeaders: {
        "nr-portfolio": "nr-portfolio"
      }
    }
  }
};