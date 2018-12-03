#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "./mvnw clean"
    }

    stage('install tools') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v10.13.0 -DnpmVersion=6.4.1"
    }

    stage('npm install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
    }

    // stage('backend tests') {
    //     try {
    //         sh "./mvnw test"
    //     } catch(err) {
    //         throw err
    //     } finally {
    //         junit '**/target/surefire-reports/TEST-*.xml'
    //     }
    // }

    // stage('frontend tests') {
    //     try {
    //         sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='test -- -u'"
    //     } catch(err) {
    //         throw err
    //     } finally {
    //         junit '**/target/test-results/jest/TESTS-*.xml'
    //     }
    // }

    stage('packaging') {
        sh "./mvnw package -Pdev -DskipTests"
        archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
    }

    // def dockerImage
    // stage('build docker') {
    //     sh "cp -R src/main/docker target/"
    //     sh "cp target/*.war target/docker/"
    //     dockerImage = docker.build('ccr.ccs.tencentyun.com/diamond', 'target/docker')
    // }

    // stage('publish docker') {
    //     docker.withRegistry('yangcm/registry.hub.docker.yangcm', 'tenhub') {
    //         dockerImage.push 'latest'
    //     }
    // }

    // stage('deploying') {
    //     def jar_name = "diamond-0.0.1-SNAPSHOT.war"
    //     def port = 80
    //     sh """
    //     if [ \$(pgrep -f ${jar_name} | wc -l) -gt 0 ]; then
    //         pkill -9 -f ${jar_name}
    //         echo "stop application"
    //     fi
    //     JENKINS_NODE_COOKIE=dontKillMe nohup java -Xmx256m -jar target/${jar_name} --spring.profiles.active=dev --server.port=${port} >/home/logs/diamond.log 2>&1 &  
    //     """
    // }
}
