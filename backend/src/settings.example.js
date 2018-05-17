module.exports = {
  localUsers: {
    // 'user': 'password',
  },
  admins: {
    // user: true,
  },
  ldapOptions: {
    server: {
      url: 'ldap://***:389',
      bindDN: '',
      bindCredentials: '',
      searchBase: '',
      searchFilter: '...(user={{username}})...',
    },
  },
  repositoryUrl: 'https://osm-measure.geog.uni-heidelberg.de',
  apiUser: {
    prefix: 'https://',
    main: (id, port) => `osm-measure.geog.uni-heidelberg.de/user/${port}/api/${id}/grid`,
  },
  apiPublic: {
    prefix: 'https://',
    main: (id, port) => `osm-measure.geog.uni-heidelberg.de/api/${id}/grid`,
  },
  sparqlEndpoint: 'https://osm-measure.geog.uni-heidelberg.de/sparql',
}
