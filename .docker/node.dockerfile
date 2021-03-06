FROM node:10.15.3

# Update and install required packages
RUN     apt-get update
RUN     apt-get install vim -y

# Install PM2
RUN     yes | npm i pm2 -g