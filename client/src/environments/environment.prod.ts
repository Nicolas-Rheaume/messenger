export const environment = {
  production: true,
  socketioConfig: {
    url: '/messenger', 
    options: {
      withCredentials: true,
      extraHeaders: {
        "nr-portfolio": "nr-portfolio"
      }
    }
  }
};