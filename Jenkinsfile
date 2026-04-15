pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git 'https://github.com/ashishphapale/studyhub-frontend'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t studyhub-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker stop studyhub-container || exit 0'
                bat 'docker rm studyhub-container || exit 0'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 8081:80 --name studyhub-container studyhub-app'
            }
        }
    }
}