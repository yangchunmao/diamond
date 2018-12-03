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

    stage('deploy') {
        
        def war_name = "diamond-0.0.1-SNAPSHOT.war"
        def PORT = 80
        sh """
        cp ${env.WORKSPACE}/target/${war_name} /home/servers
        cd /home/servers
        if [ $(ps -ef | grep ${war_name} | wc -l) -gt 1 ]; then
            kill -9 -f ${war_name}
            echo "stop application"
        fi
        JENKINS_NODE_COOKIE=DONTKILLME nohup java $JAVA_OPTS -Xmx256m -jar ${war_name} --spring.profiles.active=dev,no-liquibase --server.port=$PORT
        """
    }
}
