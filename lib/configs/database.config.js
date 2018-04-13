// /**
//  * Created by lakhe on 3/29/16.
//  */
// (function () {

//     'use strict';

//     module.exports = {
//        //  development: {
//        //      username: 'nodebeatsadmin',
//        //      password: 'nodebeatsadmin#123',
//        //      host: 'localhost',
//        //      port: '27017',
//        //      dbName: 'dbName'
//        //  },
//        //  production: {
//        //      username: 'nodebeatsadmin',
//        //      password: 'nodebeatsadmin#123',
//        //      host: 'localhost',
//        //      port: '27017',
//        //      dbName: 'dbName'

//        // },

// 	development: {
//            username: 'root',
//            password: 'Password',
//            host: 'ds157499.mlab.com',
//            port: '57499',
//            dbName: 'nodebeats'
//        },
//        production: {
//            username: 'root',
//            password: 'Password',
//            host: 'ds157499.mlab.com',
//            port: '57499',
//            dbName: 'nodebeats'

//        },
       
//         test: {
//             username: '',
//             password: '',
//             host: '',
//             port: '',
//             dbName: ''
//         },
//         dbBackup: {
//             opt1: {
//                 type: 'archive',
//                 name: 'prj_nodebeats.archive',
//                 active: false,
//                 gzip: true
//             },
//             opt2: {
//                 type: 'bson',
//                 name: 'prj_nodebeats',
//                 active: true
//             }
//         }
//     };
// })();
/**
 * Created by lakhe on 3/29/16.
 */
(function () {

    'use strict';

    module.exports = {
       //  development: {
       //      username: 'nodebeatsadmin',
       //      password: 'nodebeatsadmin#123',
       //      host: 'localhost',
       //      port: '27017',
       //      dbName: 'dbName'
       //  },
       //  production: {
       //      username: 'nodebeatsadmin',
       //      password: 'nodebeatsadmin#123',
       //      host: 'localhost',
       //      port: '27017',
       //      dbName: 'dbName'

       // },

  development: {
           username: 'root',
           password: 'root',
           host: 'ds046367.mlab.com',
           port: '46367',
           dbName: 'kadence'
       },
       production: {
           username: 'root',
           password: 'root',
           host: 'ds046367.mlab.com',
           port: '46367',
           dbName: 'kadence'

       },


        test: {
            username: '',
            password: '',
            host: '',
            port: '',
            dbName: ''
        },
        dbBackup: {
            opt1: {
                type: 'archive',
                name: 'prj_nodebeats.archive',
                active: false,
                gzip: true
            },
            opt2: {
                type: 'bson',
                name: 'prj_nodebeats',
                active: true
            }
        }
    };
})();