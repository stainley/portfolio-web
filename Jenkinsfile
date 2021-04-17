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
                                  classCoverageTargets: '50',
                                  lineCoverageTargets: '50, 50, 50',
                                  fileCoverageTargets: '70',
                                  sourceEncoding: 'ASCII',
                                  conditionalCoverageTargets: '50, 50, 50',
                                  methodCoverageTargets: '50,50, 60',
                                  packageCoverageTargets: '50, 50, 60'
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

                                // Default values
                                def subject = "JENKINS-NOTIFICATION: ${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
                                def details = """<p>${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                                <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""

                                // Send email to user who has started the build
                                emailext(
                                    subject: subject,
                                    body: details,
                                    attachLog: true,
                                    compressLog: true,
                                    recipientProviders: [[$class: 'RequesterRecipientProvider'], [$class:'UpstreamComitterRecipientProvider']]
                                )
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
                            recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                            subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
        }
    }
}
