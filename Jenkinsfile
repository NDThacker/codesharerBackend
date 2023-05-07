pipeline 
{
	agent any

	stages 
	{
		stage('Checkout from SCM') 
		{
			steps 
			{
				checkout scm
			}
		}

		stage('Copy config folders and files')
		{
			steps
			{
				fileOperations([folderCreateOperation(folderPath: './config')]);
				fileOperations([folderCreateOperation(folderPath: './src/config')]);
				fileOperations([folderCopyOperation(
						sourceFolderPath: '/app-configs/config',
						destinationFolderPath: './config'
					)])
				fileOperations([folderCopyOperation(
						sourceFolderPath: '/app-configs/config',
						destinationFolderPath: './src/config'
					)])
			}
		}
		stage('Backend Tests') 
		{
			steps 
			{
				sh 'npm install'
				sh 'npm test'
			}
		}
		stage('Build image') 
		{
			steps
			{
       			sh 'docker build -t namant98/codesharerfullstack:backend .'
			}
    	}
    
 		stage('Push image') 
		{
			steps
			{
				withCredentials([usernamePassword(credentialsId: 'DockerCreds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) 
				{
					sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
					sh 'docker push namant98/codesharerfullstack:backend'
				}
			}
        	
    	}
	}
}