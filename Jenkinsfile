pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        CI = 'true'
        HOME = '.'
        DOCKER_HUB_PASSWORD = credentials('docker_hub_password')
        WEBSITE_URL= ''
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

        stage ('Deploy') {
            parallel {
                stage('DEV') {
                    agent {
                        docker {
                            image 'node:13.12.0-alpine'
                            args '-p 3000:3000'
                        }
                    }
                    when {
                        branch 'development'
                    }
                    environment {
                        BUILD_DEV_ID = 'REACT_BUILD_ID'
                        WEBSITE_URL= 'http://192.168.1.50:8085'
                    }
                    stages {
                        stage('Clear container') {
                            steps {
                                sh 'echo Cleaning Image'
                            }
                        }
                        stage('Docker -Build and Deploy - DEV') {

                            steps {
                                sh 'echo Building Docker Image'
                                sh 'chmod 777 ./jenkins/scripts/deploy-for-dev.sh'
                                sh "./jenkins/scripts/deploy-for-dev.sh $BUILD_DEV_ID"
                            }
                        }

                        stage('Run Docker Image') {
                            steps {
                                sh "echo Running Docker Image $BUILD_DEV_ID"
                                sh 'docker run -it -d -p 8085:80 --name portfolio-web stainley/portfolio-web-dev:0.1.2'
                            }
                        }
                        stage('Cleaning dangling images') {
                            steps {
                                sh 'docker rmi \$(docker image ls --filter dangling=true -q)'
                            }
                        }
                        stage('Wait for user to input text?') {
                            when {
                                equals{
                                    "${currentBuild.currentResult}=='SUCCESS'"
                                }
                            }
                            steps {
                                sh 'echo WORKING IN ${env.CHANGE_ID}'

                                script {
                                     // Define Variable
                                    def USER_INPUT = input(
                                        message: 'User input required - Some Yes or No question?',
                                        parameters: [
                                            [$class: 'ChoiceParameterDefinition',
                                            choices: ['no','yes'].join('\n'), name: 'input',
                                            description: 'Menu - select box option']
                                            ])

                                            echo "The answer is: ${USER_INPUT}"

                                    if( "${USER_INPUT}" == "yes"){
                                        echo 'user select YES'
                                    } else {
                                        echo "User select NO"
                                   }
                                }
                            }
                        }
                    }
                }
                stage('QA') {
                    when {
                        branch 'quality'
                    }
                    stages {
                        stage('Build and Deploy - QA') {

                            steps {
                                sh 'chmod 777 ./jenkins/scripts/deploy-for-qa.sh'
                                sh './jenkins/scripts/deploy-for-qa.sh'
                            }
                        }
                        stage('Build Docker Image and Push to Docker Hub') {
                            steps {
                                sh 'chmod 777 ./jenkins/scripts/deploy-for-production.sh'
                                sh './jenkins/scripts/deploy-for-production.sh'

                                withCredentials([usernamePassword(credentialsId: 'docker_hub', passwordVariable: 'PWD', usernameVariable: 'USR')]){
                                    sh 'docker login -u $USR --password $DOCKER_HUB_PASSWORD'
                                    sh 'docker push stainley/portfolio-react:0.1.1'
                                }
                            }
                        }
                    }
                }
                stage('PROD') {
                   when {
                        branch 'master'
                    }
                    stages {
                        stage('Build and Deploy - Production') {

                            stages {
                                stage('Build Docker Image and Push to Docker Hub') {
                                    steps {
                                        sh 'chmod 777 ./jenkins/scripts/deploy-for-production.sh'
                                        sh './jenkins/scripts/deploy-for-production.sh'

                                        withCredentials([usernamePassword(credentialsId: 'docker_hub', passwordVariable: 'PWD', usernameVariable: 'USR')]){
                                            sh 'docker login -u $USR --password $DOCKER_HUB_PASSWORD'
                                            sh 'docker push stainley/portfolio-react:0.1.1'
                                        }
                                    }
                                }

                                stage('Deploy to Kubernetes'){
                                    steps {
                                        sh 'echo Deploying to Kubernetes'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}\n Web Site: ${env.WEBSITE_URL}",
                            recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                            subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
        }
    }
}
