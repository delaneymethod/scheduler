#!/usr/bin/env groovy

node('master') {
	try {
		environment {
			GIT_HOST = 'gitlab.com'
        	GIT_USER = 'barrylynch80'
        	GIT_PROJECT = 'scheduler'
        	SERVER_IP_ADDRESS = 'xxx.xxx.xxx.xxx'
		}
    
		stage('checkout') {
			git url: 'git@${env.GIT_HOST}:${env.GIT_USER}/${env.GIT_PROJECT}.git'
		}
		
		stage('build') {
			sh './development up'
			sh './development npm install'
		}
		
		#stage('test') {
		#	sh 'APP_ENV=testing ./development test'
		#}
		
		sh 'git rev-parse --abbrev-ref HEAD > GIT_BRANCH'
		
		git_branch = readFile('GIT_BRANCH').trim()
		
		if (git_branch == 'master') {
			stage('release') {
				sh './docker/build'
			}
			
			stage('deployment') {
				// IP address of Production server
				sh 'ssh -i ~/.ssh/id_sd root@${env.SERVER_IP_ADDRESS} /opt/deploy'
			}
		}
	} catch(error) {
		throw error
	} finally {
		sh './development down'
	}
}
