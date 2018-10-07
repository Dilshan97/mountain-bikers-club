import math
import xml.etree.ElementTree as ET
import re
import requests

from dateutil.parser import parse as parse_time
from timezonefinder import TimezoneFinder


def cheap_ruler_distance(points):
    # https://github.com/mapbox/cheap-ruler
    cos = math.cos(points[0]['latitude'] * math.pi / 180)
    cos2 = 2 * cos * cos - 1
    cos3 = 2 * cos * cos2 - cos
    cos4 = 2 * cos * cos3 - cos2
    cos5 = 2 * cos * cos4 - cos3

    kx = 1000 * (111.41513 * cos - 0.09455 * cos3 + 0.00012 * cos5)
    ky = 1000 * (111.13209 - 0.56605 * cos2 + 0.0012 * cos4)

    size = len(points)
    distance = 0.0

    for n in range(len(points)):
        if n < size - 1:
            dx = (points[n]['longitude'] - points[n + 1]['longitude']) * kx
            dy = (points[n]['latitude'] - points[n + 1]['latitude']) * ky

            distance += math.sqrt(dx * dx + dy * dy)

    return distance


def get_location(point):
    location = None

    payload = {'lon': str(point['longitude']), 'lat': str(point['latitude'])}
    headers = {'user-agent': 'mountainbikers.club'}

    try:
        r = requests.get('https://photon.komoot.de/reverse', params=payload, headers=headers, timeout=60)
        location = r.json()
        location = location['features'][0]['properties']['city']
    except:
        return None

    return location


def get_smoothed_data(points, key=None, fn=lambda p, c, n: p * .3 + c * .4 + n * .3):
    size = len(points)

    def __filter(n):
        current_data = points[n][key] if key else points[n]

        if current_data is None:
            return False

        if 0 < n < size - 1:
            previous_data = points[n - 1][key] if key else points[n - 1]
            next_data = points[n + 1][key] if key else points[n + 1]

            if previous_data is not None and current_data is not None and next_data is not None:
                return fn(previous_data, current_data, next_data)

        return current_data

    return list(map(__filter, range(size)))


def get_smoothed_speed(points):
    size = len(points)

    def __filter(n):
        current_time = points[n]['time']

        if current_time is None:
            return 0.

        current_time = parse_time(points[n]['time'])

        if 0 < n < size - 1:
            previous_time = points[n - 1]['time']
            next_time = points[n + 1]['time']

            if previous_time is None or next_time is None:
                return 0.

            previous_time = parse_time(previous_time)
            next_time = parse_time(next_time)

            if previous_time is not None and current_time is not None and next_time is not None:
                time = math.fabs((previous_time - next_time).total_seconds())
                distance = cheap_ruler_distance([points[n - 1], points[n]]) + \
                           cheap_ruler_distance([points[n], points[n + 1]])

                return distance / time if time > 0 else 0.

        return 0.

    return get_smoothed_data(list(map(__filter, range(size))))


def get_uphill_downhill(elevations):
    uphill = 0.0
    downhill = 0.0

    for n in range(len(elevations)):
        if n > 0:
            d = elevations[n] - elevations[n - 1]
            if d > 0:
                uphill += d
            else:
                downhill -= d

    return uphill, downhill


def get_moving_data(parsed_points):
    moving_time = 0
    moving_points = []

    for n in range(len(parsed_points)):
        current_point = parsed_points[n]
        current_time = current_point['time']
        current_time = parse_time(current_time) if current_time else None

        if current_point['speed'] > 1 and n > 1 and current_time:
            previous_time = parse_time(parsed_points[n - 1]['time'])
            time = math.fabs((current_time - previous_time).total_seconds())
            moving_time += time

            moving_points.append(current_point)

    moving_distance = cheap_ruler_distance(moving_points) if len(moving_points) > 2 else 0.

    return moving_time, moving_distance


def parse(xml):
    parsed_start_datetime = None
    total_distance = {'value': 0.}
    tf = TimezoneFinder()

    def __filter(n):
        p = parsed_points[n]
        cheap_distance = 0

        # p['smoothed_elevation'] = smoothed_elevations[n]
        p['speed'] = smoothed_speeds[n] * 3600. / 1000.

        if n < 1:
            p['total_distance'] = 0.

        if n >= 1:
            cheap_distance = cheap_ruler_distance([parsed_points[n - 1], p])
            total_distance['value'] += cheap_distance / 1000.
            p['total_distance'] = total_distance['value']

        p['distance'] = cheap_distance

        if parsed_start_datetime is not None and p['time'] is not None:
            p['duration'] = (parse_time(p['time']) - parsed_start_datetime).total_seconds()
        else:
            p['duration'] = 0

        return p

    # Remove namespace to ease nodes selection
    gpx_xml = re.sub(' xmlns="[^"]+"', '', xml, count=1)
    root = ET.fromstring(gpx_xml)

    if root.tag != 'gpx' and root.attrib['version'] != '1.1':
        print('Not a GPX 1.1')

    name = root.find('metadata/name') or root.find('trk/name')
    name = name.text if name is not None else None

    description = root.find('metadata/desc') or root.find('trk/desc')
    description = description.text if description is not None else ''

    parsed_tracks = []
    tracks = root.findall('trk')
    for track in tracks:
        parsed_points = []
        segments = track.findall('trkseg')
        for segment in segments:
            points = segment.findall('trkpt')
            for point in points:
                elevation = point.find('ele')
                time = point.find('time')

                # TODO parse extensions
                current_point = {
                    'latitude': float(point.attrib['lat']),
                    'longitude': float(point.attrib['lon']),
                    'elevation': float(elevation.text) if elevation is not None else None,
                    'time': time.text if time is not None else None,
                }

                parsed_points.append(current_point)

        track_name = track.find('name')
        track_description = track.find('desc')

        smoothed_speeds = get_smoothed_speed(parsed_points)
        smoothed_elevations = get_smoothed_data(parsed_points, 'elevation')
        uphill, downhill = get_uphill_downhill(smoothed_elevations)

        start_datetime = parsed_points[0]['time']
        end_datetime = parsed_points[-1]['time']
        timezone = tf.timezone_at(lng=parsed_points[0]['longitude'], lat=parsed_points[0]['latitude'])

        total_time = None
        average_speed = None

        total_distance['value'] = 0.
        parsed_points = list(map(__filter, range(len(parsed_points))))

        moving_time, moving_distance = get_moving_data(parsed_points)
        average_moving_speed = (moving_distance / moving_time) * 3600. / 1000. if moving_time > 0 else 0.
        distance = parsed_points[-1]['total_distance']

        if start_datetime and end_datetime:
            parsed_start_datetime = parse_time(start_datetime)
            parsed_end_datetime = parse_time(end_datetime)
            total_time = math.fabs((parsed_end_datetime - parsed_start_datetime).total_seconds())
            average_speed = (distance / total_time) * 3600. / 1000.

        parsed_tracks.append({
            'name': track_name.text if track_name else None,
            'description': track_description.text if track_description else None,
            'start_datetime': start_datetime,
            'end_datetime': end_datetime,
            'timezone': timezone,
            'location': get_location(parsed_points[0]),
            'distance': distance,
            'moving_distance': moving_distance / 1000.,
            'uphill': uphill,
            'downhill': downhill,
            'min_altitude': min(smoothed_elevations),
            'max_altitude': max(smoothed_elevations),
            'max_speed': max(smoothed_speeds) * 3600. / 1000.,
            'total_time': total_time,
            'moving_time': moving_time,
            'average_speed': average_speed,
            'average_moving_speed': average_moving_speed,
            'points': parsed_points,
        })

    return name, description, parsed_tracks


def get_coordinates(points):
    return list(map(lambda p: (p['longitude'], p['latitude']), points))
