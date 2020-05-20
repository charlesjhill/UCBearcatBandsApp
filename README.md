# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
The UCBBAMA (UC Bearcat Bands Asset Management App) is a web-based inventory management application. The backend of the application is a  database-backed web API. We're currently using [Django 3](https://www.djangoproject.com/). 
  - The api part is facilitated by [Django-Rest-Framework](https://www.django-rest-framework.org/). A more experimental avenue for the web API is to use something like [Graphene-Django](https://github.com/graphql-python/graphene-django) to enable [GraphQL](https://graphql.org/) queries instead of the usual REST ones.
  - P.S., the way the Django project is currently structured is not something I'm strongly attached to and I'm willing to move the "app" folder (`bands`) outside of the project folder (`ucbearcatbandsproject`) if we determine that'd be easier to work with.

For frontends, we are doing two UIs:
- A SPA web app being written in [Angular 9](https://angular.io) using a mix of [Bootstrap](https://getbootstrap.com/) CSS and [Material](https://material.angular.io/) components.
- An iOS only mobile app, necessarily written using Swift. See details below
  
# Set up Information
## The Django Backend
1. Make sure you have at least python 3.7 installed.
2. Install `pipenv` using `pip` to facilitate package downloads [Optional].
3. In the cloned directory for the backend (the one with `manage.py`), run `pipenv install` to download all the dependencies from the pipfile.
4. Run `pipenv shell` to activate the virtual environment you just made with the above line.
5. If there isn't a `db.sqlite3` in the directory, run the following command now:  
   `python manage.py migrate`
6. To browse the current API, run `python manage.py runserver` and navigate in browser to `localhost:8000/api/v1/`

## Angular Frontend
1. Make sure you have [Node.js](https://nodejs.org) installed. You can check this by running `node -v` from a terminal. We are mostly in this for the package manager, `npm`.
2. Install the Angular CLI globally with the command `npm install -g @angular/cli`. This is used to build the angular app and facilitate development in other ways.
3. Navigate to the angular directory in the project (the one with `angular.json`)
4. Execute the command `npm install` in this directory to download all the javascript dependencies for the project.
5. Execute `ng serve` to open the app at `localhost:4200` (ensure the backend running first, however, or you won't be able to login or register)

### To edit the frontend app (with VS Code)
1. Install [VS Code](https://code.visualstudio.com/)
2. Grab some extensions (this is what Chase uses)
   - Angular Language Service
   - AngularDoc for Visual Studio Code
   - angular2-switcher
   - TSLint
3. If the app is opened using `ng serve` (as instructed above), any saved changes should cause the app to refresh and live update.

### On debugging
- Using the browser devtools are really helpful; Especially tabs for:
  - `Inspector`: For seeing the pages generated HTML and stylings. I mostly use it for fiddling with css.
  - `Console`: Any errors or log emssage in the app will be spit out here. If something isn't working, take a look at this.
  - `Network`: Useful to verify and inspect API requests and responses being made
  - `Storage`: Not as useful as the other tabs, but if you want to make sure something is being stored (like the current user information), this is the place.
- Using the debugger functionality of VS Code is really nice, and you'll want to get it working if you'd like to use breakpoints. Instructions [here](https://code.visualstudio.com/docs/editor/debugging)

## iOS App Setup
Since the iOS app is really just going to be a frontend wrapper for our web API, I'll go ahead and suggest you set up a backend server. The app won't really do much if it can't ping that.

After you've done that, do the following to work on the iOS app:
1. Have a Mac (or run macOS)
2. Download the Xcode IDE.
3. Install [CocoaPods](https://cocoapods.org), used as a package manager in the same vein as `pip` for Python.
4. Inside the "MobileApp" directory, you'll find a file named `Podfile`; this specifies our dependencies. Run `pod install` in the terminal to install them.
5. Open the `MobileApp.xcworkspace` file in Xcode, and everything should be ready to go. Note that you don't use `MobileApp.xcodeproj`, it's not tied into the CocoaPods dependencies.

Ben has some lingering concerns about code signing (requires an iCloud account and he's set it up to use his), but this should more or less work. If you run into issues consult Ben.
