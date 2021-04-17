pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        CI = 'true'
        HOME = '.'
        DOCKER_HUB_PASSWORD = credentials('docker_hub_password')
    }


    stages {

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
                        cobertura(
                                  autoUpdateHealth: false,
                                  autoUpdateStability: false,
                                  coberturaReportFile: '**/coverage/cobertura-coverage.xml',
                                  failNoReports: true,
                                  classCoverageTargets: '70',
                                  lineCoverageTargets: '70, 80, 80',
                                  fileCoverageTargets: '70',
                                  sourceEncoding: 'ASCII',
                                  conditionalCoverageTargets: '70, 80, 80',
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

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
                    script{
                        def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
                        if (qg.status != 'OK') {
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                }
            }
        }
    }
}
