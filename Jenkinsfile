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
       		dockerImage = docker.build("codesharerbackendservice")
    	}
    
 		stage('Push image') 
		{
        	withDockerRegistry([ credentialsId: "DockerCreds", url: "" ]) 
			{
        		dockerImage.push()
        	}
    	}    
	}
}