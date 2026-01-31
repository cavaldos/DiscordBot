FROM node:18-alpine
# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app
# Yarn is already pre-installed in the Node 18 official image
# Copy package.json
COPY package.json ./

# Cài đặt các phụ thuộc
RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start"]

