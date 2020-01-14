FROM nginx:latest

# Update and install required packages
RUN     apt-get update
RUN     apt-get install vim -y

# Copy nginx config file
COPY    ./.docker/config/nginx.conf /etc/nginx/conf.d/nginx.conf

ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]