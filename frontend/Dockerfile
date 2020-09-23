# pull official base image
FROM nginx:stable-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
#COPY package.json .
#RUN npm install
#RUN npm install react-scripts@3.0.1 -g

# add app
COPY . .
RUN ls
RUN ls /app
COPY ./build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#RUN npm run build
#RUN npm install -g serve
# start app
#CMD ["serve", "-s", "build"]