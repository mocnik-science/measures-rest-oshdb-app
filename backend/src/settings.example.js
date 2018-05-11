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
  mapUrl: port => `https://osm-measure.geog.uni-heidelberg.de/user/${port}`,
  repositoryUrl: 'https://osm-measure.geog.uni-heidelberg.de',
}
