# loka

<!-- TABLE OF CONTENTS -->

- [loka](#loka)
  - [About The Project](#about-the-project)
    - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [License](#license)
  - [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

![LOKA Location](/documentation/loka.png)

A web app for sharing locations \
Check the website here: \
https://loka-location.herokuapp.com/
### Built With
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)



<!-- GETTING STARTED -->
## Getting Started


### Prerequisites

* npm
```sh
npm install npm@latest -g
```

### Installation
1. Get google map API key at [HERE](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. Create a MongoDB URI
3. Clone the repo
```sh
git clone https://github.com/siaolichi/loka-location
```
2. Install NPM packages
```sh
npm install
```
4. Create a file `.env` in the root folder and enter Mongo URI and JWT secret word in the file
```
MONGO_URI=[YOUR_MONGO_URI]
JWT_SECRET=[A_RANDOM_STRING]
```
5. Create a file `.env` in the client folder and enter the google map api key
```
REACT_APP_MAP_API_KEY=[YOUR_GOOGLE_API_KEY]
```
6. run the project <3
```sh
npm run dev
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Hisao Li-Chi - [@chichisiao](https://twitter.com/your_username) - [https://hsiao-li-chi.com](https://hsiao-li-chi.com)

Project Link: [https://loka-location.herokuapp.com](https://loka-location.herokuapp.com)
