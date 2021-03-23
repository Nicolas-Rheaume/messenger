#############################################################
# MESSENGER APPLICATION
#############################################################

# Get the base Node.js image
FROM node:current

# RUN mkdir -p /usr/src/collab/server

# Create app directory
WORKDIR /app/messenger/

# Copy over the package.js file
COPY package*.json ./

# Install all the dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Copy over all the app files
COPY . .

# Create an environment variable
ENV PORT=8080

# Start the Application
CMD ["node", "run", "serve:prod"]

# RUN npm install -g nodemon
# Bundle app source
#COPY ./ ./usr/src/collab/server/

# Bind port 3000 to have it mapped by the docker daemon
# EXPOSE 3000

## THE LIFE SAVER
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
# RUN chmod +x /wait

## Launch the wait tool and then start the Node.js App
# CMD /wait && npm start


# Start the Node.js App
# CMD [ "node", "index.js" ]