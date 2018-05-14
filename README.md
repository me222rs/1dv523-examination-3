# Installation instructions #

The application runs live at https://138.68.110.209/.

## Set up a web server ##
First we need to set up a web server. In this case we are using DigitalOcean(https://www.digitalocean.com/). If you already have a webserver set up you can skip this part.
1. First off we need to create a droplet and select the One-click app tab and select MEAN on 14.04

2. Then select a server location and a size

3. Then select your SSH key that you want to use. Follow this guide on how to create one: https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets

4. Finally click on create

## Set up a git repository on the web server ##
First you should make sure you have the lastest stable or a pretty new version of node and npm installed on the web server.

There is a good tutorial made by DigitalOcean which takes you through the steps of creating a git repository on the web server:
https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps

## Create a github token, webhook and configure it ##
1. Create you github token here: https://github.com/settings/tokens.

2. All options at repo, admin:org, admin:repo_hook should be checked. Then save it.

3. Create your webhook at: https://github.com/USERNAME/REPOSITORYNAME/settings/hooks. Click on add webhook.

4. Now enter where you want to send the payload. In this case: https://YOURIPADRESS:3000/webhook. Then enter the token we created earlier in the secret field. If you have a real https certificate you should have the SSL verification enabled.

5. Last we need to check some individual events: Issues, Issue comment and push. 

## Install a process manager (pm2) ##
Next step is to install a process manager called pm2 on the web server. In the folder where the application is located we will install pm2 through npm by using the npm command: npm install pm2 -g
This will install the process manager globally. With pm2 you can run multiple applications and the application will also be restarted if it crashes.
Now type the following command: pm2 start server.js to start the application. More commands can be found here: https://www.npmjs.com/package/pm2

## Install and configure nginx ##
Here is a tutorial of how to install nginx: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts
After you have installed nginx you should find the file default which is located at /etc/nginx/sites-available/. Open the file with nano (nano default) and replace all of its contents with this code https://gist.github.com/thajo/d5db8e679c1237dfdb76. You might have to change the proxy_pass variable from http://localhost:3000 to https://localhost:3000.
Then restart the nginx (service nginx restart).

### A more detailed tutorial ###
This video will take you through the nginx installation and configuration: https://www.youtube.com/watch?v=OuRhaSQljsc
Links to the config code: https://gist.github.com/thajo/d5db8e679c1237dfdb76

## The application ##
The code contains a .env file in its root where you will have to enter the github token.
