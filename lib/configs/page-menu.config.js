/**
 * Created by lakhe on 12/10/16.
 */

(function (menuConfigs) {
    'use strict';

    menuConfigs.getNavigationMenus = function (app) {
        return [
            {
                nav: 'Home -',
                navUrl: '/'
            },
            {
                nav: 'About Us -',
                navUrl: '/about-us'
            },
              {
                nav: 'Products -',
                navUrl: '/testimonial'
            },
            {
                nav: 'stores -',
                navUrl: '/contact-us'
            },
            {
                nav: 'News/Media -',
                navUrl: '/news'
            },
            {
                nav: 'Blog -',
                navUrl: '/blogs'
            },
            {
                nav: 'Contact Us -',
                navUrl: '/contact'
            },
            // {
            //     nav: 'Team',
            //     navUrl: '/team-members'
            // },
            // {
            //     nav: 'Events',
            //     navUrl: '/events'
            // },
            // {
            //     nav: 'Partners',
            //     navUrl: '/partners'
            // },
            
            // {
            //     nav: 'Login -',
            //     navUrl: (app.get('env') === "development" ? "http://localhost:4200/login" : "admin/login")
            // }

            ];
    };
})(module.exports);

