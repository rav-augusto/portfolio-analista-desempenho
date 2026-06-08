import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 999,
            border: '3px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: '#f59e0b',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
