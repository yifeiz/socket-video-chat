FROM node:8.6

# Workdir and installing
WORKDIR /socket-video-chat
COPY package.json /socket-video-chat/
RUN npm install

COPY ./ /socket-video-chat

# Get instance configuration
ARG VUE_APP_SOCKET_HOST=NOT_SET
ARG VUE_APP_SOCKET_PORT=NOT_SET
# Build the app
RUN export VUE_APP_SOCKET_HOST=${VUE_APP_SOCKET_HOST} VUE_APP_SOCKET_PORT=${VUE_APP_SOCKET_PORT} && npm run build
# Run the server on the startup
CMD ["npm", "run", "run:server"]