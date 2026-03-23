import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const links = [
  { label: 'Treks', href: '/admin/collections/treks', description: 'Manage trek packages' },
  {
    label: 'Inquiries',
    href: '/admin/collections/inquiries',
    description: 'View booking inquiries',
  },
  {
    label: 'Homepage',
    href: '/admin/globals/homepage',
    description: 'Edit hero & featured content',
  },
  { label: 'Navigation', href: '/admin/globals/header', description: 'Manage header menus' },
]

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Yama Nepal Trek</h4>
      </Banner>
      <p className={`${baseClass}__subtitle`}>Quick links to get started:</p>
      <ul className={`${baseClass}__links`}>
        {links.map(({ label, href, description }) => (
          <li key={href}>
            <a href={href}>
              <strong>{label}</strong>
              <span>{description}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BeforeDashboard
