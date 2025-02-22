FROM node:18
WORKDIR /app

# Yarn is already pre-installed in the Node 18 official image, so we remove the installation step

COPY package*.json ./
COPY yarn.lock ./

# Use yarn to install dependencies
RUN yarn install

COPY . .

CMD ["yarn", "start"]