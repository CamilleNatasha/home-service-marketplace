// Basic Lisk Sidechain Configuration for Home Service Marketplace
const { Application, configDevnet, genesisBlockDevnet } = require('lisk-sdk');

// Custom modules for the marketplace
const ServiceProviderModule = require('./modules/service_provider');
const EscrowModule = require('./modules/escrow');
const ReviewModule = require('./modules/review');
const InsuranceModule = require('./modules/insurance');

// Configure the application
const appConfig = {
  ...configDevnet,
  label: 'home-service-chain',
  genesisConfig: {
    ...genesisBlockDevnet.genesisConfig,
    communityIdentifier: 'homeservice',
  },
  logger: {
    consoleLogLevel: 'info',
  },
};

// Initialize the application with custom modules
const app = Application.defaultApplication(appConfig);

// Register custom modules
app.registerModule(ServiceProviderModule);
app.registerModule(EscrowModule); 
app.registerModule(ReviewModule);
app.registerModule(InsuranceModule);

// Run the application
app
  .run()
  .then(() => console.log('Home Service Marketplace sidechain started successfully'))
  .catch(console.error);