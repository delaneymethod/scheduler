# Scheduler

[![Build Status](http://`ADD_JENKINS_IP_ADDRESS`/buildStatus/icon?job=scheduler)](http://`ADD_JENKINS_IP_ADDRESS`/job/scheduler)

Scheduler is an on-demand shift allocation platform that enables employers and event planners to match shifts with available workers in real-time for immediate fulfilment.

## Technologies

* Nginx
* Node
* Ubuntu
* Docker
* Jenkins

## Prerequisites

This document focuses on running the web app in a Docker environment and that you have Ubuntu, Docker, Jenkins, Node and Git experience/knowledge.

The Docker images were built using Docker for Mac with Ubuntu as the base image. They have not been tested on Docker for Windows and therefore might not run on Windows. 

If you are running Windows, please refer to the Hot Module Replacement (HMR) Development steps.

## DEVELOPMENT - DOCKER FOR MAC

This section assumes you already have Docker for Mac setup and running locally. If you are not using Docker for Mac or you are running Windows, jump to the "Development - Non Docker / Windows" section below.

This section also assumes that you know the differences between running locally and on a remote Digital Ocean droplet with Docker installed.

Check the currently active set of `DOCKER_` variables, just do:

`env | grep DOCKER`

Also see [https://stackoverflow.com/questions/41685603/reset-docker-machine-to-run-docker-commands-on-my-local-machine](https://stackoverflow.com/questions/41685603/reset-docker-machine-to-run-docker-commands-on-my-local-machine)

It is important that you are not connected to a remote Docker machine and that your Docker env variables are set to your local machine.

### Installation

Clone the `master` branch from Git repo to your local machine. 

Navigation to where you have cloned the project files.

Start all containers:

`./development up`

Install NPM modules:

`./development npm install`

## Running

Build and watch assets (JS, Sass, Fonts, Images etc):

### Building for Development

This will compile and watch files for changes, outputting everything to the `public` folder.

`./development dev`

You should be able to visit the web app at [http://localhost](http://localhost) in your browser, manually refreshing to see changes.

### Building for Hot Module Replacement (HMR) Development

This will compile and watch files for changes. Default browser will be opened and automatically reloaded with changes.

### Building for Production

This will compile and apply production ready changes like optimisation and magnification, outputting everything to the `public` folder.

`./development prod`

You should be able to visit the web app at [http://localhost](http://localhost) in your browser.

Note: You should not need to run Production ready scripts locally. You only do this to make sure production ready works. Production ready scripts will be automatically ran from Jenkins.

#### Docker Commands

Start all containers:

`./development up`

List running containers:

`./development ps`

Stop all running containers:

`./development down`

List volumes:

`./development volumes`

List networks:

`./development networks`

## DEVELOPMENT - NON DOCKER / WINDOWS

This section assumes you are not running Docker.

### Installation

Clone the `master` branch from Git repo to your local machine. 

Navigation to where you have cloned the project files.

Install NPM modules:

`npm install`

## Running

Build and watch assets (JS, Sass, Fonts, Images etc):

### Building for Development

This will compile and watch files for changes, outputting everything to the `public` folder.

`npm run dev`

You should be able to visit the web app at [http://localhost](http://localhost) in your browser, manually refreshing to see changes.

### Building for Hot Module Replacement (HMR) Development

This will compile and watch files for changes. Default browser will be opened and automatically reloaded with changes.

`npm run hot`

You should be able to visit the web app at [http://localhost:8080](http://localhost:8080) in your browser, if it hasn't opened automatically. 

### Building for Production

This will compile and apply production ready changes like optimisation and magnification, outputting everything to the `public` folder.

`npm run prod`

You should be able to visit the web app at [http://localhost](http://localhost) in your browser.

Note: You should not need to run Production ready scripts locally. You only do this to make sure production ready works. Production ready scripts will be automatically ran from Jenkins.

## PRODUCTION

This section assumes you already have a Digital Ocean account. 

Please note other providers can be used such as AWS or Azure. You would obviously have to swap out specific Digital Ocean values.

### Droplet Configuration

Create a new droplet with Docker installed:

`DIGITIAL_OCEAN_API_KEY=XXXX ./production create 2gb lon1 web-01.scheduler.ADD_CLIENT_DOMAIN // E.g web-01.schedular.giggrafter.com`

I would recommend going for more memory though, but for the basic droplet, 512MB is enough with some tweaks.

Also see [https://docs.docker.com/machine/drivers/digital-ocean/#usage](https://docs.docker.com/machine/drivers/digital-ocean/#usage)

If for some reason your new droplet is not the active host, you’ll need to run `./production env web-01.scheduler.ADD_CLIENT_DOMAIN`.

Followed by `eval $(docker-machine env web-01.scheduler.ADD_CLIENT_DOMAIN)` to connect to the correct Docker machine env.

To test if this has worked, you can run `docker images`, which should be blank. 

If any images are listed, you’re probably still connected to the local machine (E.g your Mac) running a Docker daemon.

Also see: [https://docs.docker.com/machine/examples/ocean/](https://docs.docker.com/machine/examples/ocean/)

If for some reason, Docker on the new droplet did not start automatically, you can run:

`./production start web-01.scheduler.ADD_CLIENT_DOMAIN`

So now we have a running droplet with Docker installed.

However, the basic Digital Ocean 512MB droplet we setup for demo purposes will have a lack of memory or swap as mentioned above for what we need, so I suggest you read over this article and increase. 

You can SSH into the droplet and make your changes outlined in [https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04)

`./production ssh web-01.scheduler.ADD_CLIENT_DOMAIN`

To stop running Docker on your new droplet locally run:

`./production stop web-01.scheduler.ADD_CLIENT_DOMAIN`

To remove Docker on your new droplet run. Note this will also delete the droplet:

`./production rm web-01.scheduler.ADD_CLIENT_DOMAIN`

Now if you go back to your Digital Ocean account, the droplet no longer exists.

Reset Docker variables:

`eval $(docker-machine env -u)`
		
To re-create the SSL Cert run:

`./production ssl web-01.scheduler.ADD_CLIENT_DOMAIN`

### Deployment

This step is to allow us to deploy new changes keeping 99% up time.

The process we are adopting for updating the production server is as follows:

* Developer make their changes locally in your development Docker environment.
* Developer commits their code changes (squash commit into a single commit is preferred) and pushes their working branch to Gitlab for approval.
* Developer will create a new pull request against the `master` branch on Gitlab.
* Someone will review code changes and approve.
* Someone will merge the developers branch into the `master` branch on Gitlab.

The last step triggers a new "build" on the Jenkins CI/CD server, where all the Docker images are refreshed, code pulled from Gitlab and everything gets tested.

If everything passes, the Jenkins CI/CD server then creates a Production ready Docker image with all the latest code inside it and this image then gets pushed to the Docker registry.

Jenkins CI/CD then calls a deployment script on the Production server which pulls down the latest Production ready Docker image from the Docker registry and replaces everything, restarting Nginx Proxy/Load Balancer in the process.

#### Nginx Proxy/Load Balancer Configuration

We setup a new Nginx Proxy/Load Balancer so we have little or not down time during a deployment.

We need to SSH into the Production droplet: `./production ssh web-01.scheduler.ADD_CLIENT_DOMAIN`

We need to run `./production pull` on our local machine again to update the Docker images on the Production droplet so we are using latest images for each container.

We then run: `docker pull nginx:alpine` to get a basic Nginx server image.

We go to the `cd /opt` directory

We create a new folder called `conf.d` with a file called `default.conf`:

`mkdir conf.d && touch conf.d/default.conf`

We then create a new container name: `echo "scheduler_nginx_`date +"%s"`" # e.g. scheduler_nginx_1487724356`

We then copy and paste the output into `/opt/conf.d/default.conf`, replacing the `server` value (not the :80) and save the file again:

```
upstream app {
	server scheduler_nginx_1516113548:80;
}

server {
	client_max_body_size 100m;
	client_header_buffer_size 1k;
	client_body_buffer_size 256k;
	large_client_header_buffers 4 16k;
	
	listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;
	
	root /var/www/html;

	index index.html;

	server_name _;

	charset utf-8;

	location / {
		proxy_set_header Host $http_host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;

		proxy_intercept_errors on;
		proxy_buffering on;
		proxy_buffer_size 128k;
		proxy_buffers 256 16k;
		proxy_busy_buffers_size 256k;
		proxy_temp_file_write_size 256k;
		proxy_max_temp_file_size 0;
		proxy_read_timeout 300;

		proxy_pass http://app;
		proxy_redirect off;

		# Handle Web Socket connections
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
}
```

Next we create a new network, if a network doesn't already exist: `docker network create scheduler_network`.

We then start the main Nginx container:

`docker run -d --network=scheduler_network --restart=always --name="scheduler_nginx_1516113548" giggrafter/scheduler`

Note nothing happens for now. Nothing is listening on port 80 so we spin up our Nginx container:

`docker run -d --name=scheduler_nginx_proxy --network=scheduler_network --restart=always -v /opt/conf.d:/etc/nginx/conf.d -p 80:80 nginx:alpine`

So basically what we have now is an Nginx container acting as a Proxy/Load Balancer accepting traffic and forwarding this traffic to our main Nginx container.

Now we create our uploads folder structure that will be mounted against the uploads folder when the container is started by running:

`cd /`
`cd var`
`mkdir www`
`cd www`
`mkdir html`
`cd html`
`mkdir public`
`cd public`
`mkdir uploads`

This creates the same structure used within project for file uploads and matches our deploy script volume mounting flag below. We mount this volume to keep file uploads persistence during deployments as otherwise the uploads folder would be wiped and all files uploaded lost.

Lets make sure we set the correct permissions too by running:

`chown -R www-data:www-data /var/www`

If the recursive `chown` didn't work, do each folder:

`chown www-data:www-data /var/www`
`chown www-data:www-data /var/www/html`
`chown www-data:www-data /var/www/html/public`
`chown www-data:www-data /var/www/html/public/uploads`

Now we create our `deploy` script by running:

`touch deploy && chmod +x deploy && pico deploy`

Paste the contains into the script and save:

```
#!/usr/bin/env bash

# Set Docker environment variables
DOCKER_USER=giggrafter
DOCKER_PASSWORD=$bQ7]_Fka-<<w9&e
DOCKER_IMAGE_NAME=scheduler

###### DO NOT EDIT BELOW THIS LINE ######

# Get info on currently running "$DOCKER_IMAGE_NAME_nginx" container

APP_CONTAINER=$(docker ps -a -q --filter="name=$DOCKER_IMAGE_NAME_nginx")

NEW_CONTAINER="$DOCKER_IMAGE_NAME_nginx_`date +"%s"`"

# Deploy a new container

# Docker Registry login
docker login -u $DOCKER_USER -p $DOCKER_PASSWORD

# Pull latest
docker pull $DOCKER_USER/$DOCKER_IMAGE_NAME

# Don't deploy if latest image is running
RUNNING_IMAGE=$(docker inspect $APP_CONTAINER | jq ".[0].Image")

CURRENT_IMAGE=$(docker image inspect $DOCKER_USER/$DOCKER_IMAGE_NAME:latest | jq ".[0].Id")

if [ "$CURRENT_IMAGE" == "$RUNNING_IMAGE" ]; then
    echo ">>> Most recent image is already in use"
    
    exit 0
fi

# Start new instance
NEW_APP_CONTAINER=$(docker run -d --network=$DOCKER_IMAGE_NAME_network --restart=unless-stopped --name="$NEW_CONTAINER" -v /var/www/html/public/uploads:/var/www/html/public/uploads $DOCKER_USER/$DOCKER_IMAGE_NAME)

# Wait for processes to boot up
sleep 5

echo "Started new container $NEW_APP_CONTAINER"

# Update Nginx
sed -i "s/server $DOCKER_IMAGE_NAME_nginx_.*/server $NEW_CONTAINER:80;/" /opt/conf.d/default.conf

# Config test Nginx
docker exec $DOCKER_IMAGE_NAME_nginx_proxy nginx -t

NGINX_STABLE=$?

if [ $NGINX_STABLE -eq 0 ]; then
	# Reload Nginx
	docker kill -s HUP $DOCKER_IMAGE_NAME_nginx_proxy

	# Stop older instance
	docker stop $APP_CONTAINER
	
	# Remove older instance
	docker rm -v $APP_CONTAINER
	
	echo "Removed old container $APP_CONTAINER"

	# Cleanup, if any dangling images
	DANGLING_IMAGES=$(docker image ls -f "dangling=true" -q)
	
	if [ ! -z "$DANGLING_IMAGES" ]; then
		docker image rm $(docker image ls -f "dangling=true" -q)
	fi
else
	echo "ERROR: Nginx configuration test failed!"
	
	exit 1
fi
```

To run a deployment, we can now simply run: `./deploy` however, we will do this automatically with our Jenkins build script. These steps that you just ran was to get everything setup! :)

#### Jenkins Configuration

We need a new droplet to install Jenkins on so we can handle all the testing and building of our Production images.

We do the same steps as we did for the Production droplet itself - we create a new droplet as our 1st step.

Next we need to install some basics: 

`sudo apt-get update`

`sudo apt-get install -y curl wget unzip htop ntp software-properties-common`

Then we install Jenkins:

`wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -`

`echo 'deb http://pkg.jenkins.io/debian-stable binary/' | sudo tee /etc/apt/sources.list.d/jenkins.list`

`sudo apt-get update`

`sudo apt-get install -y jenkins`

`sudo service jenkins status`

Then test it:

`curl localhost:8080`

Next we need to install Nginx and use that as our HTTP entry point for Jenkins so we can proxy requests over to Jenkins.

`sudo add-apt-repository -y ppa:nginx/stable`

`sudo apt-get update`

`sudo apt-get install -y nginx`

We now need to configure Nginx:

`sudo rm /etc/nginx/sites-enabled/default`

`sudo pico /etc/nginx/sites-available/jenkins`

Make it like so:

```
server {
	listen 80 default_server;
	server_name localhost;
	
	location / {
		proxy_pass http://localhost:8080;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_connect_timeout 150;
		proxy_send_timeout 100;
		proxy_buffers 4 32k;
		client_max_body_size 100m;
		client_body_buffer_size 256k;
	}
}
```

Then enable it:

`sudo ln -s /etc/nginx/sites-available/jenkins /etc/nginx/sites-enabled/jenkins`
    
Test and reload Nginx:

`sudo service nginx configtest`

`sudo service nginx reload`

Jenkins should now be web accessible!

Now we need to unlock Jenkins by running:

`sudo cat /var/lib/jenkins/secrets/initialAdminPassword`

Use that password in the browser to create a new user and install the suggested plugins. Note because this project was setup in Gitlab, we need to install all the Gitlab related plugins. Do not get these confused with the Github plugins!

We then install Docker and Docker compose

`curl -sSL https://get.docker.com/ | sudo sh`

Ensure "jenkins" user can use it without "sudo", since we'll be automating Jenkins with Docker

`sudo usermod -aG docker jenkins`

`docker ps`

`docker docker ps`

`sudo -u jenkins docker ps`

Install Docker Compose:

`sudo su`

```
curl -L https://github.com/docker/compose/releases/download/1.10.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

`chmod +x /usr/local/bin/docker-compose`

`exit`

We need to restart Jenkins so it picks up the addition of group docker to user jenkins:

`sudo service jenkins restart`
 
If you would like to read up about installing Jenkins on Ubuntu, see: 

[https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)
   
#### Jenkins Build/Worker

The next step is to setup a new item in Jenkins to run our tests and build our image, using the `Jenkinsfile` found in our Git project.
    
I found a happy video tutorial that explains all these steps here: 

[https://course.shippingdocker.com/lessons/module-9/configuring-github-auth](https://course.shippingdocker.com/lessons/module-9/configuring-github-auth)

But as per the README prerequisites, Jenkins knowledge is required so you should know how to set up:

* GitLab for Authentication in Configure Global Security.
* Server Git Access as you will need access to be able to run git commands against the Git repository.
* Jenkins Pipeline.

If not, please refer the link above.

#### Docker Compose

Now that we have our Production droplet setup, configured with Docker, Docker machine, Docker compose, a Jenkins droplet setup with a deployment workflow using Nginx Proxy/Load Balancer, we are ready to cover Docker compose commands and actually running these on our Production server.

We can run Docker compose commands locally while we are connected to the remote droplet just like we could with Docker machine.

Docker compose is reading the `docker-compose.production.yml` file so it will pull down all the required Docker images and fire everything up.

Because we are dealing with a Production ready Docker image with the codebase self contained inside so all we need to do is run `./production up` to start up everything.

If you run `./production ps`, you should get back a blank list of running containers on the droplet.

To stop all running containers on the droplet, you can run `./production down`.

If you have any issues running Docker machine commands on the remote droplet, locally, SSH (`./production ssh web-01.scheduler.ADD_CLIENT_DOMAIN`) into the droplet and run the same Docker commands like:

`docker run -it --rm -v /srv/application:/opt -w /opt --network=scheduler_network delaneymethod/node:latest node -v`

### Running

All the assets have been already build in our Production ready image but if we ever needed to rebuild them again, we can do the following:

Build assets (JS, Sass, Fonts, Images etc):

`./production compose run --rm -w /var/www/html node npm run production`

or

`docker run -it --rm -v /srv/application:/opt -w /opt --network=scheduler_network delaneymethod/node:latest node npm run production`

You should be able to visit the web app at the droplets IP address or domain name (if one was setup) in your browser.
