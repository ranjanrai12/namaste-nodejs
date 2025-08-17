# DevTinder APIs

## authRouter

- /signUp || **POST**

- /login || **POST**

- /logout || **POST**

## profileRouter

- /profile/view || **GET**

- /profile/update || **PATCH**

- /profile/changePassword || **PATCH** `Forgot Password`

## connectionRequestRouter

- /request/send/:status/:requestId || **POST**

- /request/review/:status/:requestId || **POST**

## userRouter

- /user/requests/received || **GET**

- /user/connection || **POST**

- /user/feeds || **GET**


Status: `ignored`, `interested`, `accepted`, `rejected`

