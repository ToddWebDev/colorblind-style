import Svg, { Circle, Defs, ClipPath } from 'react-native-svg'
import { colors } from '@/src/constants/theme'

type Props = {
  size?: number
  outline?: boolean
}

export default function LogoSvg({ size = 100, outline = false }: Props) {
  const width = size * 1.4
  const height = size
  const r = size * 0.4
  const cy = size * 0.5
  const cx1 = size * 0.48
  const cx2 = size * 0.88

  if (outline) {
    return (
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <ClipPath id='outlineClip'>
            <Circle cx={cx1} cy={cy} r={r} />
          </ClipPath>
        </Defs>
        <Circle
          cx={cx1}
          cy={cy}
          r={r}
          stroke='white'
          strokeWidth={size * 0.03}
          fill='none'
        />
        <Circle
          cx={cx2}
          cy={cy}
          r={r}
          stroke='white'
          strokeWidth={size * 0.03}
          fill='none'
        />
        <Circle
          cx={cx2}
          cy={cy}
          r={r}
          fill='white'
          clipPath='url(#outlineClip)'
        />
      </Svg>
    )
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <ClipPath id='circle1Clip'>
          <Circle cx={cx1} cy={cy} r={r} />
        </ClipPath>
        <ClipPath id='circle2Clip'>
          <Circle cx={cx2} cy={cy} r={r} />
        </ClipPath>
      </Defs>

      {/* Left circle */}
      <Circle cx={cx1} cy={cy} r={r} fill={colors.primary} opacity={0.9} />

      {/* Right circle */}
      <Circle cx={cx2} cy={cy} r={r} fill={colors.secondary} opacity={0.9} />

      {/* Intersection - clip right circle to left circle area */}
      <Circle
        cx={cx2}
        cy={cy}
        r={r}
        fill={colors.tertiary}
        opacity={0.95}
        clipPath='url(#circle1Clip)'
      />
    </Svg>
  )
}
