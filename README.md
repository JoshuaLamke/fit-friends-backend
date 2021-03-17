# Backend Of The Fit Friends Application
## API Layout

### Assumptions
- JWT is expected to be in the Authorization HTTP header using the Bearer schema:
     `Authorization: Bearer ${token}`

### End Points:

   1. `POST /api/user/login` 
      - [ ] Running on Heroku
      - request:
        - HTTP header: 
          ```
          "Content-Type": "application/json"
          ``` 
        - request body:
          ```
          email: $EMAIL:STRING
          password: $PASSWORD:STRING
          ```
        **NOTE**: `email` must be unique
      - response (JSON)
        - SUCCESS (http status code: `201`)
          ```
          {
            "message": "Success",
            "data": {
                "p_id": x,
                "name": "xxxxxxx",
                "email": "xxxxxxxxxxxxx",
                "password": "TheHashedPassword"
            },
            "Token": "TheAuthenticationToken"
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
          "message": $ERROR_MESSAGE
          }
          ```
  2. `POST /api/user/signup`
      - [ ] Running on Heroku
      - request:
        - HTTP header: 
          ```
          "Content-Type": "application/json"
          ``` 
        - request body:
          ```
          name: $NAME:STRING 
          email: $EMAIL:STRING
          password: $PASSWORD:STRING
          ```
        **NOTE**: `email` must be unique
      - response (JSON)
        - SUCCESS (http status code: `201`)
          ```
          {
            "message": "Success",
            "data": {
                "p_id": x,
                "name": "xxxxxxx",
                "email": "xxxxxxxxxxxxx",
                "password": "TheHashedPassword"
            },
            "Token": "TheAuthenticationToken"
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
          "message": $ERROR_MESSAGE
          }
          ```
