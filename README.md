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
              "exercises": [{},...],
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
          #### **NOTE**: `date` must be in the form yyyy-mm-dd
          #### **OPTIONAL ARGUMENTS**: `description`
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": "calorie data successfully added",
              "c_id": x
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
          #### **NOTE**: `date` must be in the form yyyy-mm-dd
          #### **OPTIONAL ARGUMENTS**: `description`, `sets`, `reps`
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": "exercise data successfully added",
              "e_id": x
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
  6. `DELETE /api/calories`
       ## **Use Case**: When you want to delete a food a specific day
       - [x] Running on Heroku
       - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            c_id: INTEGER
            ```
          #### **NOTE**: c_id is the id of the specific food you want to delete
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": `Calorie with c_id '${c_id}' deleted`
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
  7. `DELETE /api/exercises`
       ## **Use Case**: When you want to delete a food a specific day
       - [x] Running on Heroku
       - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            e_id: INTEGER
            ```
          #### **NOTE**: e_id is the id of the specific exercise you want to delete
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": `Exercise with e_id '${e_id}' deleted`
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
  8. `DELETE /api/user`
      ## **Use Case**: When you want to delete a food a specific day
       - [x] Running on Heroku
       - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            N/A: NO BODY NEEDED, ONLY AUTH TOKEN.
            ```
          #### **NOTE**: Do not put any body on the request, just use the auth token
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": "User successfully deleted"
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
  9. `POST /api/roleModel`
      ## **Use Case**: When you want to update the role model of a user
       - [x] Running on Heroku
       - request:
          - HTTP header:
            ```
            "Content-Type": "application/json"
            "Authorization": "Bearer ${token}"
            ```
          - request body:
            ```
            role_model: STRING
            ```
      - response (JSON)
        - SUCCESS (http status code: `200`)
          ```
          {
              "Success": `Role model updated to '${role_model}'`}
          }
          ```
        - FAILED (http status code: `4XX`)
          ```
          {
               "error": $ERROR_MESSAGE
          }
          ```
