# pull official base image
FROM node:13.12.0-alpine

# set working directory
RUN mkdir /app
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN npm install
RUN npm install react-scripts@3.0.1 -g
RUN npm run build

# add app
COPY . .

# start app
CMD ["serve", "-s build"]