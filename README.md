# **AllDB 2** - The newest version of the AllDB project

<img src="./public/alldb-text.svg">

## **AllDB** is a web project that allows me to store humans data like their images, sex, name, username, social media...


# How to run me?
Before running AllDB locally, you must set up a PostgreSQL database, I recommend using AWS

after doing so, add it to `.env` like that
```toml
DATABASE_URL="..."
```
then run the following
```sh
$ yarn
$ prisma db push
$ prisma generate
$ yarn dev
```
OR
```sh
$ npm install
$ npx prisma db push
$ npx prisma generate
$ npm run dev
```

# Improvements
This version came to improve two specific things over the first version
- Allowing images to be uploaded so that it stores the image url in the database instead of the base64 encoding, because it takes a large amount of time and storage to store.
- Improving the UI to look more fresh by using NextJS

# Notes
Honestly I don't think changing the framework was a wise decision because It was not really productive to work using NextJS, for this reason, the next version(if there is one) might use Remix again

# Advices for V3
- Design the UI before the coding
- Build an API to handle errors better
- Add more features like adding videos, documents...

# Contact
Feel free to contact me at unknown989@proton.me
