export const environment = {
  production: true,
  socketioConfig: {
    url: 'https://nickrheaume.ca/messenger/', 
    options: {
      withCredentials: true,
      extraHeaders: {
        "nr-portfolio": "nr-portfolio"
      }
    }
  }
};