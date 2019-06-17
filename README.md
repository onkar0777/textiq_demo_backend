This project is on MERN Stack. React source code can be found here - https://github.com/onkar0777/textiq_demo_frontend

## BASIC SETUP
1. Go to the root folder
2. run `npm i`
3. IMPORTANT - `Follow steps in this - https://github.com/PranavHerur/ner-server`
4. Step 3 will start a java server which will be processing the Named Entity extraction requests

## PRE-PROCESSING
After following Basic Setup, follow these steps to preprocess data.
The Pre-Processing can be done in 2 ways.
### For local (Not scalable)
1. Place the folder with .txt files in the root with name `TEXT`
2. Else you can put it anywhere and change name in `config/constants.js`
3. run `node processor.js`
4. This will start a local node server on port 4500
5. Hit this url - `http://localhost:4500/api/init`
6. This will do the pre-processing
### For Scale (RabbitMQ Prototype)
1. Follow steps 1-4 in above section
2. Start as many rabbit workers as you like by running `node rabbit/worker.js` in different terminals
4. Hit this url - `http://localhost:4500/api/init`
5. This will pre-process the files by divding them onto the workers

`NOTE: This Pre-Processing part could have been a node script as well. I have kept it as a server as a personal preference`

## CLIENT SERVER
1. run `node app.js`
2. This will start a client server on `localhost:3500`
3. Please follow the PRE-PROCESSING steps before launching the client server 
4. This React code is in client folder. You can run local react server separately if needed.
