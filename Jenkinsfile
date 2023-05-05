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
				fileOperations([folderCopyOperation(
						sourceFolderPath: '/app-configs/config',
						destinationFolderPath: './'
					)])
				fileOperations([folderCopyOperation(
						sourceFolderPath: '/app-configs/config',
						destinationFolderPath: './src/'
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
	}
}