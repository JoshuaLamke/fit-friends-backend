# Backend Of The Fit Friends Application
## API Layout

### Assumptions
- JWT is expected to be in the Authorization HTTP header using the Bearer schema:
     `Authorization: Bearer ${token}`

### End Points:

   1. `POST /api/user/login` 
      ## **Use Case**: When you want to log in a user.
      - [x] Running on Heroku
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
      ## **Use Case**: When you want to sign up a user.
      - [x] Running on Heroku
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
  3. `POST /api/user/info`
      ## **Use Case**: When you want to fetch the user information for a certain day to fill in the user page.
      - [x] Running on Heroku
      - request:
        - HTTP header: 
          ```
          "Content-Type": "application/json"
          ``` 
        - request body:
          ```
          date_: $DATE_:STRING
          ```
        **NOTE**: `date_` must be in the form yyyy-mm-dd
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "d_id": xx,
              "calories": xxx,
              "total_calories": xxx,
              "exercise": xxx,
              "total_exercise": xxx,
              "date_": "xxxxx",
              "p_fk": xx
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
          "message": $ERROR_MESSAGE
          }
          ```
