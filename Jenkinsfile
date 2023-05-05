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
		stage('Building docker image')
		{
			steps
			{
				sh 'docker build -t codesharerbackendservice .'
			}
		}
		stage('Pushing Docker image to dockerhub')
		{
			steps
			{
				withCredentials([usernamePassword(credentialsId: 'DockerCreds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')])
				{
					sh 'docker login -u $DOCKER_USERNAME --password-stdin $DOCKER_PASSWORD'
					sh 'docker push codesharerbackendservice'

				}
			}
		}
	}
}