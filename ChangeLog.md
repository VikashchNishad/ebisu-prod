# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0 - Major Release Version] - 2016-12-16

### New Implementation
- Responsive html template design integrated with the Content Management System to showcase the data saved in the database using handlebars templating engine
- MongoDB backup either bson or archive backup file restore while deploying the application.

### Upgraded
- Angular 2 version upgraded to v 2.1.0

### Changed
- Changed the old angular 2 app structure with angular cli implementation.
- Easy to run the app in development environment and easy to produce production dist files.
- Improvement in performance and faster loading in the admin app compared to the previous version with significant less network requests
- File structures optimized, removed/merged into very few file for admin app than previous version.
- Code Refractorization and clean-up
- Un-necessary files and folders removed from the project to minimize the project  repo size even smaller.
- Fixed the issue with the logging of user's location while attempting to login.

## [0.4] - 2016-10-28

### Features
- Added Access Token Management.



## [0.3] - 2016-10-06

### Upgrade
- Upgraded all the npm packages to their latest version.

### Features
- Added role based authorization.
- Implemented role based authorization in api.



## [0.2-Beta] - 2016-09-27


### Changed
- Upgraded the Angular version of client app from Angular 2.0-RC4 to Angular 2.0.1



