FROM node

WORKDIR /opt/sACN-OPC

COPY package.json .
RUN npm install
COPY index.js .
COPY opc.js .
EXPOSE 5568

CMD node index.js --ip $OPC_IP --hz $OPC_HZ
