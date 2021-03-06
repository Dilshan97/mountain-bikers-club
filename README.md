# Mountain Bikers Club

## Design Resources
You are a designer and want to contribute?
We have a [dedicated GitHub repository only for you](https://github.com/mountainbikers/design-resources).

## Technologies
- The application runs with Django, Celery, PostgreSQL and Redis.
- The maps are build with Leaflet and OpenStreetMap.
- The graphs are build thanks to Bokeh.
- The JavaScript and CSS are built on top of [my frontend library](https://github.com/cedeber/eukolia).

### Python packages
- bleach
- bokeh
- boto3
- celery
- Django
- django-csp
- django-heroku
- django-robots
- django-storages
- gunicorn
- markdow2
- psycopg2-binary
- redis
- requests
- scipy
- staticmap
- timezonefinder

## Browsers support
Mountain Bikers Club doesn't support legacy browsers.

These are the minimun requirements (JavaScript is not mandatory):
- CSS variables
- CSS Grid
- ES 2017 support at minimun, as the app is loaded as an ES Module,
  which includes all API released before ES 2017.
- Web Component and Shadow DOM

## Hosting
- The website and the databases are hosted on Heroku.
- The user's files are uploaded and served via DigitalOcean Spaces.
- The DNS and the SSL certificate are managed through Cloudflare.
- The map tiles come from Komoot, OpenTopoMap and OpenCycleMap.

## Privacy
When I started to code websites in '98, we were used to listen to people's feedbacks.
This is the web I love. I am not going to install any script that do neither
statistics nor ads. As you may have noticed there is no Cookie banner.
It's not a mistake!

## Stay In Touch
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/mountainbikers)

## Contribution
Please make sure to read the [Contributing Guide](CONTRIBUTING.md) before making
a pull request.

Thank you to all [the people who already contributed to Mountain Bikers Club](https://github.com/mountainbikers/mountain-bikers-club/graphs/contributors)!

## Financial Contribution
The hosting on Heroku and DigitalOcean are not free. If you want to support the development
of the app, you can send me some money via Buy Me A Coffee.

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg)](https://www.buymeacoffee.com/cedeber)

## License
[AGPL-3.0](LICENSE)

Copyright (c) 2018-2019, Cédric Eberhardt
