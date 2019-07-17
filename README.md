# UCBearcatBandsApp
It's an app for the UC Bearcat Bands

# Architecture
---
The way things are currently swinging, we needed a database-backed web API. We're running this through [Django](https://www.djangoproject.com/) for the web part.
  - The api part is facilitated by [Django-Rest-Framework](https://www.django-rest-framework.org/).
  - P.S., the way the Django project is currently structured is not something I'm strongly attached to and I'm willing to move the "app" folder (`bands`) outside of the project folder (`ucbearcatbandsproject`) if we determine that'd be easier to work with.

For frontends, we are doing two UIs:
- A traditional web application. This is being written in [Angular](https://angular.io) using a mix of [Bootstrap](https://getbootstrap.com/) CSS and [Material](https://material.angular.io/) components.
- An iOS only mobile app, necessarily written using Swift. See details below
  
# Set up Information
---
## The Django Backend
1. Make sure you have python 3.7 installed.
2. Install `pipenv` using `pip` to facilitate package downloads.
3. In the cloned directory for the backend (the one with `manage.py`), run `pipenv install` to grab all the dependencies.
4. Run `pipenv shell` to activate the virtual environment you just made with the above line.
5. If there isn't a `db.sqlite3` in the directory, run the following command now:  
   `python manage.py migrate`
6. Noodle away

## Angular Frontend
1. Make sure you have [Node.js](https://nodejs.org) installed. You can check this by running `node -v` from a terminal. We are mostly in this for the package manager, `npm`.
2. Install the Angular CLI globally with the command `npm install -g @angular/cli`. This is used to build the angular app and facilitate development in other ways.
3. Navigate to the angular directory in the project (the one with `angular.json`)
4. Run the command `npm install` in this directory to install all the javascript dependencies for the project.
5. Run `ng serve` to open the app at `localhost:4200`

### To edit the app (with VS Code)
1. Install VS Code
2. Grab some extensions (this is what I use)
   - Angular Language Service
   - AngularDoc for Visual Studio Code
   - angular2-switcher
   - TSLint
   - Auto Import
3. If the app is opened using `ng serve` (as instructed above), any saved changes should cause the app to live update.

### On debugging
- Using the browser devtools are really helpful; Especially tabs for:
  - `Inspector`: For seeing the pages generated HTML, styling applied to elements, etc.
  - `Console`: Any errors in the app will be spit out here. If something isn't working, take a look at this.
  - `Network`: Useful to verify API requests and responses being made
  - `Storage`: Not as useful as the other tabs, but if you want to make sure something is being stored, this is the place.
- Using the debugger functionality of VS Code is pretty nice. Setting up is easier for Chrome than firefox, but it is worth it if you want access to breakpoints (which you probably do). Look up how to set this up.

## The Blazor Web Frontend
1. Install Visual Studio 2019 (version = latest) and make sure to include the `ASP.NET and web development` workload during installation.
2. Install the latest [NET.Core 3.0 Preview](https://dotnet.microsoft.com/download/dotnet-core/3.0)
3. Install [this](https://marketplace.visualstudio.com/items?itemName=aspnet.blazor) extension and follow any steps not already done to enable Blazor support.
4. Back in VS now, enable usage of .NET Core SDK previews (`Tools` > `Options` > `Environment` > `Preview Features` > `Use previews ...`)
6. Pop open that solution and get cracking!

## iOS App Setup
Since the iOS app is really just going to be a frontend wrapper for our web API, I'll go ahead and suggest you set up a backend server. The app won't really do much if it can't ping that.

After you've done that, do the following to work on the iOS app:
1. Have a Mac (or run macOS)
2. Download the Xcode IDE.
3. Install [CocoaPods](https://cocoapods.org), used as a package manager in the same vein as `pip` for Python.
4. Inside the "MobileApp" directory, you'll find a file named `Podfile`; this specifies our dependencies. Run `pod install` in the terminal to install them.
5. Open the `MobileApp.xcworkspace` file in Xcode, and everything should be ready to go. Note that you don't use `MobileApp.xcodeproj`, it's not tied into the CocoaPods dependencies.

Ben has some lingering concerns about code signing (requires an iCloud account and he's set it up to use his), but this should more or less work. If you run into issues consult Ben.
