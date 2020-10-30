# Swoopin Recruitment Test
This is the mono-repo for Swoopin recruitment test

## Getting started
First, install npm dependencies from root project: `npm i`

Then, install npm dependencies from API sub project: `cd api && npm i && cd ..`

Then, install npm dependencies from Back Office sub project: `cd backoffice && npm i && cd ..`

Then, install [pika](https://www.npmjs.com/package/@pika/pack), our build manager, globally (maybe `sudo` is necessary): `npm i -g @pika/pack @pika/cli`

You can now build or watch individual projects from root project (run following commands in distinct terminal windows) :
- `npm run dev:api` => run the `API` in dev mode with port 10000 (auto restart when files modified)
- `npm run dev:backoffice` => run the `Back Office` with port 8000 : http://localhost:8000 (Gatsby reload modified files automatically).
The user and password are `admin@swoopin.green` / `1234`

## Repo Structure
Here are the files and folders you can see in VS Code:
- `conf` => the configuration files for the dev environment of API and Back Office.
- `api` => the API (Fastify server)
  - `src`
    - `index.ts` => the main launcher
    - `routes` => API routes 
    - `services` => services with business implementation
    - `utils` => some utils functions
- `backoffice` => the Back Office application (Gatbsy Web Application)
  - `src`
    - `components` => all React components
      - `layout` => layout specific component (login, connected, tab and top bar, ...)
      - `pages` => pages components (page implementation)
         - `connected` => specific page components / implementation when connected (home, vehicles, map, ...)
         - `login` => specific login page component
      - `shared` => shared components used by multiple pages (ex: a vehicle information)
    - `hooks` => some React global hooks (back-handler, responsive, ...)
    - `pages` => the main pages (the implementation of page is in components) 
    - `resources` => all resources (icons, images, logo, ...)
    - `state` => the global state (MobX)
      - `entities` => specific model state (profile, session, vehicle)
      - `utils` => basic utils state (configuration and layout)
    - `style` => shared CSS styles
    - `utils` => => some utils functions
- `scripts` => some utils scripts (run and configuration)
- `screenshots` => screenshots of finished application
- `utils` => => some utils files (eslint configuration)

## API code Structure
In API, all routes (api/src/routes) contains all routes, which are mounted in main launch script (api/src/index.ts).
Each API can use one or more services (api/src/services).
No database used in API, simply a static account (login / password) and vehicles array defined
in configuration file (conf/application.yml).

## Back office code Structure
In Backoffice, all pages (backoffice/src/pages) contains only a specific component (backoffice/src/components).
This component contains React implementation and can use global state (backoffice/src/state) for some interactions.
Each component use a specific CSS style (ex: map.tsx => map.scss).

---
# Tests steps - Total duration is 3 hours

# Step 1 : Authentication (30 mn)
Objective : implements API login route on path `/login` and implements API call in Back Office to login

A minimal Fastify route is described below :

```javascript
import Logger from '@harmonyjs/logger'
import EncryptionService from 'services/encryption'

const logger = Logger({
    name: 'AccountLogin',
    configuration: {
        console: true,
    },
})

const LoginRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/login',
        async handler(req: any, res: any) {
           // Implementation
        },
    })
    next()
}

export default LoginRoute
```

API Notes :
- Create a POST `/login` route
- The account (with email and password) is static (no db) and accessible from configuration
  as property in request : `req.conf.account`
- To check encrypted password, use EncryptionService as below (userId is salt) :
  `EncryptionService.comparePassword({ password: TheRequestPassword, salt: AccountId, encrypted: AccountEncryptedPassword })`              
- The token is generated with `server.jwt.sign({ payload })` and payload
  is `{ userId: account.id, name: account.name, isAdmin: false }`
- Response must send code HTTP code 200 and token and format is `{ token: 'the JWT token' }`
- Implements errors :
  - Internal error : status 500, payload : `{ statusCode: 500, error: 'Internal Server Error' })`
  - User not found : status 401, payload : `{ statusCode: 401, error: 'Bad Request', message: 'user_not_found' })`
  - Bad password : status 401, payload : `{ statusCode: 401, error: 'Bad Request', message: 'wrong_credentials' })`
  
Back Office Notes :
- The API call implementation is in session state (API client ready to make request)
- After getting the token, updateToken with token value must be called
- If error, an Error must be thrown with response message (otherwise 'internal_error' as default message)


# Step 2 : Vehicles list (30 mn)
Objective : getting list of vehicles on path `/vehicles` and implements API call in Back Office to display
vehicles list

API Notes :
- Create a GET `/vehicles` route
- Inside Fastify `server.route` (ex: `server.route({method: 'GET', ...})`, `preHandler` method is necessary to validate
  authentication. Use following code : `preHandler: server.auth([server.authenticateAccount]),`
- Response is an array of vehicles, avoid to return raw vehicle data : properties `polyline`, `defaultSpeed`,
  `defaultTemperature`, `line` and `distance` must not be present in data.
  These vehicles are available in VehicleService.
  
Back Office Notes :
- The API call implementation is in vehicles state, method is `updateVehicles` (API client ready to make request)
- Send token as Bearer `Authorization` header
- After getting vehicles, use `updateList method


# Step 3 : Set a vehicle online (10 mn)
Objective : update state of a vehicle to 'online' in vehicles list page

API Notes :
- Create a POST `/vehicles/online/{id_of_vehicle}` route
- Same constraints as step 2 for authentication
- If a vehicle found and process success, response is an empty object `{}`. Else, return a response with
  status code 500 and payload `{ statusCode: 500, error: 'Internal Server Error' }`
- Add a method in VehicleService to set a particular vehicle online (property `online` to `true`)

Back Office Notes :
- The API call implementation is in vehicles state. For example :
```javascript
@action.bound async setOnline(id: string) {
    // FIXME
}
```
- Add a button 'Connecter' inside shared connected component 'vehicle.tsx' in buttons group (at the end of component)
  and call the previous method.
  Use component `components/shared/inputs` and style and condition to hide button when vehicle is already online
  is described below :
```javascript
className={cx('__button', { '__button--hidden': online })
```

# Step 4 : Set a vehicle offline (5 mn)
Objective : update state of a vehicle to 'offline' in vehicles list page

API Notes :
- Create a POST `/vehicles/offline/{id_of_vehicle}` route
- Same constraints as step 2 for authentication
- If a vehicle found and process success, response is an empty object `{}`. Else, return a response with
  status code 500 and payload `{ statusCode: 500, error: 'Internal Server Error' }`
- Add a method in VehicleService to set a particular vehicle online (property `online` to `false`)

Back Office Notes :
- The API call implementation is in vehicles state, as described in step 3
- Add a button 'Déconnecter' inside shared connected component 'vehicle.tsx' in buttons group (at the end of component)
  and call the previous method. Use same button comoponent and style as step 3
  and modify condition to hide button when vehicle is offline

# Step 5 : Add speed and temperature information (15 mn)
Objective : add vehicle speed and information in vehicles list

API Notes :
- Speed and temperature already present in data 

Back Office Notes :
- The icons are IconSpeed and IconTemperature
- Take example from others values / indicators for style and adapt `vehicle.scss`
- The type of vehicle in state and component must be adapted

# Step 6 : Add plate information (5 mn)
Objective : add vehicle plate information in vehicles list

- Adapt API and Back office to add plate information
- The plate must be displayed near vehicle type, in parentheses (ex: `Camion (MT-042-DF`) 

# Step 7 : Add last update information (10 mn)
Objective : add vehicle last update date and time information in vehicles list

- Adapt API and Back office to display last date and time of vehicle update with f
- The API must return a `Moment ISOString`
- On Back Office vehicles list, use following format : `DD/MM/YYYY-HH:mm:ss` and display date
  under vehicle type and plate with `__vehicle-update` CSS class name

# Step 8 : Add map vehicle list (30 mn)
Objective : add vehicles list (all, offline & online) on right side bar

- Create a child vehicle component with scss (.tsx and scss files)
- Each vehicle on right side bar contains 3 lines :
  - {name}
  - {vehicle} ({plate})
  - {speed} km/h - {temperature} °C
- The component which receive the list of child vehicles is at bottom of pages :
```javascript
<div className={cx('__sidebar')}>
  <h2 className={cx('__title')}>Véhicules</h2>
  <div className={cx('__list')}>
    {/* FIXME */ }
  </div>
</div>
```      
# Step 9 : Add map vehicle locations (20 mn)
Objective : add all real location of vehicles on map

- The map contains two layers (offline and online) which contains respective locations
- A location (icon on map) is a `Feature 
- For each layer, create a list of MapBox React Feature component inside respective layer
- Important : coordinates format is (longitude, latitude) while vehicle location in data is (latitude, longiture))
  Example of a map box feature :
```javascript
<Feature
  key={vehicle_id}
  coordinates={location_array}
  onMouseEnter={() => mapRef.map.getCanvas().style.cursor = 'pointer'}
  onMouseLeave={() => mapRef.map.getCanvas().style.cursor = ''}
  onClick={(e) => onMapVehicleClick(e, vehicle.id)}
/>
```
# Step 10 : Add map vehicle focus (10 mn)
Objective : when user clicked on a vehicle in right side list, map focus on vehicle

- Add a click call callback for each vehicle on right side bar
- To make a focus on a specific location on map, use follwwing code :
```javascript
mapRef.map?.flyTo({
    center: [vehicle.location[1], vehicle.location[0]],
    essential: true,
    zoom: 13,
    speed: 0.5,
    curve: 1,
});
``` 

# Step 11 : Add colors for vehicles list (15 mn)
Objective : inside right side list of vehicles, use a color to make a difference between online and offline vehicles

- Add classes in style of vehicle component)
- Add a red color for offline vehicles
- Add a green color for online vehicles
