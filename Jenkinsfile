pipeline {
    agent any
    options {
        timestamps()
        disableConcurrentBuilds()
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build and Test') {
            steps { sh 'mvn -B clean verify' }
        }
        stage('Build Docker Image') {
            steps { sh 'docker build -t fitness-management-system:latest .' }
        }
        stage('Deploy with Ansible') {
            steps {
                sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy.yml'
            }
        }
        stage('Verify API') {
            steps {
                sh 'curl --fail --retry 10 --retry-delay 3 --retry-connrefused http://host.docker.internal:8081/api/health'
                sh 'curl --fail http://host.docker.internal:8081/api/members'
            }
        }
    }
    post {
        success { echo 'Fitness Management System pipeline completed successfully.' }
        failure { echo 'Pipeline failed. Review the stage console output.' }
    }
}


