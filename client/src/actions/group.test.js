import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { storeFactory } from '../utils';
import {
  receivePublicGroups,
  addLocationToGroup,
  createGroup,
  changeLocationDetail,
  removeLocation,
  removeGroupFromAllGroups
} from './group';

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

//Setup default data
const defaultGroupList = [
  {
    _id: '0000001',
    name: 'Restaurant in Berlin',
    description: 'my wish list restaurant',
    locations: [
      {
        _id: '1000001',
        name: 'Steakhaus',
        description: 'I love steak'
      }
    ]
  }
];

//receive all public group
mock.onGet('/api/group').reply(200, [
  {
    _id: '0000001',
    name: 'Restaurant in Berlin',
    description: 'my wish list restaurant',
    locations: [
      {
        _id: '1000001',
        name: 'Steakhaus',
        description: 'I love steak'
      }
    ]
  }
]);

//add location to a group
mock.onPost('/api/group/location/0000001').reply(config => {
  let resultGroupList = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    }
  ];
  const data = JSON.parse(config.data);
  resultGroupList[0].locations.unshift(data);
  mock.onGet('/api/group').reply(200, resultGroupList);
  return [200, data];
});

//create a group
mock.onPost('/api/group').reply(config => {
  let resultGroupList = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    }
  ];
  const data = JSON.parse(config.data);
  resultGroupList.unshift(data);
  mock.onGet('/api/group').reply(200, resultGroupList);
  return [200, data];
});

//change location detail
mock.onPost('/api/group/location/0000001/1000001').reply(config => {
  const data = JSON.parse(config.data);
  let resultGroupList = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [data]
    }
  ];
  mock.onGet('/api/group').reply(200, resultGroupList);
  return [200, data];
});

//remove location
mock.onDelete('/api/group/location/0000001/1000001').reply(config => {
  let resultGroupList = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: []
    }
  ];
  mock.onGet('/api/group').reply(200, resultGroupList);
  return [200, resultGroupList];
});

//remove group
mock.onDelete('/api/group/0000001').reply(config => {
  let resultGroupList = [];
  mock.onGet('/api/group').reply(200, resultGroupList);
  return [200, resultGroupList];
});

//about profile
const initProfile = {
  user: {
    name: 'test user',
    email: 'a@b.com'
  },
  wersite: '',
  groups: ['Restaurant in Berlin']
};
mock.onGet('/api/profile/me').reply(200, initProfile);
mock.onPost('/api/profile').reply(config => {
  return [200, config.data];
});

test('receivePublicGroups', async () => {
  const expectResult = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    }
  ];
  const store = storeFactory();
  await store.dispatch(receivePublicGroups());
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});

test('addLocationToGroup', async () => {
  const expectResult = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000002',
          name: 'Italien Restaurant',
          description: 'Yammy'
        },
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    }
  ];
  const store = storeFactory();
  await store.dispatch(
    addLocationToGroup('0000001', {
      _id: '1000002',
      name: 'Italien Restaurant',
      description: 'Yammy'
    })
  );
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});

test('createGroup', async () => {
  const expectResult = [
    {
      _id: '0000002',
      name: 'Cafe in Berlin',
      description: 'Must have WIFI!'
    },
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    }
  ];
  const store = storeFactory();
  await store.dispatch(
    createGroup({
      _id: '0000002',
      name: 'Cafe in Berlin',
      description: 'Must have WIFI!'
    })
  );
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});

test('changeLocationDetail', async () => {
  const expectResult = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'Not open anymore :('
        }
      ]
    }
  ];
  const store = storeFactory();
  await store.dispatch(
    changeLocationDetail('0000001', {
      _id: '1000001',
      name: 'Steakhaus',
      description: 'Not open anymore :('
    })
  );
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});

test('removeLocation', async () => {
  const expectResult = [
    {
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: []
    }
  ];
  const store = storeFactory();
  await store.dispatch(removeLocation('0000001', '1000001'));
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});

test('removeGroupFromAllGroups', async () => {
  const expectResult = [];
  const store = storeFactory();
  await store.dispatch(
    removeGroupFromAllGroups({
      _id: '0000001',
      name: 'Restaurant in Berlin',
      description: 'my wish list restaurant',
      locations: [
        {
          _id: '1000001',
          name: 'Steakhaus',
          description: 'I love steak'
        }
      ]
    })
  );
  const state = store.getState();
  expect(state.group.allGroups).toMatchObject(expectResult);
});
