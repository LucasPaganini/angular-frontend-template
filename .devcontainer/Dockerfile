# Node & NPM versions
FROM node:14.17.0
RUN npm install -g npm@7.15.0

# Cypress dependencies
RUN apt-get update && apt-get --yes install \
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# Headless Chrome & Firefox for tests
RUN apt-get update \
    && apt-get install -y \
      xvfb \
      chromium \
      firefox-esr
ENV CHROME_BIN=/usr/bin/chromium \
    FIREFOX_BIN=/usr/bin/firefox-esr

WORKDIR /var/www
EXPOSE 4200
