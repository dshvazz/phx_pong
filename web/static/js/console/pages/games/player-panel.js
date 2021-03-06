import React, { Component, PropTypes as PT } from 'react'
import Page from 'page'

import KeyHandler, { Events, Keys } from '../../lib/key-handler'
import { Player } from '../../types'
import { PlayerContainer } from '../../components'

export default class PlayerPanel extends Component {

  static propTypes = {
    active:       PT.bool,
    isServer:     PT.bool.isRequired,
    listenKey:    PT.number.isRequired,
    onScore:      PT.func.isRequired,
    player:       Player.isRequired,
    playerStatus: PT.oneOfType([PT.string, PT.bool]).isRequired,
  };

  constructor() {
    super()

    this.sounds = {
      'heating-up': new Audio('/sounds/heating-up.m4a'),
      'on-fire': new Audio('/sounds/on-fire.m4a')
    }
  }

  componentDidMount() {
    this.keyHandler = KeyHandler.addListener(this.props.listenKey, ::this.handleKey)
  }

  componentWillUnmount() {
    KeyHandler.removeListener(this.keyHandler)
  }

  componentWillReceiveProps({playerStatus}) {
    if (playerStatus !== this.props.playerStatus) {
      const sound = this.sounds[playerStatus]
      if (sound) sound.play()
    }
  }

  handleKey(event) {

    if (!this.props.active) return

    switch(event) {

      case Events.HOLD:
        Page('/')
        break

      case Events.TAP:
        this.props.onScore()
    }
  }

  render() {

    const { isServer, player, playerStatus } = this.props

    const scoreStyles = {
      marginTop: '2vh',
      fontSize: '20vw'
    }

    const servingMsgStyles = {
      fontSize: '5vh'
    }

    return (
      <PlayerContainer
        status={playerStatus}
        title={player.name || 'Unknown'}>

        <p style={scoreStyles}>{player.score}</p>

        { isServer ? <span style={servingMsgStyles}>Serving</span> : null }

      </PlayerContainer>
    )
  }
}
