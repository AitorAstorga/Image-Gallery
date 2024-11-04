# Dockerfile
FROM nginx:latest

ENV DEBIAN_FRONTEND=noninteractive

# Install inotify-tools to monitor directory changes
RUN apt-get update && \
    apt-get install -y inotify-tools && \
    rm -rf /var/lib/apt/lists/*

# Remove the existing html directory
RUN rm -rf /usr/share/nginx/html

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the repository to the directory
COPY . /usr/share/nginx/html

# Copy the image list generator script into the container
COPY generate_images_json.sh /usr/share/nginx/html/generate_images_json.sh
RUN chmod +x /usr/share/nginx/html/generate_images_json.sh

# Create an entrypoint script that starts the Bash script and Nginx
RUN echo '#!/bin/sh\n\
/usr/share/nginx/html/generate_images_json.sh &\n\
nginx -g "daemon off;"' > /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80 for NGINX
EXPOSE 80

# Set the custom entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
