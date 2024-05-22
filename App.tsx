/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {booleanPointInPolygon, point, polygon} from '@turf/turf';
import Mapbox, {Camera, MapView, PointAnnotation} from '@rnmapbox/maps';
import geo from './geo.json';
import type {Position} from 'geojson';
import GeoJSON from 'geojson';

Mapbox.setAccessToken(
  'sk.eyJ1Ijoiam9obmRvZTAxMiIsImEiOiJjbHdnOHM4dHYwMmJjMmpzZDN0ZnZlaTU4In0.E_4MrE2TsfQ064L1MwQZ_g',
);

const styles = StyleSheet.create({
  touchableContainer: {borderWidth: 1, width: 60, textAlign: 'center'},
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

const AnnotationContent = ({title}: {title: string}) => (
  <View style={styles.touchableContainer}>
    <Text>{title}</Text>
  </View>
);

const AllowedArea = 'Allowed Area';
const NotAllowed = 'NOT Allowed Area';

function App(): React.JSX.Element {
  const [coord, setCoord] = React.useState<Position>([]);
  const [allowed, setAlloved] = useState(false);

  const handlePress = (feature: GeoJSON.Feature) => {
    const pt = point(feature.geometry.coordinates ?? []);
    const polygons = geo.features.map(f => f.geometry.coordinates);

    const isAllowed = polygons.some(p => {
      const poly = polygon(p);
      return booleanPointInPolygon(pt, poly);
    });

    if (isAllowed) {
      setAlloved(true);
    } else {
      setAlloved(false);
    }
    setCoord(pt.geometry.coordinates);
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapView
          zoomEnabled
          id={'POLYGON'}
          style={styles.map}
          styleJSON={JSON.stringify(geo)}
          styleURL={'mapbox://styles/johndoe012/clwg99fey00ku01qs1yz3b5n0'}
          onPress={handlePress}>
          <Camera
            zoomLevel={9}
            centerCoordinate={[58.86375121885138, 23.037377915198064]}
          />
          {coord.length ? (
            <PointAnnotation coordinate={coord} id={'YES'}>
              <AnnotationContent title={allowed ? AllowedArea : NotAllowed} />
            </PointAnnotation>
          ) : null}
        </MapView>
      </View>
    </View>
  );
}

export default App;
