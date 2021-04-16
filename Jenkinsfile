pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        CI = 'true'
        HOME = '.'
        //npm_config_cache = 'npm-cache'
        DOCKER_HUB_PASSWORD = credentials('docker_hub_password')
    }


    stages {
        /* stage('Clone git') {
            steps {
                git 'https://github.com/stainley/react-portfolio.git'
            }
        } */

        stage('Install Packages') {
            steps {
                nodejs('nodejs') {
                    sh 'npm install -g yarn'
                    sh "yarn install"
                }
            }
        }

        stage('Test'){
            parallel {
                stage('Unit Test') {
                    steps {
                        nodejs('nodejs') {
                            sh 'yarn install'
                            sh 'yarn run test'
                        }
                    }
                }

                stage('Test Coverage'){
                    steps {
                        sh "yarn install"
                        sh 'yarn run test --coverage'
                        cobertura(autoUpdateHealth: true,
                                  autoUpdateStability: true,
                                  coberturaReportFile: '**/coverage/cobertura-coverage.xml',
                                  failNoReports: true,
                                  classCoverageTargets: '70',
                                  lineCoverageTargets: '70',
                                  fileCoverageTargets: '70',
                                  sourceEncoding: 'ASCII',
                                  conditionalCoverageTargets: '70',
                                  methodCoverageTargets: '70',
                                  packageCoverageTargets: '70'
                                  )
                    }
                }
            }
        }

        stage('Quality Code') {
            environment {
                scannerHome = tool 'SonarQube Scanner'
            }
            steps {
                withSonarQubeEnv('Sonarqube') {
                    sh '${scannerHome}/bin/sonar-scanner'
                }
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
