pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        APP_VERSION_ID = '0.1.3'
        REACT_APP_NAME='portfolio-web'
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
                                  lineCoverageTargets: '60, 70, 80',
                                  fileCoverageTargets: '70',
                                  sourceEncoding: 'ASCII',
                                  conditionalCoverageTargets: '80, 50, 40',
                                  methodCoverageTargets: '80,60, 50',
                                  packageCoverageTargets: '80, 60, 50'
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
/////////////////////////////////////////// DEV ////////////////////////////////////////
        stage ('Dev') {
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
                        sh "./jenkins/scripts/deploy-for-dev.sh $REACT_APP_NAME $APP_VERSION_ID"
                    }
                }
                stage('Run Docker Image') {
                    steps {
                        sh "echo Running Docker Image $REACT_APP_NAME:$APP_VERSION_ID"
                        sh 'docker run -it -d -p 8085:80 --name $REACT_APP_NAME stainley/portfolio-web-dev:$APP_VERSION_ID'
                    }
                }
                stage('Cleaning dangling images') {
                    steps {
                        sh 'docker rmi $(docker image ls --filter dangling=true -q)'
                    }
                }
                stage('Deploy to Kubernetes?') {
                    when {
                        expression {
                            currentBuild.result == null || currentBuild.result == 'SUCCESS'
                        }
                    }
                    steps {
                        script {
                            def USER_INPUT = input(message: 'Would you like to deploy to Kubernetes - Some Yes or No question?',
                                            parameters: [[$class: 'ChoiceParameterDefinition',
                                                    choices: ['no','yes'].join('\n'), name: 'input',
                                                    description: 'Menu - select box option']])


                            if( "${USER_INPUT}" == "yes"){
                                sshagent(credentials : ['kube_master']) {
                                    sh "scp kubernetes-deploy.yaml stainley@192.168.1.100:/home/stainley/Public/kubernetes"
                                    sh """ssh -t stainley@192.168.1.100 -o StrictHostKeyChecking=no << EOF
                                        cd Public/kubernetes
                                        microk8s kubectl apply -f kubernetes-deploy.yaml
                                        exit
                                        EOF"""
                                }
                            } else {
                                echo "User select NO"
                            }
                        }
                    }
                }
            }
        }
    /////////////////////////////////////////////////////// PROD //////////////////////////////////////////////
        stage ('Prod') {
            when {
                branch 'master'
            }
            environment {
                BUILD_DEV_ID = 'REACT_BUILD_ID'
                WEBSITE_URL= 'http://stainley.minexsoft.com'
            }
            stages {
                stage('Clear container') {
                    steps {
                        sh 'echo Cleaning Image'
                    }
                }
                stage('Docker -Build and Deploy - Prod') {
                    steps {
                        sh 'echo Building Docker Image'
                        sh 'chmod 777 ./jenkins/scripts/deploy-for-prod.sh'
                        sh "./jenkins/scripts/deploy-for-prod.sh $REACT_APP_NAME $APP_VERSION_ID"

                        withCredentials([usernamePassword(credentialsId: 'docker_hub', passwordVariable: 'PWD', usernameVariable: 'USR')]){
                            sh 'docker login -u $USR --password $DOCKER_HUB_PASSWORD'
                            sh "docker push stainley/$REACT_APP_NAME:$APP_VERSION_ID stainley/$REACT_APP_NAME:latest"
                            echo "----- Docker Image uploaded to Docker Hub successfully ----"
                        }
                    }
                }
                stage('Cleaning dangling images') {
                    steps {
                        sh 'docker rmi $(docker image ls --filter dangling=true -q)'
                    }
                }
                stage('Deploy to Kubernetes?') {
                    when {
                        expression {
                            currentBuild.result == null || currentBuild.result == 'SUCCESS'
                        }
                    }
                    steps {
                        script {
                            def USER_INPUT = input(message: 'Would you like to deploy to Kubernetes - Some Yes or No question?',
                                            parameters: [[$class: 'ChoiceParameterDefinition',
                                                    choices: ['no','yes'].join('\n'), name: 'input',
                                                    description: 'Menu - select box option']])


                            if( "${USER_INPUT}" == "yes"){
                                sshagent(credentials : ['servercheap']) {

                                    sh "scp -o StrictHostKeyChecking=no kubernetes-deploy.yaml saiyamans@minexsoft.com:/home/saiyamans/kubernetes/portfolio"
                                    sh """ssh -t saiyamans@minexsoft.com -o StrictHostKeyChecking=no << EOF
                                        cd /home/saiyamans/kubernetes/portfolio
                                        microk8s kubectl apply -f kubernetes-deploy.yaml
                                        exit
                                        EOF"""
                                }
                            } else {
                                echo "User select NO"
                            }
                        }
                    }
                }
            }
        }

        stage ('Pull Request') {

                    when {
                        expression {
                            env.BRANCH_NAME.startsWith('PR')
                        }
                    }
                    stages {
                        stage('Clear container') {
                            steps {
                                sh 'echo Doing PULL REQUEST Francisco'
                            }
                        }
                    }
                }
    }
    post {
        always {
            emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}\n Web Site: ${env.CHANGE_ID}",
                            recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                            subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
        }
    }
}
