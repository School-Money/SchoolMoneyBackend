<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Available Endpoints

Here you can find all endpoint that are currently done and you can use them.

| Path                                             | HTTP Method | Status | Description                                               |
| ------------------------------------------------ | ----------- | ------ | --------------------------------------------------------- |
| /auth/register                                   |    POST     |   ✅   | Register account                                          |
| /auth/login                                      |    POST     |   ✅   | Login account                                             |
| /auth/user-details                               |    GET      |   ✅   | Get user details of logged user                           |
| /collections                                     |    POST     |   ✅   | Create collection                                         |
| /collections                                     |    PATCH    |   ✅   | Update collection                                         |
| /collections                                     |    GET      |   ✅   | Get all collections for parent                            |
| /collections/:collectionId                       |    GET      |   ✅   | Get collection details                                    |
| /collections/:collectionId                       |    DELETE   |   ✅   | Close collection                                          |
| /collections/:collectionId/logo                  |    PATCH    |   ✅   | Change collection's logo                                  |
| /collections/:collectionId/logo                  |    GET      |   ✅   | Get collection's avatar file                              |
| /classes                                         |    POST     |   ✅   | Create class                                              |
| /classes                                         |    GET      |   ✅   | Get classes for parent                                    |
| /classes/:classId/parents                        |    GET      |   ✅   | Get parents in a class                                    |
| /classes/invite                                  |    GET      |   ✅   | Get inviteCode to class by treasurerId                    |
| /classes/passTreasurer                           |    PATCH    |   ✅   | Pass treasurer from parent to other parent                |
| /classes/details                                 |    POST     |   ✅   | Get details about class                                   |
| /children                                        |    POST     |   ✅   | Create child                                              |
| /children                                        |    PATCH    |   ✅   | Update child                                              |
| /children                                        |    GET      |   ✅   | Get children for parent                                   |
| /children/:childId                               |    DELETE   |   ✅   | Delete child                                              |
| /children/:childId/avatar                        |    PATCH    |   ✅   | Change child's avatar                                     |
| /children/:childId/avatar                        |    GET      |   ✅   | Get child's avatar file                                   |
| /payments                                        |    GET      |   ✅   | Get payments in parent's children classes                 |
| /payments                                        |    POST     |   ✅   | Create payment                                            |
| /payments/withdraw                               |    POST     |   ✅   | Withdraw payment                                          |
| /payments/parent                                 |    GET      |   ✅   | Get payments created by parent                            |
| /parents/:classId                                |    GET      |   ✅   | Get parents in class                                      |
| /parents/avatar                                  |    PATCH    |   ✅   | Change parent's avatar                                    |
| /parents/avatar                                  |    GET      |   ✅   | Get parent's avatar file                                  |
| /parents/balance                                 |    PATCH    |   ✅   | Update parent's account balance                           |
| /admin/parents                                   |    GET      |   ✅   | Get all parents                                           |
| /admin/parents/block/:parentId                   |    PATCH    |   ✅   | Block/unblock parent's account                            |
| /admin/classes                                   |    GET      |   ✅   | Get all classes                                           |
| /admin/collections/block/:collectionId           |    PATCH    |   ✅   | Block/unblock collection                                  |
| /admin/collections                               |    GET      |   ✅   | Get all collection                                        |
| /admin/collections/:classId                      |    GET      |   ✅   | Get collections for a class                               |
| /admin/bank-accounts                             |    GET      |   ✅   | Get all bank accounts                                     |
| /admin/children/:collectionId                    |    GET      |   ✅   | Get all children in a collection                          |
| /admin/report/parents/:parentId                  |    GET      |   ✅   | Get a pdf report for a parent                             |
| /admin/report/bank-accounts/:bankAccountId       |    GET      |   ✅   | Get a pdf report for a bank account                       |
| /admin/report/classes/:classId?collectionId      |    GET      |   ✅   | Get a pdf report for a class (may limit to a collection)  |
| /admin/report/collections/:collectionId?childId  |    GET      |   ✅   | Get a pdf report for a collection (may limit to a child)  |
