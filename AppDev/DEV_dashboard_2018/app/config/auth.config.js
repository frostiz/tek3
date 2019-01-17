module.exports = {
    'facebookAuth' : {
        'clientID'      : '304827116998996',
        'clientSecret'  : 'c69c27c8ea97db0fdeff54566d7188bd',
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name']
    },
    'twitterAuth' : {
        'consumerKey'       : 'PcRyx4ppFd1VcPlWa6ZPXnS5i',
        'consumerSecret'    : 'KrlNTyiBkPl0bwq1vvBeFbdLtE9VJ6sDm5dmiEaHKNbL03dkRQ',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID'      : '923976091534-denrsbcuogaabd09qa25pgloqjtqmhb4.apps.googleusercontent.com',
        'clientSecret'  : '6ZAIBcD5VJGQWMINR0_jNZQo',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
};