const { BaseModule } = require('lisk-sdk');

// Service provider asset schemas
const providerSchema = {
  $id: 'homeservice/provider',
  type: 'object',
  required: ['address', 'name', 'services', 'credentials', 'location'],
  properties: {
    address: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    name: {
      dataType: 'string',
      fieldNumber: 2,
    },
    services: {
      type: 'array',
      fieldNumber: 3,
      items: {
        type: 'string',
      },
    },
    credentials: {
      type: 'object',
      fieldNumber: 4,
      properties: {
        verificationHash: {
          dataType: 'string',
          fieldNumber: 1,
        },
        documentRefs: {
          type: 'array',
          fieldNumber: 2,
          items: {
            dataType: 'string',
          },
        },
        isVerified: {
          dataType: 'boolean',
          fieldNumber: 3,
        },
      },
    },
    location: {
      type: 'object',
      fieldNumber: 5,
      properties: {
        lat: {
          dataType: 'string',
          fieldNumber: 1,
        },
        long: {
          dataType: 'string',
          fieldNumber: 2,
        },
        serviceRadius: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
      },
    },
    rating: {
      dataType: 'uint32',
      fieldNumber: 6,
    },
    reviewCount: {
      dataType: 'uint32',
      fieldNumber: 7,
    },
    registered: {
      dataType: 'uint32',
      fieldNumber: 8,
    },
  },
};

class ServiceProviderModule extends BaseModule {
  name = 'serviceProvider';
  id = 1000; // Module ID
  
  // Register module schemas
  schema = {
    $id: 'homeservice/serviceProvider',
    type: 'object',
    properties: {
      providers: {
        type: 'object',
        fieldNumber: 1,
      },
    },
  };
  
  // Actions available through API
  actions = {
    // Get provider by address
    getProvider: async ({ address }) => {
      const providerBuffer = await this._dataAccess.getAccountState(
        Buffer.from(address, 'hex'),
        this.name
      );
      if (!providerBuffer) {
        return { provider: null };
      }
      const provider = providerSchema.decode(providerBuffer);
      return { provider };
    },
    
    // Search providers by service and location
    searchProviders: async ({ service, lat, long, radius }) => {
      // Implementation of geospatial search logic
      // This would involve retrieving all providers and filtering
      // In a production environment, would use spatial indexing
      
      // Placeholder implementation
      return { providers: [] };
    }
  };
  
  // Transactions (state changes)
  transactions = [
    {
      name: 'registerProvider',
      schema: {
        $id: 'homeservice/registerProvider',
        type: 'object',
        required: ['name', 'services', 'credentialRefs', 'location'],
        properties: {
          name: {
            dataType: 'string',
            fieldNumber: 1,
          },
          services: {
            type: 'array',
            fieldNumber: 2,
            items: {
              dataType: 'string',
            },
          },
          credentialRefs: {
            type: 'array',
            fieldNumber: 3,
            items: {
              dataType: 'string',
            },
          },
          location: {
            type: 'object',
            fieldNumber: 4,
            properties: {
              lat: {
                dataType: 'string',
                fieldNumber: 1,
              },
              long: {
                dataType: 'string',
                fieldNumber: 2,
              },
              serviceRadius: {
                dataType: 'uint32',
                fieldNumber: 3,
              },
            },
          },
        },
      },
      
      async apply({ asset, transaction, stateStore }) {
        const { senderAddress } = transaction;
        
        // Create new provider record
        const provider = {
          address: senderAddress,
          name: asset.name,
          services: asset.services,
          credentials: {
            verificationHash: '',
            documentRefs: asset.credentialRefs,
            isVerified: false,
          },
          location: asset.location,
          rating: 0,
          reviewCount: 0,
          registered: Math.floor(Date.now() / 1000),
        };
        
        // Save provider state
        await stateStore.set(
          `provider:${senderAddress.toString('hex')}`,
          providerSchema.encode(provider)
        );
        
        return {};
      }
    },
    
    // Additional transactions would be defined here:
    // - updateProviderInfo
    // - verifyCredentials
    // - deactivateProvider
  ];
}

module.exports = ServiceProviderModule;