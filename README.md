<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">Flight Booking System (Imdiyo Airline)</h1>

<p align="center">
  An in-memory flight management system for internal airline operations. Built with <a href="https://nestjs.com/" target="_blank">NestJS</a>, this backend handles user registration, flight management, seat booking with concurrency control, fare calculation, and booking status management.
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Features

- Multi-class seat management (Economy, Business, First Class)
- In-memory data stores (no external DB required)
- Fare calculation per seat class
- Booking creation and cancellation with concurrency safety (mutex)
- Immutable seat map after booking begins
- Real-time seat availability tracking
- User and Flight management
- Basic input validation with 'class-validator'

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
