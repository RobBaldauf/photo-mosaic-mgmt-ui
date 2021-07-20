FROM node:lts-buster
WORKDIR /photo_mosaic_ui
EXPOSE 8112

RUN npm install --global http-server

# install python opencv (workaround for dependency bug)
RUN apt-get update && apt-get install -y python3-opencv

# copy config
COPY config/ ./config

# copy code
COPY run_app.sh .
COPY app/ ./app

# run app
ENTRYPOINT ["./run_app.sh"]
