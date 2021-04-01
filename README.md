# Backend Of The Fit Friends Application
## API Layout

### Assumptions
- JWT is expected to be in the Authorization HTTP header using the Bearer schema:
     `Authorization: Bearer ${token}`
- URL for the application is https://fit-friends.herokuapp.com/
     **Prefix ALL enpoints with this url**

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
          email: STRING
          password: STRING
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
               "error": $ERROR_MESSAGE
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
          name: STRING 
          email: STRING
          password: STRING
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
               "error": $ERROR_MESSAGE
          }
          ```
  3. `POST /api/user/info`
      ## **Use Case**: When you want to fetch the user information for a certain day to fill in the user page.
      - [x] Running on Heroku
      - request:
        - HTTP header: 
          ```
          "Content-Type": "application/json"
          "Authorization": "Bearer ${token}"
          ``` 
        - request body:
          ```
          date: STRING
          ```
        **NOTE**: `date` must be in the form yyyy-mm-dd
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "d_id": xx,
              "calories": [{},...],
              "exercise": [{},...],
              "date_": "xxxxx",
              "p_fk": xx
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
  4. `POST /api/user/info/addCalories`
     ## **Use Case**: When you want to add calories for a specific day
     - [x] Running on Heroku
     - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            date: STRING,
            amount: INTEGER,
            description: STRING,
            type: STRING
            ```
          ## **NOTE**: `date` must be in the form yyyy-mm-dd
          ## **OPTIONAL ARGUMENTS**: `description`
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": "calorie data successfully added"
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
          
  5. `POST /api/user/info/addExercises`
     ## **Use Case**: When you want to add calories for a specific day
     - [x] Running on Heroku
     - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            date: STRING,
            amount: DECIMAL,
            description: STRING,
            sets: INTEGER,
            reps: INTEGER
            ```
          ## **NOTE**: `date` must be in the form yyyy-mm-dd
          ## **OPTIONAL ARGUMENTS**: `description`, `sets`, `reps`
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": "exercise data successfully added"
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
