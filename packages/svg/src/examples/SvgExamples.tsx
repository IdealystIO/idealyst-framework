import React from 'react';
import {
  Svg,
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Line,
  Polyline,
  Polygon,
  Text,
  TSpan,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Use,
  Symbol,
} from '../index';

/**
 * Basic shapes example
 */
export function BasicShapesExample() {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Rectangle */}
      <Rect
        x={10}
        y={10}
        width={50}
        height={50}
        fill="#3498db"
        stroke="#2980b9"
        strokeWidth={2}
        rx={5}
      />

      {/* Circle */}
      <Circle
        cx={120}
        cy={35}
        r={25}
        fill="#e74c3c"
        stroke="#c0392b"
        strokeWidth={2}
      />

      {/* Ellipse */}
      <Ellipse
        cx={50}
        cy={120}
        rx={40}
        ry={20}
        fill="#2ecc71"
        stroke="#27ae60"
        strokeWidth={2}
      />

      {/* Line */}
      <Line
        x1={100}
        y1={80}
        x2={180}
        y2={140}
        stroke="#9b59b6"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Path example - drawing a star
 */
export function PathExample() {
  const starPath = 'M50,5 L61,40 L98,40 L68,62 L79,97 L50,75 L21,97 L32,62 L2,40 L39,40 Z';

  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Path
        d={starPath}
        fill="#f1c40f"
        stroke="#f39c12"
        strokeWidth={2}
      />
    </Svg>
  );
}

/**
 * Polygon and Polyline example
 */
export function PolygonPolylineExample() {
  return (
    <Svg width={200} height={100} viewBox="0 0 200 100">
      {/* Polygon (closed shape) */}
      <Polygon
        points="25,5 45,45 5,45"
        fill="#1abc9c"
        stroke="#16a085"
        strokeWidth={2}
      />

      {/* Polyline (open shape) */}
      <Polyline
        points={[70, 40, 90, 10, 110, 40, 130, 10, 150, 40, 170, 10, 190, 40]}
        fill="none"
        stroke="#e67e22"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Text example
 */
export function TextExample() {
  return (
    <Svg width={200} height={80} viewBox="0 0 200 80">
      <Text
        x={100}
        y={30}
        textAnchor="middle"
        fontSize={24}
        fontWeight="bold"
        fill="#34495e"
      >
        Hello SVG
      </Text>
      <Text
        x={100}
        y={55}
        textAnchor="middle"
        fontSize={14}
        fill="#7f8c8d"
      >
        <TSpan fill="#e74c3c">Cross</TSpan>
        <TSpan>-platform text</TSpan>
      </Text>
    </Svg>
  );
}

/**
 * Linear gradient example
 */
export function LinearGradientExample() {
  return (
    <Svg width={150} height={100} viewBox="0 0 150 100">
      <Defs>
        <LinearGradient id="linearGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#667eea" />
          <Stop offset="100%" stopColor="#764ba2" />
        </LinearGradient>
      </Defs>
      <Rect
        x={10}
        y={10}
        width={130}
        height={80}
        rx={10}
        fill="url(#linearGrad1)"
      />
    </Svg>
  );
}

/**
 * Radial gradient example
 */
export function RadialGradientExample() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="radialGrad1" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#fff" />
          <Stop offset="100%" stopColor="#3498db" />
        </RadialGradient>
      </Defs>
      <Circle
        cx={50}
        cy={50}
        r={40}
        fill="url(#radialGrad1)"
      />
    </Svg>
  );
}

/**
 * Group and transform example
 */
export function GroupTransformExample() {
  return (
    <Svg width={150} height={150} viewBox="0 0 150 150">
      <G x={75} y={75}>
        {/* Rotate group around center */}
        <G rotation={45} originX={0} originY={0}>
          <Rect
            x={-25}
            y={-25}
            width={50}
            height={50}
            fill="#9b59b6"
          />
        </G>
        {/* Non-rotated rect for comparison */}
        <Rect
          x={-15}
          y={-15}
          width={30}
          height={30}
          fill="#3498db"
          opacity={0.7}
        />
      </G>
    </Svg>
  );
}

/**
 * ClipPath example
 */
export function ClipPathExample() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id="circleClip">
          <Circle cx={50} cy={50} r={40} />
        </ClipPath>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={100}
        height={100}
        fill="#e74c3c"
        clipPath="url(#circleClip)"
      />
    </Svg>
  );
}

/**
 * Use and Symbol example (reusable graphics)
 */
export function UseSymbolExample() {
  return (
    <Svg width={200} height={100} viewBox="0 0 200 100">
      <Defs>
        <Symbol id="heart" viewBox="0 0 32 32">
          <Path
            d="M16,28.3C16,28.3,3,19.5,3,10.5c0-4.8,3.9-8.5,8.5-8.5c2.6,0,4.9,1.1,6.5,2.9c1.6-1.8,3.9-2.9,6.5-2.9
            c4.6,0,8.5,3.7,8.5,8.5C33,19.5,16,28.3,16,28.3z"
            fill="currentColor"
          />
        </Symbol>
      </Defs>

      {/* Reuse the heart symbol with different sizes and colors */}
      <Use href="#heart" x={10} y={30} width={30} height={30} fill="#e74c3c" />
      <Use href="#heart" x={60} y={20} width={50} height={50} fill="#e91e63" />
      <Use href="#heart" x={130} y={35} width={25} height={25} fill="#9c27b0" />
    </Svg>
  );
}

/**
 * Dashed stroke example
 */
export function DashedStrokeExample() {
  return (
    <Svg width={200} height={80} viewBox="0 0 200 80">
      {/* Solid line */}
      <Line
        x1={10}
        y1={20}
        x2={190}
        y2={20}
        stroke="#34495e"
        strokeWidth={2}
      />

      {/* Dashed line (string format) */}
      <Line
        x1={10}
        y1={40}
        x2={190}
        y2={40}
        stroke="#3498db"
        strokeWidth={2}
        strokeDasharray="10,5"
      />

      {/* Dotted line (array format) */}
      <Line
        x1={10}
        y1={60}
        x2={190}
        y2={60}
        stroke="#e74c3c"
        strokeWidth={2}
        strokeDasharray={[2, 4]}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Interactive SVG example
 */
export function InteractiveSvgExample() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];

  return (
    <Svg width={200} height={60} viewBox="0 0 200 60">
      {colors.map((color, index) => (
        <Rect
          key={index}
          x={10 + index * 48}
          y={10}
          width={40}
          height={40}
          rx={5}
          fill={color}
          opacity={activeIndex === index ? 1 : 0.6}
          onPress={() => setActiveIndex(index === activeIndex ? null : index)}
        />
      ))}
    </Svg>
  );
}

/**
 * All examples combined
 */
export function AllSvgExamples() {
  return (
    <>
      <BasicShapesExample />
      <PathExample />
      <PolygonPolylineExample />
      <TextExample />
      <LinearGradientExample />
      <RadialGradientExample />
      <GroupTransformExample />
      <ClipPathExample />
      <UseSymbolExample />
      <DashedStrokeExample />
      <InteractiveSvgExample />
    </>
  );
}
