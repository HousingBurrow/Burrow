'use client'

import { ConfigProvider } from 'antd'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
