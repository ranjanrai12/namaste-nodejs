# DevTinder APIs

## Authentication Router (/auth)

| Method   | Endpoint  | Purpose                                      |
| -------- | --------- | -------------------------------------------- |
| **POST** | `/signup` | Register a new user                          |
| **POST** | `/login`  | Authenticate user, return JWT token / cookie |
| **POST** | `/logout` | Logout the user (invalidate token)           |

## Profile Router (/profile)

| Method    | Endpoint    | Purpose                               |
| --------- | ----------- | ------------------------------------- |
| **GET**   | `/view`     | View own profile                      |
| **PATCH** | `/edit`     | Update profile info (except password) |
| **PATCH** | `/password` | Change password                       |

## Connection Router (/request)

| Method   | Endpoint                     | Purpose                                             |
| -------- | ---------------------------- | --------------------------------------------------- |
| **POST** | `/send/:status/:requestId`   | Right-swipe or Left-swipe → show interest / Ignored |
| **POST** | `/review/:status/:requestId` | Accept or reject a received connection request      |

## User Data Router (/user)

| Method  | Endpoint             | Purpose                                                      |
| ------- | -------------------- | ------------------------------------------------------------ |
| **GET** | `/requests/received` | View received connection requests                            |
| **GET** | `/connections`       | List all matched connections (accepted connections)          |
| **GET** | `/feed`              | Fetch batch of profiles (e.g., 20–30 at a time) for swipe UI |

**Status**: `ignored`, `interested`, `accepted`, `rejected`
