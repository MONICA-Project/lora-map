FROM mono:latest

RUN apt-get update && apt-get install -y curl gnupg

RUN curl -L http://repo.blubbfish.net/blubb.gpg.key | apt-key add -
RUN echo "deb http://repo.blubbfish.net blubb main" | tee "/etc/apt/sources.list.d/blubb.list"

RUN apt-get update && apt-get install -y loramap

WORKDIR /usr/local/bin/loramap
