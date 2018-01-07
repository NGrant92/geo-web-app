# Geo Web App
## Assignment #2 for Web Development

#### Author Details:

**Name:** Niall Grant ([github.com/NGrant92](https://github.com/NGrant92))

**Github repo:** https://github.com/NGrant92/geo-web-app

**Heroku Link:** https://afternoon-peak-51691.herokuapp.com/

#### Description:

Geocaching is a form of Orienteering or 'treasure hunting' that is run and 
maintained by the players themselves. The players can put a "cache" wherever 
they think is appropriate and set a location to it online, others can go visit 
it and usually leave notes for the next visitors.

#### API

Api routes and functions have been integrated, allowing for other applications 
connect to perform CRUD on the mongo database store on mlab. This allows for other client side
applications to access the database.

Every API function (aside from 2 functions) require a Json Web Token(JWT) in order to use the function.
The JWT is an encrypted cookie that stores the Logged User ID and Email to ensure the user recieves the
correct information and is pretected from certain security risks.


#### Preloaded Accounts:

##### Members:

    Email: homer@simpson.com
    Password: secret

    Email: marge@simpson.com
    Password: secret

    Email: bart@simpson.com
    Password: secret

##### Admin:

    Email: admin@simpson.com
    Password: secret
    Note: Admin account only accessible from web app side and not from API


#### Software Used:

- [Node Hapi](https://hapijs.com/)
- [JWT](https://jwt.io/)
- [Webstorm](https://www.jetbrains.com/webstorm/)
- [BCrypt](https://www.npmjs.com/package/bcrypt)
- [Cloudinary](https://cloudinary.com/)
- [MLab](https://mlab.com/)
