import React, { Component } from 'react'
import Link from 'next/link'
import glamorous, { Button } from 'glamorous'

export default class extends Component {
  onClick (interval) {
    return () => this.props.onSelect(interval)
  }

  render () {
    const Menu = glamorous.div({
      position: 'absolute',
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99
    })

    const MenuItem = glamorous.button({
      cursor: 'pointer',
      color: '#fff',
      background: '#0288d1',
      border: 0,
      borderBottom: '2px solid #01579b',
      textAlign: 'center',
      display: 'block',
      textDecoration: 'none',
      marginRight: '.25rem',
      fontSize: '1rem',
      ':hover': {
        background: '#03a9f4',
        color: '#e1f5fe'
      }
    })

    return (
      <Menu>
        <MenuItem onClick={this.onClick({ days: 1 })}>day</MenuItem>
        <MenuItem onClick={this.onClick({ days: 7 })}>week</MenuItem>
        <MenuItem onClick={this.onClick({ days: 30 })}>month</MenuItem>
        <MenuItem onClick={this.onClick({ years: 1 })}>year</MenuItem>
      </Menu>
    )
  }
}
