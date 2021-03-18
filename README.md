about status code : 

2xx : for positive resp

4xx : something went wrong due to info provided by client
(like passwor too short)


5xx : something went wrong at server side 


NOTE aout environment varibles: 
1. do not add spaces in dev.env file (KEY=VALUE => keep it like this)
2. env-cmd npm package is used and we modify our build script
3. git-ignore the config folder : but here we ignore this step 