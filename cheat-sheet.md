`func init dad-jokes --worker-runtime node` - creates new azure function called 'dad-jokes'

https://github.com/apollo-server-integrations/apollo-server-integration-azure-functions - link to apollo-server azure function implementation

`npm install @as-integrations/azure-functions @apollo/server graphql @azure/functions` - install all dependencies needed to create gql api using apollo within function app

`func new --template "Http Trigger" --name graphql` - creates new /graphql function in dad-jokes az function