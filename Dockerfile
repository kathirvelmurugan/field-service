# Production-grade ultra-lightweight web server for Render
FROM nginx:alpine

# Render assigns a dynamic port via $PORT (defaults to 10000 on Render)
ENV PORT=10000

# Copy nginx template (auto-substituted with $PORT by docker-entrypoint)
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy the interactive flow simulator to nginx web root
COPY index.html /usr/share/nginx/html/index.html

# Expose port (metadata)
EXPOSE 10000

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
