# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

<!-- Basic -->

## Get Basic Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    | /basic/data |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |
| startTime      | varchar         | 1000       |

### Response Body

```json
{
    "result": [
        {
            "id": number,
            "performanceId": bigint,
            "festivalId": bigint,
            "startTime": VARCHAR,
            "endTime": VARCHAR,
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /basic/data?festivalId=1000000001
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1,
            "performance_id": "1000000001",
            "festivalId": "1100000001",
            "start_time": 1000,
            "end_time": 1100
        }
    ]
}
```

### Sample Error

```json
{
  "error": "invalid input syntax for integer: \"NaN\"",
  "code": 500
}
```

```json
{
  "error": "No result",
  "code": 404
}
```

## Insert Basic Data

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | INSERT        |
| Endpoint    | /basic/insert |

### Parameters

- NIL

### Response Body

```json
{
  "result": string
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST http://localhost:3000/basic/insert
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1,
            "performance_id": "1000000001",
            "festivalId": "1100000001",
            "start_time": 1000,
            "end_time": 1100
        }
    ]
}
```

### Sample Error

```json
{
  "error": "duplicate key value violates unique constraint \"performance_performance_id_key\"",
  "code": 500
}
```

```json
{
  "error": "Unexpected token ] in JSON at position 196",
  "code": 400
}
```

## Get Basic Result

| attribute   | value         |
| ----------- | --------------|
| HTTP Method | GET           |
| Endpoint    | /basic/result |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |

### Response Body

```json
{
    "result": [
        {
            "performanceId": bigint,
            "startTime": VARCHAR,
            "endTime": VARCHAR,
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /basic/result?festivalId=1100000001
```

### Sample Response

```json
{
    "result": [
        {
            "performance_id": "1000000001",
            "start_time": 1000,
            "end_time": 1100
        }
    ]
}
```

### Sample Error

```json
{
  "error": "input entered is not number",
  "code": 400
}
```

```json
{
    "error": "input entered is not 10 digits",
  "code": 400
}
```  

```json
{
    "error": "No Result",
  "code": 404
}
```  

```json
{
  "error": "Empty input entered",
  "code": 400
}
```  

```json
{
  "error": "Missing field",
  "code": 400
}
```  

<!-- Advance -->
## Get Advance Data

| attribute   | value         |
| ----------- | --------------|
| HTTP Method | GET           |
| Endpoint    | /advance/data |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |
| startTime      | varchar         | 1000       |
| endTime        | varchar         | 1100       |

### Response Body

```json
{
    "result": [
        {
            "id": number,
            "performance_id": bigint,
            "festival_id": bigint,
            "startTime": varchar,
            "endTime": varchar,
            "popularity": number,
            "no_of_rows": number
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
Get http://localhost:3000/advance/data?festivalId=1100000001
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1,
            "performanceId": "1000000001",
            "festivalId": "1100000001",
            "startTime": 1000,
            "endTime": 1100,
            "popularity": 1,
            "no_of_rows": "3"
        }
    ]
}
```

### Sample Error

```json
{
  "error": "invalid input syntax for integer: \"NaN\"",
  "code": 500
}
```

```json
{
  "message": "No result.",
  "status": 404
}
```

## Insert Advance Data

| attribute   | value           |
| ----------- | --------------- |
| HTTP Method | POST            |
| Endpoint    | /advance/insert |

### Parameters

- NIL

### Response Body

```json
{
  "result": string
}
```


### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST http://localhost:3000/advance/insert
```

### Sample Response

```json
{
    "result": "sucess"
}
```

### Sample Error

```json
{
  "error": "duplicate key value violates unique constraint \"performance_performance_id_key\"",
  "code": 500
}
```

```json
{
  "error": "Unexpected token ] in JSON at position 196",
  "code": 400
}
```

## Get Advance Result

| attribute   | value            |
| ----------- | -----------------|
| HTTP Method | GET              |
| Endpoint    | /advance/result  |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |

### Response Body

```json
{
    "result": [
        {
            "performanceId": BIGINT,
            "startTime": VARCHAR,
            "endTime": VARCHAR,
            "popularity": INT
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /advance/result?festivalId=1000000003
```

### Sample Response

```json
{
    "result": [
        {
            "performance_id": "1000000008",
            "start_time": 1000,
            "end_time": 1100,
            "popularity": 1
        }
    ]
}
```

### Sample Error

```json
{
  "error": "input entered is not number",
  "code": 400
}
```

```json
{
    "error": "input entered is not 10 digits",
  "code": 400
}
```  

```json
{
    "error": "No Result",
  "code": 404
}
```  

```json
{
  "error": "Empty input entered",
  "code": 400
}
```  

```json
{
  "error": "Missing field",
  "code": 400
}
``` 

## Get Advanced Data (advance feature)

| attribute   | value          |
| ----------- | ---------------|
| HTTP Method | GET            |
| Endpoint    | /advanced/data |

### Parameters

| parameter      | datatype        | example                |
| -------------  | --------------- | -----------------------|
| festivalId     | 10 digit number | 1100000001             |
| startTimeDate  | varchar         | 2020/07/01 10:00       |
| endTimeDate    | varchar         | 2020/07/01 11:00       |

### Response Body

```json
{
    "result": [
        {
            "id": number,
            "performance_id": bigint,
            "festival_id": bigint,
            "startTimeDate": varchar,
            "endTimeDate": varchar,
            "popularity": number,
            "no_of_rows": number
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
Get http://localhost:3000/advanced/data?festivalId=1100000001
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1,
            "performanceId": "1000000001",
            "festivalId": "1100000001",
            "startTimeDate": "2020/07/01 10:00",
            "endTimeDate": "2020/07/01 11:00",
            "popularity": 1,
            "no_of_rows": "18"
        }
    ]
}
```

### Sample Error

```json
{
  "error": "invalid input syntax for integer: \"NaN\"",
  "code": 500
}
```

```json
{
  "message": "No result.",
  "status": 404
}
```

## Insert Advanced Data

| attribute   | value           |
| ----------- | --------------- |
| HTTP Method | POST            |
| Endpoint    | /advanced/insert |

### Parameters

| parameter      | datatype        | example                |
| -------------  | --------------- | -----------------------|
| performanceId  | 10 digit number | 1000000001             |
| festivalId     | 10 digit number | 1100000001             |
| startTimeDate  | varchar         | 2020/07/01 10:00       |
| endTimeDate    | varchar         | 2020/07/01 10:00       |
| popularity     | integer         | 1                      |

### Response Body

```json
{
  "result": string
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST http://localhost:3000/advance/insert
```

### Sample Response

```json
{
    "result": "sucess"
}
```

### Sample Error

```json
{
  "error": "duplicate key value violates unique constraint \"performance_performance_id_key\"",
  "code": 500
}
```

```json
{
  "error": "Unexpected token ] in JSON at position 196",
  "code": 400
}
```

## Get Advanced Basic Result

| attribute   | value                 |
| ----------- | ----------------------|
| HTTP Method | GET                   |
| Endpoint    | /advanced/basicResult |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |

### Response Body

```json
{
    "result": [
        {
            "performanceId": bigint,
            "startTimeDate": VARCHAR,
            "endTimeDate": VARCHAR,
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /advanced/basicResult?festivalId=1100000002
```

### Sample Response

```json
{
    "result": [
        {
          "performanceId": 1000000004,
          "startTimeDate": "2020/07/01 10:00",
          "endTimeDate": "2020/07/01 11:00",
        }
    ]
}
```

### Sample Error

```json
{
  "error": "input entered is not number",
  "code": 400
}
```

```json
{
    "error": "input entered is not 10 digits",
  "code": 400
}
```  

```json
{
    "error": "No Result",
  "code": 404
}
```  

```json
{
  "error": "Empty input entered",
  "code": 400
}
```  

```json
{
  "error": "Missing field",
  "code": 400
}
```  

**************************************

## Get Advance Result

| attribute   | value                    |
| ----------- | -------------------------|
| HTTP Method | GET                      |
| Endpoint    | /advanced/advanceResult  |

### Parameters

| parameter      | datatype        | example    |
| -------------  | --------------- | ---------- |
| festivalId     | 10 digit number | 1100000001 |

### Response Body

```json
{
    "result": [
        {
            "performanceId": BIGINT,
            "startTimeDate": VARCHAR,
            "endTimeDate": VARCHAR,
            "popularity": INT
            ...
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /advanced/advanceResult?festivalId=1000000001
```

### Sample Response

```json
{
    "result": [
        {
          "performanceId": 1000000003,
          "startTimeDate": "2020/07/01 10:30",
          "endTimeDate": "2020/07/01 11:30",
          "popularity": 10
        }
    ]
}
```

### Sample Error

```json
{
  "error": "input entered is not number",
  "code": 400
}
```

```json
{
    "error": "input entered is not 10 digits",
  "code": 400
}
```  

```json
{
    "error": "No Result",
  "code": 404
}
```  

```json
{
  "error": "Empty input entered",
  "code": 400
}
```  

```json
{
  "error": "Missing field",
  "code": 400
}
``` 

## Reset Basic Table

| attribute   | value        |
| ----------- | -------------|
| HTTP Method | GET          |
| Endpoint    | /reset/basic |

### Parameters

- NIL

### Response Body

```json
{
    "success": string
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
Get http://localhost:3000/reset/basic
```

### Sample Response

```json
{
    "success": true
}
```

### Sample Error
- NIL

## Reset Advance Table

| attribute   | value          |
| ----------- | ---------------|
| HTTP Method | GET            |
| Endpoint    | /reset/advance |

### Parameters

- NIL

### Response Body

```json
{
    "success": string
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
Get http://localhost:3000/reset/advance
```

### Sample Response

```json
{
    "success": true
}
```

### Sample Error
- NIL

## Reset Advanced Table

| attribute   | value          |
| ----------- | ---------------|
| HTTP Method | GET            |
| Endpoint    | /reset/advanced |

### Parameters

- NIL

### Response Body

```json
{
    "success": string
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
Get http://localhost:3000/reset/advanced
```

### Sample Response

```json
{
    "success": true
}
```

### Sample Error
- NIL