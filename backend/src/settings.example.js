module.exports = {
  localUsers: {
    // 'user': 'password',
  },
  admins: [
    // 'user',
  ],
  ldapOptions: {
    server: {
      url: 'ldap://***:389',
      bindDN: '',
      bindCredentials: '',
      searchBase: '',
      searchFilter: '...(user={{username}})...',
    },
  },
  mapUrl: port => `http://\${window.location.hostname}:${port}`,
  repositoryUrl: 'http://osm-measure.geog.uni-heidelberg.de',
},
