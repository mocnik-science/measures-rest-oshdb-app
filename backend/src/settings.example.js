module.exports = {
  localUsers: () => ({
    // 'user': 'password',
  }),
  ldapOptions: () => ({
    server: {
      url: 'ldap://***:389',
      bindDN: '',
      bindCredentials: '',
      searchBase: '',
      searchFilter: '...(user={{username}})...',
    },
  }),
  mapUrl: port => `http://\${window.location.hostname}:{{port}}`,
},
