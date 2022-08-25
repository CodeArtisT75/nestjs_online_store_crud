FROM node:16.14.0-alpine

# Update and install container packages
RUN apk update
RUN yarn global add pm2

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
COPY .eslintrc.js tsconfig.json tsconfig.build.json ./
RUN yarn install --ignore-scripts

# Solve the problem with bcrypt
RUN yarn remove bcrypt
RUN yarn add bcrypt

# Copy source code
COPY src /app/src

# Build app
RUN yarn build

COPY ecosystem.config.js /app/ecosystem.config.js

CMD [ "pm2-runtime", "ecosystem.config.js" ]
