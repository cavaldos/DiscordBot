FROM node:18

WORKDIR /app

# Install yarn globally
RUN npm install -g yarn

COPY package*.json ./
COPY yarn.lock ./

# Use yarn to install dependencies
RUN yarn install

COPY . .

CMD ["yarn", "start"]