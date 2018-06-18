FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN apt-get update -y
RUN apt-get install -y software-properties-common
RUN apt-get update && apt-get install -y python-pip libpython-dev
RUN pip install awscli --upgrade --user
RUN ~/.local/bin/aws --version