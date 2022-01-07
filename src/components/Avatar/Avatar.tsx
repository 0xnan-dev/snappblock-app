import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Rect } from 'react-native-svg';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#f7efb7',
    borderColor: '#ddd',
    borderWidth: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    width: 36,
    borderRadius: 36,
    marginRight: 10,
  },
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const Avatar = React.memo(() => {
  const circleList = [];
  const rectList = [];
  const lineList = [];
  const polygonList = [];

  const options: any = {
    lines: Math.random() * 10,
    polygons: Math.random() * 10,
    rectangles: Math.random() * 10,
    circles: Math.random() * 10,
    opacity: Math.random(),
  };

  for (let index = 0; index < options.circles; index++) {
    circleList.push(
      <Circle
        key={Math.random()}
        cx={Math.round(Math.random() * 50)}
        cy={Math.round(Math.random() * 100)}
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill={getRandomColor()}
        opacity={options.opacity}
      />
    );
  }

  for (let index = 0; index < options.rectangles; index++) {
    rectList.push(
      <Rect
        key={Math.random()}
        x={Math.round(Math.random() * 50)}
        y={Math.round(Math.random() * 100)}
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill={getRandomColor()}
        opacity={options.opacity}
      />
    );
  }

  for (let index = 0; index < options.lines; index++) {
    lineList.push(
      <Line
        key={Math.random()}
        x1={Math.round(Math.random() * 50)}
        y1={Math.round(Math.random() * 50)}
        x2={Math.round(Math.random() * 100)}
        y2={Math.round(Math.random() * 100)}
        stroke={getRandomColor()}
        strokeWidth="2"
      />
    );
  }

  for (let index = 0; index < options.polygons; index++) {
    polygonList.push(
      <Polygon
        key={Math.random()}
        points={`${Math.round(Math.random() * 50)},${Math.round(
          Math.random() * 50
        )} ${Math.round(Math.random() * 50)},${Math.round(
          Math.random() * 50
        )} ${Math.round(Math.random() * 50)},${Math.round(Math.random() * 50)}`}
        fill="lime"
        stroke={getRandomColor()}
        strokeWidth="1"
      />
    );
  }

  return (
    <View style={styles.avatar}>
      <Svg height="70%" width="70%" viewBox="0 0 100 100">
        {circleList}
        {rectList}
        {lineList}
      </Svg>
    </View>
  );
});
