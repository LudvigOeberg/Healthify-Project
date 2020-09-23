# pull official base image
FROM node:13.12.0-alpine

# set working directory
RUN mkdir /app
RUN ls -la
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
#COPY package.json .
#RUN npm install
#RUN npm install react-scripts@3.0.1 -g

# add app
COPY . .
#RUN npm run build
#RUN npm install -g serve
# start app
CMD ["serve", "-s", "build"]