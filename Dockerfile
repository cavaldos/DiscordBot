FROM node:18
# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app
# Yarn is already pre-installed in the Node 18 official image, so we remove the installation step
# Copy package.json và yarn.lock trước
COPY package.json yarn.lock ./
COPY yarn.lock ./

# Cài đặt các phụ thuộc
RUN yarn install --frozen-lockfile
# Use yarn to install dependencies
RUN yarn install

COPY . .

CMD ["yarn", "start"]

