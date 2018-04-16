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
}
